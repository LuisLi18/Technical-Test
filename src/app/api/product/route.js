import { NextResponse } from "next/server";
import { connection } from '@/app/libs/mysql';

export async function GET() {
    try {
        const [results] = await connection.query("SELECT * FROM technical.product");
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
        const { name, unitPrice, quantity, finalPrice } = await request.json();
        const results = await connection.query('INSERT INTO technical.product SET ?', {
            name,
            unitPrice,
            quantity,
            finalPrice
        });
        console.log(results);
        return NextResponse.json({
            name,
            unitPrice,
            quantity,
            finalPrice,
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
