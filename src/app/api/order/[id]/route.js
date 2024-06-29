import { NextResponse } from "next/server";
import { connection } from '@/app/libs/mysql';

export async function DELETE(request, { params }) {
    try {
        const result = await connection.query(
            `DELETE FROM technical.order WHERE id = ${params.id}`,
        );
        console.log(result);
        return NextResponse.json( params.id );
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