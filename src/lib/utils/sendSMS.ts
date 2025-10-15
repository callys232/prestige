import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function sendSMS(to: string, message: string) {
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message,
  });
}
