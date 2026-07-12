import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        // @ts-ignore
        if (session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const { status, message } = await req.json();

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        const validStatuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        await connectToDatabase();

        // Await params in Next.js 15+
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Update order status
        const oldStatus = order.status;
        order.status = status;

        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            // Replenish stock when an order is cancelled
            for (const item of order.items) {
                if (item.product.match(/^[0-9a-fA-F]{24}$/)) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: item.quantity }
                    });
                }
            }
        } else if (oldStatus === 'cancelled' && status !== 'cancelled') {
            // Deduct stock if an order is un-cancelled
            for (const item of order.items) {
                if (item.product.match(/^[0-9a-fA-F]{24}$/)) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                }
            }
        }

        // Add tracking history entry
        order.trackingHistory.push({
            status,
            timestamp: new Date(),
            message: message || `Order ${status}`
        });

        await order.save();

        return NextResponse.json({
            message: 'Order status updated successfully',
            order
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
