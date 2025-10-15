import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ok } from "../../../../lib/response";

// ✅ GET one admin/user by ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return ok(user);
    } catch (error) {
        console.error("❌ GET User Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ✅ UPDATE user (PUT)
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await req.json();

        const updatedUser = await User.findByIdAndUpdate(params.id, body, {
            new: true,
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return ok(updatedUser);
    } catch (error) {
        console.error("❌ Update User Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ✅ DELETE user
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const deletedUser = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ Delete User Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
