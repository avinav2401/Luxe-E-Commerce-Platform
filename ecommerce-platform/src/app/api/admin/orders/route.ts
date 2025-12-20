import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await connectToDatabase();

        // Get ALL orders for admin
        const orders = await Order.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch all orders error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
