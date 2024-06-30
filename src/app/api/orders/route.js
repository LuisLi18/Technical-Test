import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server'; 

export async function GET(request, response) {
    try {
        const rows = await connection.query('SELECT * FROM technical.order');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' });
    }
}

export async function POST(request) {
    try {
        const { orderNumber, numProducts, finalPrice, products } = await request.json();
        const result = await connection.query('INSERT INTO technical.order (orderNumber, numProducts, finalPrice) VALUES (?, ?, ?)', [orderNumber, numProducts, finalPrice]);
        const orderId = result.insertId;
        console.log('orderId', orderId);
        console.log('products', products)
        for (const product of products) {
            await connection.query('INSERT INTO technical.orderdetail (orderId, productId, quantity, totalPrice) VALUES (?, ?, ?, ?)', [orderId, product.id, product.quantity, product.totalPrice]);
        }
        return NextResponse.json({ id: orderId, orderNumber, numProducts, finalPrice });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create order' });
    }
}
