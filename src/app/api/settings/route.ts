import { Setting } from "../../../../lib/models/Setting";
import connectDB from "../../../../lib/db";
import { ok } from "../../../../lib/response";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const updated = await Setting.findOneAndUpdate({}, body, { new: true, upsert: true });
    return ok(updated);
}
