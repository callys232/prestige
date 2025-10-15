// lib/mailer.ts
import nodemailer from "nodemailer";
// import { Attachment } from "nodemailer/lib/mailer";

const teamTransporter = nodemailer.createTransport({
  service: process.env.TEAM_SMTP_SERVICE,
  auth: {
    user: process.env.TEAM_EMAIL_USER, // Your email address
    pass: process.env.TEAM_EMAIL_PASS, // Your email password or app password
  },
});

export const notificationTransporter = nodemailer.createTransport({
  service: process.env.NOTIFICATION_SMTP_SERVICE,
  auth: {
    user: process.env.NOTIFICATION_EMAIL_USER, // Your email address
    pass: process.env.NOTIFICATION_EMAIL_PASS, // Your email password or app password
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: `"Prestige" <${process.env.NOTIFICATION_EMAIL_USER}>`,
    to,
    subject: "🔐 Email Verification Code – Prestige",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1e40af;">Verify Your Email</h2>
        <p>Hello,</p>

        <p>You're almost there! Use the verification code below to complete your account login to <strong>Prestige</strong>:</p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: #fff; font-size: 24px; letter-spacing: 4px; border-radius: 6px;">
            ${code}
          </span>
        </div>

        <p>This code is valid for a limited time. If you didn’t initiate this request, you can safely ignore this email.</p>

        <p>Thanks,<br/>The Prestige Team</p>

        <hr style="margin-top: 30px;"/>
        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `,
  };

  await notificationTransporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(to: string) {
  const mailOptions = {
    from: `"Prestige" <${process.env.TEAM_EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Prestige – Let's Get You Started!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1e40af;">Welcome to Prestige! 🎉</h2>
        <p>Hi there,</p>

        <p>We’re thrilled to have you join the Prestige community! Whether you’re here to explore amazing events or host unforgettable experiences, you're in great company.</p>

        <p>If you have any questions or need support, we’re just an email away.</p>

        <p>Thanks for joining us, and welcome once again!</p>

        <p>Cheers,<br/>The Prestige Team</p>

        <hr style="margin-top: 30px;"/>
        <p style="font-size: 12px; color: #777;">
          You’re receiving this email because you signed up for Prestige. If you didn’t, please ignore this message.
        </p>
      </div>
    `,
  };

  await teamTransporter.sendMail(mailOptions);
}

export async function resendOtpEmail(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: `"Prestige" <${process.env.NOTIFICATION_EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>🔐 Your OTP Code</h2>
        <p>Use the following code to verify your account login:</p>
        <h1 style="letter-spacing: 2px;">${otp}</h1>
        <p>This code will expire shortly. If you did not request this, please ignore.</p>
      </div>
    `,
  };

  await notificationTransporter.sendMail(mailOptions);
}

export async function sendResetEmail(to: string, url: string): Promise<void> {
  const mailOptions = {
    from: `"Prestige" <${process.env.NOTIFICATION_EMAIL_USER}>`,
    to,
    subject: "Password Reset",
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>🔐Reset your password</h2> 
        <p>You have requested to change your password, Use the link bellow to reset it</p>
           <div style="text-align: center; margin: 20px 0;">
          <a href=${url}>
    <Button style="display:inline-block; padding: 6px 12px; background-color: #1e40af; color: #fff; font-size: 12px; letter-spacing: 4px; border-radius: 6px;" >
      Reset Password
        </Button>
        </a>
        </div>
        <p> ${url} <p>
          <p style="letter-spacing: 2px;" > This link will expire shortly.If you did not request this, please ignore.</p>
            </div>
              `,
  };

  await notificationTransporter.sendMail(mailOptions);
}


export const sendFailureMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await notificationTransporter.sendMail({
      from: `"Prestige" < ${process.env.NOTIFICATION_EMAIL_USER}> `,
      to,
      subject,
      html,
    });

    console.log("Failure mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending failure mail:", error);
    throw error;
  }
};


export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string
): Promise<void> {
  const mailOptions = {
    from: `"Prestige" <${process.env.NOTIFICATION_EMAIL_USER}>`,
    to,
    subject: title,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 1.5rem; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1e40af; text-align: center;">📢 ${title}</h2>
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 1rem;">
          ${message}
        </p>
        <div style="margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
          <p style="font-size: 13px; color: #6b7280; text-align: center;">
            This message was sent by Prestige Fitness Center.<br/>
            Please do not reply to this automated email.
          </p>
        </div>
      </div>
    `,
  };
  console.log("Sending notification email to:", to);
  await notificationTransporter.sendMail(mailOptions);
}
