import mongoose from "mongoose";

const WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
}, { timestamps: true });

export default mongoose.models.WorkoutPlan || mongoose.model("WorkoutPlan", WorkoutPlanSchema);
