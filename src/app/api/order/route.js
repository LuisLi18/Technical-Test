import { NextResponse } from "next/server";
import { connection } from '@/app/libs/mysql';

export async function GET() {
    try {
        const results = await connection.query("SELECT * FROM technical.order");
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

export async function POST(request) {
    try {
        const { orderNumber, numProducts, finalPrice } = await request.json();
        const results = await connection.query('INSERT INTO technical.order SET ?', {
            orderNumber,
            numProducts,
            finalPrice
        });
        console.log(results);
        return NextResponse.json({
            orderNumber,
            numProducts,
            finalPrice,
            createdAt: results.createdAt,
            id: results.insertId
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
