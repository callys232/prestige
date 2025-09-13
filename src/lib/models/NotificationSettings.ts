import mongoose, { Schema, Document } from "mongoose";

export interface INotificationSettings extends Document {
    user: Schema.Types.ObjectId;
    email: {
        alerts: boolean;
        reminders: boolean;
        promos: boolean;
    };
    push: {
        alerts: boolean;
        reminders: boolean;
        promos: boolean;
    };
}

const NotificationSettingsSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    email: {
        alerts: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
        promos: { type: Boolean, default: true },
    },
    push: {
        alerts: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
        promos: { type: Boolean, default: true },
    },
}, { timestamps: true });

export const NotificationSettings = mongoose.models.NotificationSettings || mongoose.model<INotificationSettings>("NotificationSettings", NotificationSettingsSchema);