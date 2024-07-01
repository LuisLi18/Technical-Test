'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Snackbar } from '@mui/material';
import OrderForm from './OrderForm';
import ProductTable from './ProductTable';
import ProductDialog from './ProductDialog';
import ConfirmationDialog from './ConfimationDialog';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from '@/app/styles/add-edit-order.module.css'; 

export default function AddEditOrder() {
    const URL = 'http://localhost:3000';
    const router = useRouter();
    const { id } = useParams();

    const [newOrder, setNewOrder] = useState({
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        numProducts: 0,
        finalPrice: 0,
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [productList, setProductList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [productToAdd, setproductToAdd] = useState(null);
    const [addOrEditOrder, setAddOrEditOrder] = useState([]);
    const [deleteProduct, setDeleteProduct] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                try {
                    const orderRes = await fetch(`${URL}/api/orders/${id}`);
                    const orderData = await orderRes.json();
                    const transformedOrder = {
                        orderNumber: orderData.orderNumber,
                        date: orderData.createdAt.split('T')[0],
                        numProducts: orderData.numProducts,
                        finalPrice: orderData.finalPrice,
                    };

                    setNewOrder(transformedOrder);

                    const res = await fetch(`${URL}/api/orders/${id}/products`);
                    const data = await res.json();
                    setProductList(data);
                } catch (error) {
                    console.error('Failed to fetch order', error);
                }
            }
        };
        fetchOrder();
    }, [id]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${URL}/api/products`);
                const data = await res.json();
                setAvailableProducts(data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    const updateOrder = () => {
        setNewOrder({ ...newOrder, 
            numProducts: productList.length,
            finalPrice: productList.reduce((total, product) => total + product.totalPrice, 0)
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateOrder();
        setNewOrder({ ...newOrder, [name]: value, });
    };

    const handleSave = async () => {
        try {
            newOrder.products = productList;
            const res = await fetch(`${URL}/api/orders${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            const data = await res.json();
            await Promise.all(availableProducts.map(async (product) => {
                await fetch(`${URL}/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
            }));
            router.push('/my-orders');
        } catch (error) {
            console.error('Failed to save order', error);
        }
    };

    const handleAddProduct = () => {
        setAddOrEditOrder(['Add Product', 'Add a new product to the order']);
        setOpen(true);
    };

    const handleEditProduct = (product) => {
        setAddOrEditOrder(['Edit Product', 'Edit the product details']);
        setproductToAdd(product);
        setOpen(true);
    };

    const handleDeleteProduct = () => {
        handleClose();
        const productToDelete = productList.find(p => p.id === deleteProduct);
        const product = availableProducts.find(p => p.id === deleteProduct);
        product.stock += productToDelete.qty;
        setProductList(prevList => prevList.filter(product => product.id !== deleteProduct));
    };

    const handleClose = () => {
        setOpenConfirmation(false);
    };

    const handleOpen = (productId) => {
        setDeleteProduct(productId);
        setOpenConfirmation(true);
    };

    const handleProductDialogClose = () => {
        setOpen(false);
        setproductToAdd(null);
    };

    const handleProductDialogSave = (productName, quantity, actionToAddOrEdit) => {
        quantity = parseInt(quantity);
        const product = availableProducts.find(p => p.name === productName);

        if (!product) {
            console.alert('Product not found in available products.');
            return;
        }

        if (product.stock < quantity) {
            console.alert('Not enough stock available.');
            return;
        }

        const existingProduct = productList.find(p => p.name === productName);

        if (existingProduct) {
            const newQty = existingProduct.qty + quantity;

            if (product.stock < newQty - existingProduct.qty) {
                console.alert('Not enough stock available for additional quantity.');
                return;
            }

            if (actionToAddOrEdit === 'add') {
                existingProduct.qty += quantity;
            } else {
                if (existingProduct.qty > quantity) {
                    product.stock += (existingProduct.qty - quantity);
                } else {
                    product.stock -= (quantity - existingProduct.qty);
                }
                existingProduct.qty = quantity;
            }

            existingProduct.totalPrice = existingProduct.unitPrice * existingProduct.qty;
        } else {
            productList.push({
                id: product.id,
                name: product.name,
                unitPrice: product.unitPrice,
                qty: quantity,
                totalPrice: product.unitPrice * quantity
            });
        }

        if (actionToAddOrEdit === 'add') {
            product.stock -= quantity;
        }

        updateOrder();
        handleProductDialogClose();
    };

    const handleProductToAddChange = (e) => {
        const { name, value } = e.target;
        setproductToAdd({ ...productToAdd, [name]: value });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
        <Container className={styles.container}>
            <Typography variant="h4" className={styles.header}>
                {id ? 'Edit Order' : 'Add Order'}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <OrderForm
                        order={newOrder}
                        handleInputChange={handleInputChange}
                        handleAddProduct={handleAddProduct}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    {
                        productList.length > 0 ? (
                        <ProductTable
                            products={productList}
                            handleEditProduct={handleEditProduct}
                            handleOpen={handleOpen}
                        />) : <p className={styles.noProductsMessage}>Try adding products in your order</p> 
                    }
                </Grid>
            </Grid>
            <Typography variant="h6" className={styles.availableProductsHeader}>
                Available Products
            </Typography>
            <Table className={styles.table}>
                <TableHead className={styles.tableHead}>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Unit Price</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Stock</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {availableProducts.map((product) => {
                        return (
                            <TableRow key={product.id} className={styles.tableRow}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Box display="flex" justifyContent="flex-end">
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave} 
                    className={styles.saveButton}
                    startIcon={id ? <SaveIcon /> : <AddCircleIcon />}
                >
                    {id ? 'Save' : 'Add'} Order
                </Button>
            </Box>

            <ProductDialog
                open={open}
                addOrEditOrder={addOrEditOrder}
                productToAdd={productToAdd}
                availableProducts={availableProducts}
                handleProductDialogClose={handleProductDialogClose}
                handleProductDialogSave={handleProductDialogSave}
                handleProductToAddChange={handleProductToAddChange}
            />

            <ConfirmationDialog
                openConfirmation={openConfirmation}
                handleClose={handleClose}
                handleDeleteProduct={handleDeleteProduct}
            />
        </Container>
    );
}
