import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { rating } = await req.json();

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ message: 'Invalid rating. Must be a number between 1 and 5.' }, { status: 400 });
        }

        await connectToDatabase();

        const { id: productId } = await params;
        const userId = session.user.id;

        if (!mongoose.isValidObjectId(productId)) {
            return NextResponse.json({ message: 'Invalid product ID format. This may be a legacy test order.' }, { status: 400 });
        }

        // Verify the user has actually purchased this product and the order is delivered
        const hasDeliveredOrder = await Order.findOne({
            user: userId,
            status: 'delivered',
            'items.product': productId
        });

        if (!hasDeliveredOrder) {
            return NextResponse.json({ message: 'You can only rate products that have been delivered to you.' }, { status: 403 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Initialize ratingsList if it doesn't exist
        if (!product.ratingsList) {
            product.ratingsList = [];
        }

        // Check if user has already rated
        const existingRatingIndex = product.ratingsList.findIndex((r: any) => r.user.toString() === userId);

        if (existingRatingIndex >= 0) {
            // Update existing rating
            product.ratingsList[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            product.ratingsList.push({ user: new mongoose.Types.ObjectId(userId), rating: rating });
        }

        product.markModified('ratingsList'); // Ensure Mongoose detects the array change

        // Recalculate overall rating and reviews count
        const totalRatings = product.ratingsList.length;
        const sumRatings = product.ratingsList.reduce((acc: number, curr: any) => acc + curr.rating, 0);
        
        product.reviews = totalRatings;
        product.rating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(1)) : 0;

        await product.save();

        return NextResponse.json({ 
            message: 'Rating submitted successfully', 
            rating: product.rating, 
            reviews: product.reviews 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Rating error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
