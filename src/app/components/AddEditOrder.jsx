'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function AddEditOrder() {
    const router = useRouter();
    const { id } = useParams();

    const [order, setOrder] = useState({
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        numProducts: 0,
        finalPrice: 0,
        products: [],
    });

    const [open, setOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        if (id) {
            // Fetch the order data by id and set it to the state
            // This is just a placeholder example
            const fetchedOrder = {
                orderNumber: '12345',
                date: '2024-06-28',
                numProducts: 3,
                finalPrice: 150,
                products: [
                    { id: 1, name: 'Product 1', unitPrice: 50, qty: 2, totalPrice: 100 },
                    { id: 2, name: 'Product 2', unitPrice: 25, qty: 2, totalPrice: 50 },
                ],
            };
            setOrder(fetchedOrder);
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });
    };

    const handleSave = () => {
        // Logic to save the order
        router.push('/my-orders');
    };

    const handleAddProduct = () => {
        // Logic to add a new product
        setOpen(true);
    };

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setOpen(true);
    };

    const handleDeleteProduct = (productId) => {
        setOrder({
            ...order,
            products: order.products.filter(product => product.id !== productId),
        });
    };

    const handleProductDialogClose = () => {
        setOpen(false);
        setProductToEdit(null);
    };

    const handleProductDialogSave = (product) => {
        // Logic to save the product (either add or edit)
        setOpen(false);
        setProductToEdit(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Order' : 'Add Order'}
            </Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    label="Order Number"
                    name="orderNumber"
                    value={order.orderNumber}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Date"
                    name="date"
                    value={order.date}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled
                />
                <TextField
                    label="Number of Products"
                    name="numProducts"
                    value={order.numProducts}
                    fullWidth
                    margin="normal"
                    disabled
                />
                <TextField
                    label="Final Price"
                    name="finalPrice"
                    value={order.finalPrice}
                    fullWidth
                    margin="normal"
                    disabled
                />
                <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ marginBottom: '16px' }}>
                    Add New Product
                </Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.unitPrice}</TableCell>
                                <TableCell>{product.qty}</TableCell>
                                <TableCell>{product.totalPrice}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEditProduct(product)} sx={{ marginRight: '8px' }}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '16px' }}>
                    Save Order
                </Button>
            </Box>

            <Dialog open={open} onClose={handleProductDialogClose}>
                <DialogTitle>{productToEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {productToEdit ? 'Edit the product details' : 'Add a new product to the order'}
                    </DialogContentText>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={productToEdit ? productToEdit.name : ''}
                        onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Unit Price"
                        name="unitPrice"
                        value={productToEdit ? productToEdit.unitPrice : ''}
                        onChange={(e) => setProductToEdit({ ...productToEdit, unitPrice: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Quantity"
                        name="qty"
                        value={productToEdit ? productToEdit.qty : ''}
                        onChange={(e) => setProductToEdit({ ...productToEdit, qty: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProductDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleProductDialogSave(productToEdit)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
