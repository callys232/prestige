import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
    title: String,
    description: String,
    capacity: Number,
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    schedule: {
        day: String,
        time: String
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
