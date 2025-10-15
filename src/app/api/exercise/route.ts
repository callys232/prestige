import { NextRequest } from "next/server";
import connectDB from "../../../lib/db";
import Exercise from "../../../lib/models/Exercise";
import WorkoutPlan from "../../../lib/models/WorkoutPlan";
import { ok, created } from "../../../lib/response";

// ✅ Create a new exercise and link it to a workout plan
export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();

    const exercise = new Exercise(body);
    await exercise.save();

    // Link exercise to workout plan
    if (body.workoutPlan) {
        await WorkoutPlan.findByIdAndUpdate(body.workoutPlan, {
            $push: { exercises: exercise._id },
        });
    }

    return created(exercise);
}

// ✅ Get exercises (optionally filtered by workout plan)
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const workoutPlanId = searchParams.get("workoutPlanId");

    const filter = workoutPlanId ? { workoutPlan: workoutPlanId } : {};
    const exercises = await Exercise.find(filter).populate("workoutPlan");

    return ok(exercises);
}
