import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
