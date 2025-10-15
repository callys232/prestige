import nodemailer from "nodemailer";

export default async function sendEmail(to: string, subject: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Gym App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: message,
  });
}
