import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const rows = await connection.query('SELECT * FROM technical.product');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' });
    }
}
    
export async function POST(request, { params }) {
    const { name, unitPrice, stock } = await request.json();
    try {
        const result = await connection.query('INSERT INTO technical.product (name, unitPrice, stock) VALUES (?, ?, ?)', [name, unitPrice, stock]);
        return NextResponse.json({ id: result.insertId, name, unitPrice, stock });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' });
    }
}