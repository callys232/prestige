import { Booking } from "../../../../lib/models/Booking";
import connectDB from "../../../../lib/db";
import { ok, notFound } from "../../../../lib/response";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
        params.id,
        { status: "cancelled" },
        { new: true }
    );
    if (!booking) return notFound("Booking not found");
    return ok(booking);
}
