import { Box, TextField, Button } from '@mui/material';

export default function OrderForm({ order, handleInputChange, handleAddProduct }) {
    return (
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
                value={order.products.length}
                fullWidth
                margin="normal"
                disabled
            />
            <TextField
                label="Final Price"
                name="finalPrice"
                value={order.products.reduce((total, product) => total + product.totalPrice, 0)}
                fullWidth
                margin="normal"
                disabled
            />
            <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ marginBottom: '16px' }}>
                Add New Product
            </Button>
        </Box>
    );
}
