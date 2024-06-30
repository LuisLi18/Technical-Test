import { connection } from '@/app/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const productId = params.id;
    try {
        const product = await connection.query('SELECT * FROM technical.product WHERE id = ?', [productId]);
        return NextResponse.json(product[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

export async function PUT(request, { params }) {
    const productId = params.id;
    const { name, unitPrice, stock } = await request.json();
    try {
        await connection.query('UPDATE technical.product SET name = ?, unitPrice = ?, stock = ? WHERE id = ?', [name, unitPrice, stock, productId]);
        return NextResponse.json({ productId, name, unitPrice, stock });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' });
    }
}

export async function DELETE(request, { params }) {
    const productId = params.id;
    try {
        await connection.query('DELETE FROM technical.product WHERE id = ?', [productId]);
        return NextResponse.json({ id: productId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' });
    }
}