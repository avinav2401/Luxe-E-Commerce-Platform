import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { getProducts } from '@/lib/data-service';
import Product from '@/models/Product';

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

        for (const item of items) {
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                return NextResponse.json({ message: 'Invalid item quantity' }, { status: 400 });
            }
        }

        await connectToDatabase();

        const allProducts = await getProducts();

        let secureTotal = 0;
        const validItems = [];
        
        for (const item of items) {
            const productMatch = allProducts.find((p: any) => p.id === item.id);

            if (!productMatch) {
                return NextResponse.json({ message: `Product ${item.name || item.id} is no longer available.` }, { status: 400 });
            }

            const truePrice = productMatch.price;
            
            // Check for overselling (only for database products)
            if (item.id.match(/^[0-9a-fA-F]{24}$/)) {
                if (productMatch.stock < item.quantity) {
                    return NextResponse.json({ message: `Insufficient stock for product ${productMatch.name}` }, { status: 400 });
                }
            }

            secureTotal += truePrice * item.quantity;
            validItems.push({
                product: item.id,
                quantity: item.quantity,
                price: truePrice
            });
        }

        const newOrder = new Order({
            user: session.user.id,
            items: validItems,
            total: secureTotal,
            shippingAddress,
            paymentMethod,
            status: 'placed'
        });

        const savedOrder = await newOrder.save();

        // Deduct Stock for database products
        for (const item of validItems) {
            // Only update if it's a valid ObjectId (i.e. not a static mock product)
            if (item.product.match(/^[0-9a-fA-F]{24}$/)) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

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
        console.error('Fetch orders error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
