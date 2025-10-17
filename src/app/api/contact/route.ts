import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, program } = await req.json();

    if (!name || !phone || !program) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: `New Program Registration: ${program}`,
      text: `You have a new program registration:\n\nName: ${name}\nPhone: ${phone}\nProgram: ${program}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Email sending error:", err);

    let message = "An unknown error occurred.";
    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
