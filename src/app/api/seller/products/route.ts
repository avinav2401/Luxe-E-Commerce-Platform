import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Seller access required' }, { status: 403 });
        }

        const { name, description, price, category, image, stock, discount, rating, reviews } = await req.json();

        if (!name || !description || !price || !category || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (Number(price) <= 0 || Number(stock) < 0 || Number(discount) < 0 || Number(discount) > 20) {
            return NextResponse.json({ error: 'Price, stock must be non-negative. Discount must be between 0 and 20.' }, { status: 400 });
        }

        await connectToDatabase();

        const newProduct = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            image,
            stock: Number(stock) || 0,
            discount: discount ? Number(discount) : 0,
            rating: 0,
            reviews: 0,
            seller: session.user.id
        });

        return NextResponse.json({
            message: 'Product created successfully',
            product: newProduct
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create product error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

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

        const products = await Product.find({ seller: session.user.id, isDeleted: { $ne: true } }).sort({ createdAt: -1 });

        return NextResponse.json({ products }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch products error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
