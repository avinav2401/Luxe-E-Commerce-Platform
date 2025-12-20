import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({
                message: 'Missing payment details'
            }, { status: 400 });
        }

        // Verify payment signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json({
                message: 'Invalid payment signature'
            }, { status: 400 });
        }

        // Payment verified, create order in database
        await connectToDatabase();

        const newOrder = new Order({
            user: session.user.id,
            items: orderData.items.map((item: any) => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: 'Razorpay',
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            paymentStatus: 'completed',
            status: 'placed'
        });

        const savedOrder = await newOrder.save();

        await User.findByIdAndUpdate(session.user.id, {
            $push: { orders: savedOrder._id }
        });

        return NextResponse.json({
            message: 'Payment verified and order created',
            orderId: savedOrder._id,
            success: true
        }, { status: 200 });

    } catch (error: any) {
        console.error('Payment verification error:', error);
        return NextResponse.json({
            message: 'Payment verification failed',
            error: error.message
        }, { status: 500 });
    }
}
