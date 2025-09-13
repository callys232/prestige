import Setting from "../../../lib/models/Settings";
import connectDB from "../../../lib/db";
import { ok } from "../../../lib/response";
import { NextRequest } from "next/server";

// GET → fetch all settings
export async function GET() {
    await connectDB();
    const settings = await Setting.find();
    return ok(settings);
}

// POST → create a new setting
export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const created = await Setting.create(body);
    return ok(created);
}

// PUT → update or upsert a setting
export async function PUT(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const updated = await Setting.findOneAndUpdate(
        { key: body.key }, // update by key
        body,
        { new: true, upsert: true }
    );
    return ok(updated);
}
