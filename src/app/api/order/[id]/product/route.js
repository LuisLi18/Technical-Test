import { NextResponse } from "next/server";
import { connection } from '@/app/libs/mysql';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const results = await connection.query("SELECT * FROM technical.product WHERE orderId = ?", [id]);
        console.log(results);
        return NextResponse.json(results);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const { name, unitPrice, quantity, finalPrice } = await request.json();
        const results = await connection.query('INSERT INTO technical.product (orderId, name, unitPrice, quantity, finalPrice) VALUES (?, ?, ?, ?, ?)', [
            id,
            name,
            unitPrice,
            quantity,
            finalPrice
        ]);
        console.log(results);
        return NextResponse.json({
            id: results.insertId,
            orderId: id,
            name,
            unitPrice,
            quantity,
            finalPrice
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { productId, name, unitPrice, quantity, finalPrice } = await request.json();
        const results = await connection.query('UPDATE technical.product SET name = ?, unitPrice = ?, quantity = ?, finalPrice = ? WHERE id = ? AND orderId = ?', [
            name,
            unitPrice,
            quantity,
            finalPrice,
            productId,
            id
        ]);
        console.log(results);
        return NextResponse.json({
            id: productId,
            orderId: id,
            name,
            unitPrice,
            quantity,
            finalPrice
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
