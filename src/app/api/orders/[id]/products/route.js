import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const orderId = params.id;
    try {
        const products = await connection.query('SELECT * FROM technical.orderdetail WHERE orderId = ?', [orderId]);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products for order' });
    }
}