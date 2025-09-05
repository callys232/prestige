import { User } from "../../../../lib/models/User";
import connectDB from "../../../../lib/db";
import { ok } from "../../../../lib/response";

export async function GET() {
    await connectDB();
    const count = await User.countDocuments();
    return ok({ members: count });
}
