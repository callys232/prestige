import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    attended: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
