import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(req: Request) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ message: 'Invalid or missing ids' }, { status: 400 });
        }

        await connectToDatabase();
        
        // Find products matching the given IDs
        // Only valid ObjectIds will be queried if we use mongoose
        const validIds = ids.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
        
        const products = await Product.find({ _id: { $in: validIds } });
        
        // Transform the Mongoose documents to standard plain objects
        const transformedProducts = products.map(p => ({
            id: p._id.toString(),
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            discount: p.discount,
            rating: p.rating,
            reviews: p.reviews,
            stock: p.stock
        }));

        return NextResponse.json({ products: transformedProducts }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching batch products:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
