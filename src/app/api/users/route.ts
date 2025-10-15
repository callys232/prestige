import { NextRequest } from "next/server";
import connectDB from "../../../lib/db";
import { User } from "../../../lib/models/User";
import { ok, badRequest, serverError } from "../../../lib/response";

// ✅ GET /api/users?role=user
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        if (!role) return badRequest("Missing 'role' query parameter");

        const users = await User.find({ role }).select("-password"); // omit sensitive fields
        return ok(users);
    } catch (error) {
        console.error("❌ Error fetching users by role:", error);
        return serverError("Failed to fetch users");
    }
}
