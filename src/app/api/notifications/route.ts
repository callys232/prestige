import { Notification } from "../../../lib/models/Notification";
// import { User } from "../../../lib/models/User";
import connectDB from "../../../lib/db";
import { created, ok, serverError, unauthorized } from "../../../lib/response";
import { NextRequest } from "next/server";
import { requireAuth } from "../../../lib/middleware/requireAuth";


export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const user = requireAuth(request);
        const body = await request.json();
        const userId = user.sub;
        const notif = new Notification({ ...body, creator: userId });
        await notif.save();
        return created(notif);
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return unauthorized("Unauthorized access");
        }
        console.error("Failed to create notification:", error);
        return serverError("Failed to create notification.");
    }
}

// get notifications by user id
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const user = requireAuth(request);
        const userId = user.sub;
        const notifications = await Notification.find({ creator: userId }).sort({ createdAt: -1 });
        return ok(notifications);
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return unauthorized("Unauthorized access");
        }
        console.error("Failed to get notifications:", error);
        return serverError("Failed to retrieve notifications.");
    }
}