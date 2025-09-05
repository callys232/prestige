import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
    name: String,
    price: Number,
    duration: Number, // days
    features: [String]
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
