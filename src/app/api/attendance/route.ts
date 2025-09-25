import Attendance from "../../../lib/models/Attendance";
import connectDB from "../../../lib/db";
import { ok, created } from "../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const attendance = new Attendance(body);
    await attendance.save();
    return created(attendance);
}

// get attendance by user id and class id
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const classId = searchParams.get("classId");
    const attendance = await Attendance.findOne({ user: userId, class: classId });
    return ok(attendance);
}