import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Seller access required' }, { status: 403 });
        }

        await connectToDatabase();

        // Get seller's products
        const products = await Product.find({ seller: session.user.id });
        const activeProducts = products.filter(p => p.stock > 0);

        // Get orders containing seller's products
        const allOrders = await Order.find({});
        let totalSales = 0;
        let revenue = 0;

        allOrders.forEach(order => {
            if (order.status !== 'cancelled') {
                order.items.forEach((item: any) => {
                    const productId = item.product.toString();
                    if (products.some(p => p._id.toString() === productId)) {
                        totalSales += item.quantity;
                        if (order.status === 'delivered') {
                            revenue += item.price * item.quantity;
                        }
                    }
                });
            }
        });

        return NextResponse.json({
            totalProducts: products.length,
            activeProducts: activeProducts.length,
            totalSales,
            revenue
        }, { status: 200 });

    } catch (error: any) {
        console.error('Seller stats error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
