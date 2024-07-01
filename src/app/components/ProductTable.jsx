import { Table, TableHead, TableRow, TableCell, TableBody, Button, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '@/app/styles/product-table.module.css';

export default function ProductTable({ products, handleEditProduct, handleOpen }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
        <Container>
            <Table className={styles.table}>
                <TableHead className={styles.tableHead}>
                    <TableRow className={styles.tableHeadRow}>
                        <TableCell className={`${styles.tableCell} ${styles.tableHeadCell}`}>Name</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableHeadCell}`}>Unit Price</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableHeadCell}`}>Quantity</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableHeadCell}`}>Total Price</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableHeadCell}`}>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products && products.map((product) => (
                        <TableRow key={product.id} className={styles.tableRow}>
                            <TableCell className={styles.tableCell}>{product.name}</TableCell>
                            <TableCell className={styles.tableCell}>{formatCurrency(product.unitPrice)}</TableCell>
                            <TableCell className={styles.tableCell}>{product.qty}</TableCell>
                            <TableCell className={styles.tableCell}>{formatCurrency(product.totalPrice)}</TableCell>
                            <TableCell className={`${styles.tableCell} ${styles.optionsCell}`}>
                                <Button 
                                    variant="contained" 
                                    className={styles.editButton} 
                                    onClick={() => handleEditProduct(product)}
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="contained" 
                                    className={styles.deleteButton} 
                                    onClick={() => handleOpen(product.id)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
