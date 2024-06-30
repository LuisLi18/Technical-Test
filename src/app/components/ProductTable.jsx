import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

export default function ProductTable({ products, handleEditProduct, handleOpen }) {
    return (
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
                {products && products.map((product) => (
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
    );
}
