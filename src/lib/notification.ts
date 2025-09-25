import { Notification } from "./models/Notification";
import connectDB from "./db";
import { NotificationSettings } from "./models/NotificationSettings";

// Create notification utility function
export const createNotification = async (
  content: string,
  creator_id: string,
  createdAt?: Date
): Promise<void> => {
  try {
    await connectDB();
    const settings = await NotificationSettings.findOne({ user: creator_id });
    // Only create a notification if the user has settings and the relevant type is enabled
    // This is a basic example; you might have more complex logic for 'type'
    if (settings && settings.email.alerts) { // Assuming 'alert' type for now
      await Notification.create({
        content,
        creator: creator_id,
        createdAt: createdAt || new Date(),
        // You can add more fields like 'type' here if needed
      });
    } else {
      console.log(`Notification not sent to user ${creator_id} due to their settings.`);
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
