"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/app/styles/my-orders.module.css';

export default function MyOrders() {
    const URL = 'http://localhost:3000/';
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`${URL}/api/orders`);
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
            await fetch(`${URL}/api/orders/${orderToDelete.id}`, {
                method: 'DELETE',
            });
            setOrders(orders.filter(order => order.id !== orderToDelete.id));
            handleClose();
        } catch (error) {
            console.error('Failed to delete order', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
        <Container className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h4" gutterBottom>
                    My Orders
                </Typography>
                <Link href="/add-order" passHref>
                    <Button variant="contained" className={styles.addButton} startIcon={<AddIcon />}>
                        Add New Order
                    </Button>
                </Link>
            </div>
            <Table className={styles.table}>
                <TableHead className={styles.tableHead}>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell># Order</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell># Products</TableCell>
                        <TableCell>Final Price</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className={styles.tableRow}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{new Date(order.createdAt).toISOString().split('T')[0]}</TableCell>
                            <TableCell>{order.numProducts}</TableCell>
                            <TableCell>{formatCurrency(order.finalPrice)}</TableCell>
                            <TableCell>
                                <div className={styles.actions}>
                                    <Link href={`/add-order/${order.id}`} passHref>
                                        <Button variant="contained" className={styles.editButton} startIcon={<EditIcon />}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button variant="contained" className={styles.deleteButton} startIcon={<DeleteIcon />} onClick={() => handleClickOpen(order)}>
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
