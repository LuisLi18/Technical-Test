import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function ConfirmationDialog({ openConfirmation, handleClose, handleDeleteProduct }) {
    return (
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
    );
}
