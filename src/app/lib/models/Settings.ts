import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
    gymName: String,
    logo: String,
    contactInfo: {
        email: String,
        phone: String,
        address: String
    },
    features: {
        promoOffers: { type: Boolean, default: true }
    }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
