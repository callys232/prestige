import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  uuid: {
    type: String, required: true, unique: true, default: uuidv4,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, unique: true },
  phoneNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  accountDeleted: { type: Boolean, default: false },
  verificationCode: { type: String },
  refreshTokenJTI: { type: String, default: null },
  googleId: { type: String, unique: true, sparse: true },
  role: {
    type: String, enum: ["admin", "trainer", "client"], default: "client"
  },
  joinedAt: { type: Date, default: Date.now },
  membership: { type: String, enum: ["basic", "premium", "elite"] },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  isActive: { type: Boolean, default: false },
  gender: { type: String, enum: ["male", "female", "other"] },
  medicalCondition: { type: String },
  userClass: {
    type: String,
    enum: [
      "dance fitness",
      "zumba fusion",
      "afro dance burn",
      "kid fitness",
      "junior bootcamp",
      "mini movers",
      "muscle marathon",
      "endurance builder",
      "hiit express",
      "press to burn",
      "cardio blast"
    ]
  },
  goal: {
    type: String,
    enum: [
      "build muscle",
      "lose weight",
      "improve endurance",
      "increase flexibility",
      "general fitness"
    ]
  },
});

export const User = mongoose.models.Users || mongoose.model("Users", UserSchema);
