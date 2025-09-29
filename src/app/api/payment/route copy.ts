// import { Payment } from "../../../lib/models/Payment";
// import connectDB from "../../../lib/db";
// import {
//   jsonResponse,
//   ok as respondOk,
//   created as respondCreated,
//   serverError,
//   badRequest,
// } from "../../../lib/response";
// import { NextRequest } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const body = await request.json();

//     // Basic validation
//     if (!body.amount || !body.user) {
//       return badRequest("Missing required fields: 'amount' and 'user'");
//     }

//     const payment = new Payment(body);
//     await payment.save();

//     // Convert to plain object for type compatibility
//     const plainPayment = payment.toObject() as unknown as Record<string, unknown>;

//     return respondCreated(plainPayment);
//   } catch (error) {
//     console.error("POST /payment error:", error);
//     return serverError("Failed to create payment");
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();

//     const payments = await Payment.find().populate("user").lean();

//     return respondOk(payments);
//   } catch (error) {
//     console.error("GET /payment error:", error);
//     return serverError("Failed to fetch payments");
//   }
// }
