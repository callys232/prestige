import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan", required: true },
}, { timestamps: true });

export default mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
