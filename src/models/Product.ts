import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    discount?: number;
    rating?: number;
    reviews?: number;
    seller?: mongoose.Types.ObjectId;
    isDeleted?: boolean;
}

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 20 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
