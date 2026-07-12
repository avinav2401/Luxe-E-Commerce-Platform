import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { getProducts } from '@/lib/data-service';
import Product from '@/models/Product';
import crypto from 'crypto';
import Razorpay from 'razorpay';

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
        
        const allProducts = await getProducts();
        
        let secureTotal = 0;
        const validItems = [];

        if (!orderData.items || orderData.items.length === 0) {
            return NextResponse.json({ message: 'No items in order' }, { status: 400 });
        }

        for (const item of orderData.items) {
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                return NextResponse.json({ message: 'Invalid item quantity' }, { status: 400 });
            }

            const productMatch = allProducts.find((p: any) => p.id === item.id);
            
            if (!productMatch) {
                return NextResponse.json({ message: `Product ${item.name || item.id} is no longer available.` }, { status: 400 });
            }
            
            const truePrice = productMatch.price;
            
            // Check for overselling (only for database products)
            if (item.id.match(/^[0-9a-fA-F]{24}$/)) {
                if (!productMatch || productMatch.stock < item.quantity) {
                    return NextResponse.json({ message: `Insufficient stock for product ${productMatch?.name || item.id}` }, { status: 400 });
                }
            }

            secureTotal += truePrice * item.quantity;
            validItems.push({
                product: item.id,
                quantity: item.quantity,
                price: truePrice
            });
        }

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
        if (!razorpayOrder) {
            return NextResponse.json({ message: 'Razorpay order not found' }, { status: 400 });
        }

        // secureTotal is in USD. Convert to INR (x80) and then to paise (x100) to match Razorpay.
        const secureTotalPaise = Math.round(secureTotal * 80 * 100);

        if (secureTotalPaise !== razorpayOrder.amount) {
            console.error(`Amount mismatch. Expected: ${secureTotalPaise}, Received: ${razorpayOrder.amount}`);
            return NextResponse.json({ message: 'Amount mismatch: Possible payment spoofing detected.' }, { status: 400 });
        }

        const newOrder = new Order({
            user: session.user.id,
            items: validItems,
            total: secureTotal,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: 'Razorpay',
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            paymentStatus: 'completed',
            status: 'placed'
        });

        const savedOrder = await newOrder.save();

        // Deduct Stock for database products
        for (const item of validItems) {
            if (item.product.match(/^[0-9a-fA-F]{24}$/)) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

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
