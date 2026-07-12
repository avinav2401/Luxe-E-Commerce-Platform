import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getProducts } from '@/lib/data-service';

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
        const productIds = products.map(p => p._id.toString());

        // Get all orders
        const allOrders = await Order.find({}).sort({ createdAt: -1 });

        // Filter orders that contain seller's products and recalculate totals
        let sellerOrders = allOrders.filter(order =>
            order.items.some((item: any) => productIds.includes(item.product.toString()))
        );

        const allProducts = await getProducts();

        // Map over orders to only include seller's items and enrich with product details
        sellerOrders = sellerOrders.map(order => {
            const orderObj = order.toObject();
            const sellerItems = orderObj.items.filter((item: any) => productIds.includes(item.product.toString()));
            
            // Enrich items with product details
            orderObj.items = sellerItems.map((item: any) => {
                const productDetails = allProducts.find((p: any) => p.id === item.product.toString());
                return {
                    ...item,
                    productDetails: productDetails || null
                };
            });
            
            // Recalculate total for just this seller's items
            orderObj.total = orderObj.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            
            return orderObj;
        });

        // Get most recent 10 orders
        const recentOrders = sellerOrders.slice(0, 10);

        return NextResponse.json({ orders: recentOrders }, { status: 200 });

    } catch (error: any) {
        console.error('Seller recent orders error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
