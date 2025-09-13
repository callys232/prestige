import Booking from "../../../lib/models/Booking";
import connectDB from "../../../lib/db";
import { created, ok } from "../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const booking = new Booking(body);
    await booking.save();
    return created(booking);
}

// get bookings by user id
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookings = await Booking.find({ user: userId }).populate("class").populate("user");
    return ok(bookings);
}