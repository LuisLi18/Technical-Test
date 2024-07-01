import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const orderDetailId = params.id;
    try {
        const orderDetail = await connection.query('SELECT * FROM technical.orderdetail WHERE id = ?', [orderDetailId]);
        return NextResponse.json(orderDetail[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order detail' });
    }
}

export async function PUT(request, { params }) {
    const orderDetailId = params.id;
    const { orderId, productId, quantity, totalPrice } = await request.json();
    try {
        await connection.query('UPDATE technical.orderdetail SET orderId = ?, productId = ?, quantity = ?, totalPrice = ? WHERE id = ?', [orderId, productId, quantity, totalPrice, orderDetailId]);
        return NextResponse.json({ orderDetailId, orderId, productId, quantity, totalPrice });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order detail' });
    }
}

export async function DELETE(request, { params }) {
    const orderDetailId = params.id;
    try {
        await connection.query('DELETE FROM technical.orderdetail WHERE id = ?', [orderDetailId]);
        return NextResponse.json("deleted order detail");
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order detail' });
    }
}