import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackingUpdate {
    status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    timestamp: Date;
    message?: string;
}

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: {
        product: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    trackingHistory: ITrackingUpdate[];
    estimatedDelivery: Date;
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentId?: string;
    razorpayOrderId?: string;
    paymentStatus?: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        }
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    trackingHistory: [
        {
            status: {
                type: String,
                enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
                required: true
            },
            timestamp: { type: Date, default: Date.now },
            message: { type: String }
        }
    ],
    estimatedDelivery: { type: Date },
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
}, { timestamps: true });

// Pre-save hook to initialize tracking history and estimated delivery
OrderSchema.pre('save', function (next) {
    if (this.isNew) {
        // Add initial tracking entry
        this.trackingHistory = [{
            status: 'placed',
            timestamp: new Date(),
            message: 'Order placed successfully'
        }];

        // Calculate estimated delivery (5 business days from now)
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 5);
        this.estimatedDelivery = estimatedDate;
    }
    next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
