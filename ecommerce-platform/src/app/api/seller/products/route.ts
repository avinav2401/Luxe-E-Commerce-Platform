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

        const { name, description, price, category, image, stock } = await req.json();

        if (!name || !description || !price || !category || !image) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock: stock || 0,
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

        const products = await Product.find({ seller: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ products }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch products error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
