import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

export default function ProductDialog({ open, addOrEditOrder, productToAdd, availableProducts, handleProductDialogClose, handleProductDialogSave, handleProductToAddChange }) {
    const isEditMode = addOrEditOrder[0]?.toLowerCase().includes('edit');
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
                        name="product"
                        value={productToAdd ? productToAdd.product : ''}
                        label="Product"
                        onChange={handleProductToAddChange}
                        // disabled={isEditMode}
                    >
                        {availableProducts && availableProducts.map((product) => (
                            <MenuItem key={product.id} value={product.name}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Quantity"
                        name="qty"
                        value={productToAdd ? productToAdd.qty : ''}
                        onChange={(e) => handleProductToAddChange(e)}
                        fullWidth
                        margin="normal"
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleProductDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleProductDialogSave(productToAdd.product, productToAdd.qty, addOrEditOrder[0]?.split(' ')[0]?.toLowerCase() || '')} color="primary">
                    {addOrEditOrder[0] ? addOrEditOrder[0].split(' ')[0] : ''}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
