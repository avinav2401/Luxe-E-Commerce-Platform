import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Seller access required' }, { status: 403 });
        }

        const { id } = await params;

        await connectToDatabase();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Verify ownership
        if (product.seller?.toString() !== session.user.id) {
            return NextResponse.json({ message: 'You can only view your own products' }, { status: 403 });
        }

        return NextResponse.json({ product }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch product error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Seller access required' }, { status: 403 });
        }

        const { id } = await params;
        const updates = await req.json();

        await connectToDatabase();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Verify ownership
        if (product.seller?.toString() !== session.user.id) {
            return NextResponse.json({ message: 'You can only edit your own products' }, { status: 403 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        return NextResponse.json({
            message: 'Product updated successfully',
            product: updatedProduct
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update product error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        if (session.user.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Seller access required' }, { status: 403 });
        }

        const { id } = await params;

        await connectToDatabase();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Verify ownership
        if (product.seller?.toString() !== session.user.id) {
            return NextResponse.json({ message: 'You can only delete your own products' }, { status: 403 });
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Delete product error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
