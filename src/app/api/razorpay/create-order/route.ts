import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { amount, currency = 'INR', items } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        if (items && items.length > 0) {
            await connectToDatabase();
            const { getProducts } = await import('@/lib/data-service');
            const allProducts = await getProducts();
            
            for (const item of items) {
                const productMatch = allProducts.find((p: any) => p.id === item.id);
                if (!productMatch) {
                    return NextResponse.json({ message: `Product ${item.name || item.id} is no longer available.` }, { status: 400 });
                }
                if (item.id.match(/^[0-9a-fA-F]{24}$/)) {
                    if (productMatch.stock < item.quantity) {
                        return NextResponse.json({ message: `Insufficient stock for product: ${productMatch.name}` }, { status: 400 });
                    }
                }
            }
        }

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: session.user.id,
                userEmail: session.user.email || '',
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json({
            message: 'Failed to create payment order',
            error: error.message
        }, { status: 500 });
    }
}
