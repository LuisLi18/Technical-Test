import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const orderId = params.id;
    try {
        const products = await connection.query(
            `SELECT 
                p.id,
                p.name, 
                p.unitPrice, 
                od.totalPrice, 
                od.quantity AS qty
            FROM 
                technical.order o
            JOIN 
                technical.orderdetail od ON o.id = od.orderId
            JOIN 
                technical.product p ON od.productId = p.id
            WHERE 
                o.id = ?`, [orderId]);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products for order' });
    }
}