import { Trainer } from "@/lib/models/Trainer";
import connectDB from "@/lib/db";
import { ok, notFound } from "@/lib/response";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const trainer = await Trainer.findById(params.id).lean();
    if (!trainer) return notFound("Trainer not found");
    return ok(trainer.schedule);
}
