import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import { getProducts } from '@/lib/data-service';

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

        const allProducts = await getProducts();

        const enrichedOrders = orders.map((order: any) => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.map((item: any) => {
                const productDetails = allProducts.find((p: any) => p.id === item.product);
                return {
                    ...item,
                    productDetails: productDetails || null
                };
            });
            return orderObj;
        });

        return NextResponse.json({ orders: enrichedOrders }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch all orders error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
