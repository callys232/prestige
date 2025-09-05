import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertise: [String],
    bio: String,
    schedule: [{
        day: String,
        timeSlots: [String]  // e.g., ["08:00-09:00", "10:00-11:00"]
    }]
}, { timestamps: true });

export default mongoose.models.Trainer || mongoose.model("Trainer", TrainerSchema);
