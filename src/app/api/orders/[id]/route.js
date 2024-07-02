import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const orderId = params.id;
    try {
        const order = await connection.query('SELECT * FROM technical.order WHERE id = ?', [orderId]);
        const details = await connection.query('SELECT * FROM technical.orderdetail WHERE orderId = ?', [orderId]);
        return NextResponse.json({ ...order[0], details });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' });
    }
}

export async function PUT(request, { params }) {
    const { orderNumber, numProducts, finalPrice, products } = await request.json();
    const orderId = params.id;
    try {
        await connection.query('UPDATE technical.order SET orderNumber = ?, numProducts = ?, finalPrice = ? WHERE id = ?', [orderNumber, numProducts, finalPrice, orderId]);
        await connection.query('DELETE FROM technical.orderdetail WHERE orderId = ?', [orderId]);

        for (const product of products) {
            await connection.query('INSERT INTO technical.orderdetail (orderId, productId, quantity, totalPrice) VALUES (?, ?, ?, ?)', [orderId, product.id, product.qty, product.totalPrice]);
        }

        return NextResponse.json({ orderId, orderNumber, numProducts, finalPrice });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' });
    }
}

// export async function DELETE(request, { params }) {
//     const orderId = params.id;
//     try {
//         await connection.query('DELETE FROM technical.order WHERE id = ?', [orderId]);
//         return NextResponse.json({ id: orderId });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to delete order' });
//     }
// }
export async function DELETE(request, { params }) {
    const orderId = params.id;
    try {
        // Retrieve order details
        // const orderDetails = await connection.query('SELECT * FROM technical.orderdetail WHERE orderId = ?', [orderId]);
        
        // Update product stock based on order details
        // await Promise.all(orderDetails.map(async (detail) => {
        //     const product = await connection.query('SELECT * FROM technical.product WHERE id = ?', [detail.productId]);
        //     const newStock = product[0].stock + detail.quantity;

        //     await connection.query('UPDATE technical.product SET stock = ? WHERE id = ?', [newStock, detail.productId]);
        // }));

        // Delete order details
        await connection.query('DELETE FROM technical.orderdetail WHERE orderId = ?', [orderId]);

        // Delete the order
        await connection.query('DELETE FROM technical.order WHERE id = ?', [orderId]);

        return NextResponse.json({ id: orderId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order' });
    }
}


