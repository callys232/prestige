import ClassModel from "../../../../lib/models/Class";
import connectDB from "../../../../lib/db";
import { ok, notFound } from "../../../../lib/response";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const body = await request.json();
    const updated = await ClassModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return notFound("Class not found");
    return ok(updated);
}
