import { ClassModel } from "@/lib/models/Class";
import connectDB from "@/lib/db";
import { ok } from "@/lib/response";

export async function GET() {
    await connectDB();
    const classes = await ClassModel.find()
        .populate("bookings")
        .lean();

    const ranked = classes.sort((a, b) => (b.bookings?.length || 0) - (a.bookings?.length || 0));
    return ok(ranked.slice(0, 5));
}
