import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    method: String,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: String
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
