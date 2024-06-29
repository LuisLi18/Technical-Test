'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, 
    TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid,
    FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
                { id: 3, name: 'Product 3', unitPrice: 100, qty: 2, totalPrice: 200 },
            ],
        };
        setOrder(fetchedOrder);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${URL}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            const data = await res.json();
            // Post products associated with the new order
            await Promise.all(newOrder.products.map(async (product) => {
                await fetch(`${URL}/api/order/${data.id}/product`, {
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
        console.log(productToEdit);
            // Update existing product
        setNewOrder({
            ...newOrder,
            products: order.products.map(({name, unitPrice, qty, totalPrice}) => ({
                name: name,
                unitPrice: unitPrice,
                qty: productToEdit.qty,
                totalPrice: unitPrice * productToEdit.qty
            }))
                .filter(p => p.name === productToEdit.name)
        });
        setOrder({
            ...order,
            products: order.products.map(({name, unitPrice, qty, totalPrice}) => ({
                name: name,
                unitPrice: unitPrice,
                qty: name===productToEdit.name?(qty - productToEdit.qty): qty,
                totalPrice: name===productToEdit.name?(unitPrice * (qty - productToEdit.qty)): totalPrice,
            }))
        });
        
        handleProductDialogClose();
    };
    

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Order' : 'Add Order'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            label="Order Number"
                            name="orderNumber"
                            value={newOrder.orderNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Date"
                            name="date"
                            value={newOrder.date}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                        <TextField
                            label="Number of Products"
                            name="numProducts"
                            value={newOrder.products.length}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                        <TextField
                            label="Final Price"
                            name="finalPrice"
                            value={newOrder.products.reduce((total, product) => total + product.totalPrice, 0)}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                        <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ marginBottom: '16px' }}>
                            Add New Product
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newOrder.products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.unitPrice}</TableCell>
                                    <TableCell>{product.qty}</TableCell>
                                    <TableCell>{product.totalPrice}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleEditProduct(product)} sx={{ marginRight: '8px' }}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleOpen(product.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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

            <Dialog open={open} onClose={handleProductDialogClose}>
                <DialogTitle>{addOrEditOrder[0]}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {addOrEditOrder[1]}
                    </DialogContentText>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="product-select-label">Product</InputLabel>
                        <Select
                            labelId="product-select-label"
                            id="product-select"
                            value={productToEdit ? productToEdit.name : ''}
                            label="Product"
                            onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
                        >
                            {order.products.map((product) => (
                                <MenuItem key={product.id} value={product.name}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Quantity"
                            name="qty"
                            value={productToEdit ? productToEdit.qty : ''}
                            onChange={(e) => setProductToEdit({ ...productToEdit, qty: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>
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
            
            <Dialog open={openConfirmation} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProduct} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
