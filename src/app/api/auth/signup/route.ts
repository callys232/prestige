import { NextResponse } from "next/server";
import { z } from "zod"; import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../../../../lib/mailer";
import { generateUsername, generateVerificationCode, splitFullName } from "../../../../lib/utils";
import connectDB from "../../../../lib/db";
import { User } from "../../../../lib/models/User";

// ✅ Zod schema with optional fields included
const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  trainerId: z.string().optional(),
  gender: z.string().optional(),
  medicalCondition: z.string().optional(),
  userClass: z.string().optional(),
  goal: z.string().optional(),
  role: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    // ✅ Validate before connecting to DB
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const {
      fullName,
      email,
      password,
      trainerId,
      gender,
      medicalCondition,
      userClass,
      goal,
      role,
    } = parsed.data;

    // ✅ Check for existing account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Hash password and generate meta fields
    const joinedAt = new Date();
    const hashedPassword = await bcrypt.hash(password, 12);
    const username = await generateUsername(joinedAt);
    const verificationCode = generateVerificationCode();
    const nameParts = await splitFullName(fullName);
    const { firstName, lastName } = nameParts;

    // ✅ Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username,
      verificationCode,
      isVerified: false,
      joinedAt,
      trainerId,
      gender,
      medicalCondition,
      userClass,
      goal,
      role: role || "client",
    });

    await newUser.save();

    // ✅ Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Admin Sign-Up Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
