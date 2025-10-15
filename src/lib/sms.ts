export interface SMSOptions {
    to: string;
    message: string;
}

export default async function sendSMS(options: SMSOptions): Promise<void> {
    try {
        const response = await fetch(process.env.TERMII_URL as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.TERMII_SENDER_ID,
                channel: "dnd",
                type: "plain",
                to: options.to,
                sms: options.message,
                api_key: process.env.TERMII_API_KEY,
            }),
        });

        const result = await response.json();
        console.log("📩 Termii SMS Response:", result);

        if (!response.ok) {
            throw new Error(result?.message || "Failed to send SMS via Termii");
        }
    } catch (error) {
        console.error("❌ Termii SMS Error:", error);
        throw error;
    }
}
