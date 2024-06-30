import { connection } from '@/app/libs/mysql';

export async function GET(request, { params }) {
    const orderDetailId = params.id;
    try {
        const [orderDetail] = await connection.query('SELECT * FROM technical.orderdetail WHERE id = ?', [orderDetailId]);
        res.status(200).json(orderDetail[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order detail' });
    }
}

export async function PUT(request, { params }) {
    const orderDetailId = params.id;
    const { orderId, productId, quantity, totalPrice } = await request.json();
    try {
        await connection.query('UPDATE technical.orderdetail SET orderId = ?, productId = ?, quantity = ?, totalPrice = ? WHERE id = ?', [orderId, productId, quantity, totalPrice, orderDetailId]);
        res.status(200).json({ orderDetailId, orderId, productId, quantity, totalPrice });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order detail' });
    }
}

export async function DELETE(request, { params }) {
    const orderDetailId = params.id;
    try {
        await connection.query('DELETE FROM technical.orderdetail WHERE id = ?', [orderDetailId]);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order detail' });
    }
}