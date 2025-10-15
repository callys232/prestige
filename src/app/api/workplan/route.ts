import { NextRequest } from "next/server";
import connectDB from "../../../lib/db";
import WorkoutPlan from "../../../lib/models/WorkoutPlan";
import { ok, created } from "../../../lib/response";

// ✅ Create a new workout plan
export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const workoutPlan = new WorkoutPlan(body);
    await workoutPlan.save();
    return created(workoutPlan);
}

// ✅ Get all workout plans (optionally by name or id)
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    const query: { [key: string]: unknown } = {};
    if (id) query._id = id;
    if (name) query.name = name;

    const plans = await WorkoutPlan.find(query).populate("exercises");
    return ok(plans);
}
