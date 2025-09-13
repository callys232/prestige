import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId; // reference to the user
    amount: number;
    status: "pending" | "completed" | "failed";
    method: string; // e.g. "card", "paypal", "bank_transfer"
    reference?: string; // transaction reference (optional)
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        method: { type: String, required: true },
        reference: { type: String },
    },
    { timestamps: true }
);

// Prevent model overwrite in dev (Next.js hot reload issue)
export const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
