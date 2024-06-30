import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

export default function ProductDialog({ open, addOrEditOrder, productToEdit, orderProducts, handleProductDialogClose, handleProductDialogSave, handleProductToEditChange }) {
    return (
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
                        onChange={handleProductToEditChange}
                    >
                        {orderProducts.map((product) => (
                            <MenuItem key={product.id} value={product.name}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Quantity"
                        name="qty"
                        value={productToEdit ? productToEdit.qty : ''}
                        onChange={(e) => handleProductToEditChange(e)}
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
    );
}
