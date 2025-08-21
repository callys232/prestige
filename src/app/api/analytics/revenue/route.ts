import { Payment } from "@/lib/models/Payment";
import connectDB from "@/lib/db";
import { ok } from "@/lib/response";

export async function GET() {
    await connectDB();
    const revenue = await Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    return ok({ revenue: revenue[0]?.total || 0 });
}
