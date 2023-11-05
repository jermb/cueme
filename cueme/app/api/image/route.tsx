import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest, res: NextResponse) {

    // console.log(await req.blob().);

    return NextResponse.json(
        { message: JSON.stringify(req.json()) },
        { status: 201 }
    );


}