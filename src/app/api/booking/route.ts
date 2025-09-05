import { Booking } from "../../../../lib/models/Booking";
import connectDB from "../../../../lib/db";
import { created } from "../../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const booking = new Booking(body);
    await booking.save();
    return created(booking);
}
