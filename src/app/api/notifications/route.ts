import { Notification } from "@/lib/models/Notification";
import connectDB from "@/lib/db";
import { created } from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const notif = new Notification(body);
    await notif.save();
    return created(notif);
}

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const notif = new Notification(body);
    await notif.save();
    return created(notif);
}