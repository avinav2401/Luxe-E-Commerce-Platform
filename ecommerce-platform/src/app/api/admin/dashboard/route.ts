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

        // Get all orders
        const allOrders = await Order.find({}).sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            totalOrders: allOrders.length,
            placed: allOrders.filter(o => o.status === 'placed').length,
            packed: allOrders.filter(o => o.status === 'packed').length,
            shipped: allOrders.filter(o => o.status === 'shipped').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: allOrders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.total, 0)
        };

        // Get recent 5 orders
        const recentOrders = allOrders.slice(0, 5);

        return NextResponse.json({
            stats,
            recentOrders
        }, { status: 200 });

    } catch (error: any) {
        console.error('Dashboard fetch error:', error);
        return NextResponse.json({
            message: 'Failed to fetch dashboard data',
            error: error.message
        }, { status: 500 });
    }
}
