import { Attendance } from "@/lib/models/Attendance";
import connectDB from "@/lib/db";
import { created } from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const attendance = new Attendance(body);
    await attendance.save();
    return created(attendance);
}
