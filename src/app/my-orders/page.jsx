"use client"
import { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function MyOrders() {
    // Ejemplo de datos
    const initialOrders  = [
        { id: 1, orderNumber: '12345', date: '2024-06-28', numProducts: 3, finalPrice: '$150.00' },
        { id: 2, orderNumber: '67890', date: '2024-06-27', numProducts: 5, finalPrice: '$300.00' },
    ];

    const [orders, setOrders] = useState(initialOrders);
    const [open, setOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const handleClickOpen = (order) => {
        setOrderToDelete(order);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOrderToDelete(null);
    };

    const handleDelete = () => {
        setOrders(orders.filter(order => order.id !== orderToDelete.id));
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Number of Products</TableCell>
                        <TableCell>Final Price</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.numProducts}</TableCell>
                            <TableCell>{order.finalPrice}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" style={{ marginRight: '8px' }}>
                                    Edit Order
                                </Button>
                                <Button variant="contained" color="secondary" onClick={()=>handleClickOpen(order)}>
                                    Delete Order
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
                Add New Order
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete order #{orderToDelete?.orderNumber}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
