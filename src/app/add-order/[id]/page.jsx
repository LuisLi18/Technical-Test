import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function AddEditOrder() {
    const router = useRouter();
    const { id } = router.query;

    const [order, setOrder] = useState({
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        numProducts: 0,
        finalPrice: 0,
        products: [],
    });

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
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Order
                </Button>
            </Box>
        </Container>
    );
}
