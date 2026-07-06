import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: "India" },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
        image: { type: String },
        phone: { type: String },
        addresses: [AddressSchema],
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
        provider: { type: String, default: "credentials" },
        googleId: { type: String },
        sellerStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
        storeName: { type: String },
        storeDescription: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
