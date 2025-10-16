import Trainer from "../../../lib/models/Trainer";
import connectDB from "../../../lib/db";
import { created } from "../../../lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const trainer = new Trainer(body);
  await trainer.save();
  return created(trainer);
}

// get all trainers
export async function GET() {
  await connectDB();
  const trainers = await Trainer.find().lean();
  return created(trainers);
}
