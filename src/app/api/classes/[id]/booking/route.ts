import { ClassModel } from "../../../../lib/models/Class";
import connectDB from "../../../../lib/db";
import { ok, notFound } from "../../../../lib/response";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const classData = await ClassModel.findById(params.id).populate("bookings").lean();
    if (!classData) return notFound("Class not found");
    return ok(classData.bookings);
}
