'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Snackbar } from '@mui/material';
import OrderForm from './OrderForm';
import ProductTable from './ProductTable';
import ProductDialog from './ProductDialog';
import ConfirmationDialog from './ConfimationDialog';

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
    // show the available products
    const [availableProducts, setAvailableProducts] = useState([]);

    // list of product to add to the order
    const [productList, setProductList] = useState([]);

    // open dialogs
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    // product that user wants to add in Product Dialog
    const [productToAdd, setproductToAdd] = useState(null);

    // add or edit order in Product Dialog (it's only a tag)
    const [addOrEditOrder, setAddOrEditOrder] = useState([]);

    // product to delete in Confirmation Dialog (is an id)
    const [deleteProduct, setDeleteProduct] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                try {
                    // actualiza la información del pedido
                    const orderRes = await fetch(`${URL}/api/orders/${id}`);
                    const orderData = await orderRes.json();
                    // Transformar la respuesta para ajustar el estado `newOrder`
                    const transformedOrder = {
                        orderNumber: orderData.orderNumber,
                        date: orderData.createdAt.split('T')[0],
                        numProducts: orderData.numProducts,
                        finalPrice: orderData.finalPrice,
                    };

                    setNewOrder(transformedOrder);

                    // actualiza la lista de productos del pedido
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
                // actualiza la lista de productos disponibles
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
            // console.newOrder('new Order', newOrder);
            // Save or Update the order
            const res = await fetch(`${URL}/api/orders${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            const data = await res.json();
            console.log('Saved order:', data);

            // Update the stock of the products
            await Promise.all(availableProducts.map(async (product) => {
                console.log("PRODUCT", product);
                await fetch(`${URL}/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
            }));
            console.log('Updated products:', availableProducts);
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
        // Aumentar el stock del producto eliminado
        const productToDelete = productList.find(p => p.id === deleteProduct);
        const product = availableProducts.find(p => p.id === deleteProduct);

        product.stock += productToDelete.qty;

        // Eliminar el producto de la lista
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
        // Encontrar el producto en availableProducts
        const product = availableProducts.find(p => p.name === productName);

        if (!product) {
            console.alert('Product not found in available products.');
            return;
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            console.alert('Not enough stock available.');
            return;
        }

        // Encontrar si el producto ya está en la lista de productos
        const existingProduct = productList.find(p => p.name === productName);

        if (existingProduct) {
            // Si el producto ya existe, sumar la cantidad
            const newQty = existingProduct.qty + quantity;
            
            // Verificar si hay suficiente stock
            if (product.stock < newQty - existingProduct.qty) {
                console.alert('Not enough stock available for additional quantity.');
                return;
            }
            // Condicional para editar la cantidad de productos
            if (actionToAddOrEdit == 'add'){
                existingProduct.qty += quantity;
            }
            else{
                console.log('Existing product:', existingProduct.qty)
                console.log('Quantity:', quantity)
                if (existingProduct.qty > quantity){
                    product.stock += (existingProduct.qty - quantity);
                }
                else{
                    product.stock -= (quantity - existingProduct.qty);
                }
                existingProduct.qty = quantity;
            }

            existingProduct.totalPrice = existingProduct.unitPrice * existingProduct.qty;
        } else {
            // Si el producto es nuevo, añadirlo a la lista
            productList.push({
                id: product.id,
                name: product.name,
                unitPrice: product.unitPrice,
                qty: quantity,
                totalPrice: product.unitPrice * quantity
            });
        }

        // Restar la cantidad del stock de availableProducts
        // Considerar una condicional para restar o sumar el stock
        if (actionToAddOrEdit == 'add') {
            product.stock -= quantity;
        }

        updateOrder();
        console.log('Product added to list:', productList);
        console.log('Updated available products:', availableProducts);

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
        <Container>
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Order' : 'Add Order'}
            </Typography>
            <Grid container spacing={2}>
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
                        />) : <p>Try adding products in your order</p> 
                    }
                </Grid>
            </Grid>
            <h1>Available Products</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Stock Used</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {availableProducts && availableProducts.map((product) => {
                            const usedStock = productList.find(p => p.id === product.id)?.qty || 0;
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        {usedStock > 0 ? (
                                            <span style={{ color: 'red' }}>
                                                {usedStock} <span style={{ fontSize: 'small' }}>↓</span>
                                            </span>
                                        ) : (
                                            <span>{usedStock}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>

            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '16px' }}>
                {id ? 'Save' : 'Add'} Order
            </Button>

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
