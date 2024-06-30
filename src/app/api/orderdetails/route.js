import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const rows = await connection.query('SELECT * FROM technical.orderdetail');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order details' });
    }
}

export async function POST(request, { params }) {
    const { orderId, productId, quantity, totalPrice } = await request.json();
    try {
        const result = await connection.query('INSERT INTO technical.orderdetail (orderId, productId, quantity, totalPrice) VALUES (?, ?, ?, ?)', [orderId, productId, quantity, totalPrice]);
        return NextResponse.json({ id: result.insertId, orderId, productId, quantity, totalPrice });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order detail' });
    }
}