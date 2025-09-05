import { Payment } from "../../../../lib/models/Payment";
import connectDB from "../../../../lib/db";
import { created } from "../../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const payment = new Payment(body);
    await payment.save();
    return created(payment);
}

export async function GET() {
    await connectDB();
    const payments = await Payment.find().populate("user").lean();
    return ok(payments);
}