import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { products as staticProducts } from '@/data/products';

export async function GET() {
    // Disallow seeding in production
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Forbidden: Seeding is not allowed in production.' }, { status: 403 });
    }

    try {
        await connectToDatabase();

        const count = await Product.countDocuments();

        if (count > 0) {
            return NextResponse.json({ message: 'Database already seeded', count });
        }

        const formattedProducts = staticProducts.map((p: any) => ({
            ...p,
            _id: undefined
        }));

        await Product.insertMany(formattedProducts);

        return NextResponse.json({ message: 'Database seeded successfully', count: formattedProducts.length });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
