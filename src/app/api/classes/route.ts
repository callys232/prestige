import ClassModel from "../../../lib/models/Class";
import connectDB from "../../../lib/db";
import { created } from "../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const newClass = new ClassModel(body);
    await newClass.save();
    return created(newClass);
}

//get all classes
export async function GET() {
    await connectDB();
    const classes = await ClassModel.find().lean();
    return created(classes);
}   