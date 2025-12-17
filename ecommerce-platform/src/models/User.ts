import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        image: { type: String },
        phone: { type: String },
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
