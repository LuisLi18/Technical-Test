'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import OrderForm from './OrderForm';
import ProductTable from './ProductTable';
import ProductDialog from './ProductDialog';
import ConfirmationDialog from './ConfimationDialog';

export default function AddEditOrder() {
    const URL = 'http://localhost:3000';
    const router = useRouter();
    const { id } = useParams();

    const [order, setOrder] = useState({
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        numProducts: 0,
        finalPrice: 0,
        products: [],
    });
    const [newOrder, setNewOrder] = useState({
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        numProducts: 0,
        finalPrice: 0,
        products: [],
    });

    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [addOrEditOrder, setAddOrEditOrder] = useState([]);
    const [deleteProduct, setDeleteProduct] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                try {
                    const res = await fetch(`${URL}/api/orders/${id}`);
                    const data = await res.json();
                    setOrder(data);
                    setNewOrder(data);
                } catch (error) {
                    console.error('Failed to fetch order', error);
                }
            }
        };
        fetchOrder();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${URL}/api/orders${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            const data = await res.json();
            // Post products associated with the new order
            await Promise.all(newOrder.products.map(async (product) => {
                await fetch(`${URL}/api/orders/${data.id}/products`, {
                    method: 'POST',
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
        setProductToEdit(product);
        setOpen(true);
    };

    const handleDeleteProduct = () => {
        handleClose();
        setNewOrder({
            ...newOrder,
            products: newOrder.products.filter(product => product.id !== deleteProduct),
        });
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
        setProductToEdit(null);
    };

    const handleProductDialogSave = (product) => {
        if (productToEdit) {
            // Update existing product
            setNewOrder({
                ...newOrder,
                products: newOrder.products.map(p => p.id === productToEdit.id ? productToEdit : p)
            });
        } else {
            // Add new product
            setNewOrder({
                ...newOrder,
                products: [...newOrder.products, { ...product, id: newOrder.products.length + 1 }]
            });
        }
        handleProductDialogClose();
    };

    const handleProductToEditChange = (e) => {
        const { name, value } = e.target;
        setProductToEdit({ ...productToEdit, [name]: value });
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
                    <ProductTable
                        products={newOrder.products}
                        handleEditProduct={handleEditProduct}
                        handleOpen={handleOpen}
                    />
                </Grid>
            </Grid>
            <h1>Available Products</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Stock</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.unitPrice}</TableCell>
                            <TableCell>{product.qty}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '16px' }}>
                {id ? 'Save' : 'Add'} Order
            </Button>

            <ProductDialog
                open={open}
                addOrEditOrder={addOrEditOrder}
                productToEdit={productToEdit}
                orderProducts={order.products}
                handleProductDialogClose={handleProductDialogClose}
                handleProductDialogSave={handleProductDialogSave}
                handleProductToEditChange={handleProductToEditChange}
            />

            <ConfirmationDialog
                openConfirmation={openConfirmation}
                handleClose={handleClose}
                handleDeleteProduct={handleDeleteProduct}
            />
        </Container>
    );
}
