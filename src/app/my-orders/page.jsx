import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

export default function MyOrders() {
    // Ejemplo de datos
    const orders = [
        { id: 1, orderNumber: '12345', date: '2024-06-28', numProducts: 3, finalPrice: '$150.00' },
        { id: 2, orderNumber: '67890', date: '2024-06-27', numProducts: 5, finalPrice: '$300.00' },
    ];

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
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.numProducts}</TableCell>
                            <TableCell>{order.finalPrice}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" style={{ marginRight: '8px' }}>
                                    Edit Order
                                </Button>
                                <Button variant="contained" color="secondary">
                                    Delete Order
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
                Add New Order
            </Button>
        </Container>
    );
}
