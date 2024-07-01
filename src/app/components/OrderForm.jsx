import { Box, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/app/styles/order-form.module.css';

export default function OrderForm({ order, handleInputChange, handleAddProduct }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };
    return (
        <Box component="form" noValidate autoComplete="off" className={styles.formContainer}>
            <TextField
                label="Order Number"
                name="orderNumber"
                value={order.orderNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                className={styles.textField}
            />
            <TextField
                label="Date"
                name="date"
                value={order.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled
                className={`${styles.textField} ${styles.textFieldDisabled}`}
            />
            <TextField
                label="Number of Products"
                name="numProducts"
                value={order.numProducts}
                fullWidth
                margin="normal"
                disabled
                className={`${styles.textField} ${styles.textFieldDisabled}`}
            />
            <TextField
                label="Final Price"
                name="finalPrice"
                value={formatCurrency(order.finalPrice)}
                fullWidth
                margin="normal"
                disabled
                className={`${styles.textField} ${styles.textFieldDisabled}`}
            />
            <Button variant="contained" onClick={handleAddProduct} className={styles.addButton} startIcon={<AddIcon />}>
                Add New Product
            </Button>
        </Box>
    );
}
