import { NextRequest } from "next/server";
import connectDB from "../../../lib/db";
import { User } from "../../../lib/models/User";
import Trainer from "../../../lib/models/Trainer";
import { badRequest, serverError, created } from "../../../lib/response";
import { sendNotificationEmail } from "../../../lib/mailer";
import sendSMS from "../../../lib/sms";
import { getDelayUntil } from "../../../lib/utils";


// ✅ POST /api/notify
// Body: { title, message, channel, schedule, audience, id? }

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { title, message, channel, schedule, audience, id } = body;

        if (!title || !message || !channel || !schedule || !audience)
            return badRequest("Missing required fields");

        let recipients: { email?: string; phone?: string }[] = [];

        // 🎯 Select audience
        if (audience === "all-users") {
            recipients = await User.find({}, "email phone");
        } else if (audience === "all-trainers") {
            recipients = await Trainer.find({}, "email phone");
        } else if (audience === "user") {
            if (!id) return badRequest("User ID required for audience 'user'");
            const user = await User.findById(id, "email phone");
            if (user) recipients.push(user);
        } else if (audience === "trainer") {
            if (!id) return badRequest("Trainer ID required for audience 'trainer'");
            const trainer = await Trainer.findById(id, "email phone");
            if (trainer) recipients.push(trainer);
        } else {
            return badRequest("Invalid audience value");
        }

        if (recipients.length === 0)
            return badRequest("No recipients found for the selected audience");

        // 🕒 Handle scheduling
        const delay = schedule === "now" ? 0 : getDelayUntil(schedule);

        const sendNotification = async () => {
            for (const recipient of recipients) {
                const email = recipient.email;
                const phone = recipient.phone;

                if ((channel === "email" || channel === "both") && email) {
                    await sendNotificationEmail(email, title, message);
                }
                if ((channel === "sms" || channel === "both") && phone) {
                    await sendSMS({ to: phone, message });
                }
            }
        };

        if (delay > 0) {
            setTimeout(sendNotification, delay);
        } else {
            await sendNotification();
        }

        return created({
            title,
            message,
            channel,
            schedule,
            audience,
            sentTo: recipients.length,
            status: delay > 0 ? "Scheduled" : "Sent",
        });
    } catch (err) {
        console.error("Notify API error:", err);
        return serverError("Failed to send notification");
    }
}
