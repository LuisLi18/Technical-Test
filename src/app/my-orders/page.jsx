"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function MyOrders() {
    const URL = 'http://localhost:3000/';
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`${URL}/api/order`);
            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    const handleClickOpen = (order) => {
        setOrderToDelete(order);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOrderToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await fetch(`${URL}/api/order/${orderToDelete.id}`, {
                method: 'DELETE',
            });
            setOrders(orders.filter(order => order.id !== orderToDelete.id));
            handleClose();
        } catch (error) {
            console.error('Failed to delete order', error);
        }
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
                            <TableCell>{new Date(order.createdAt).toISOString().split('T')[0]}</TableCell>
                            <TableCell>{order.numProducts}</TableCell>
                            <TableCell>{order.finalPrice}</TableCell>
                            <TableCell>
                                <Link href={`/add-order/${order.id}`} passHref>
                                    <Button variant="contained" color="primary" sx={{ marginRight: '8px' }}>
                                        Edit Order
                                    </Button>
                                </Link>
                                <Button variant="contained" color="secondary" onClick={() => handleClickOpen(order)}>
                                    Delete Order
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link href="/add-order" passHref>
                <Button variant="contained" color="primary" sx={{ marginTop: '16px' }}>
                    Add New Order
                </Button>
            </Link>

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
