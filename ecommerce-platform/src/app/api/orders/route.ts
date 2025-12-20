import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { items, total, shippingAddress, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ message: 'No items in order' }, { status: 400 });
        }

        await connectToDatabase();

        const newOrder = new Order({
            user: session.user.id,
            items: items.map((item: any) => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total,
            shippingAddress,
            paymentMethod,
            status: 'placed'
        });

        const savedOrder = await newOrder.save();

        await User.findByIdAndUpdate(session.user.id, {
            $push: { orders: savedOrder._id }
        });

        return NextResponse.json({ message: 'Order created successfully', orderId: savedOrder._id }, { status: 201 });

    } catch (error: any) {
        console.error('Order creation error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
