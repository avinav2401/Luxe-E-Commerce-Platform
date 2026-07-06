import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { storeName, storeDescription } = body;

        if (!storeName || storeName.trim().length === 0) {
            return NextResponse.json({ message: 'Store Name is required' }, { status: 400 });
        }
        if (!storeDescription || storeDescription.trim().length === 0) {
            return NextResponse.json({ message: 'Store Description is required' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.sellerStatus === 'pending') {
            return NextResponse.json({ message: 'You already have a pending application' }, { status: 400 });
        }

        if (user.role === 'seller' || user.sellerStatus === 'approved') {
            return NextResponse.json({ message: 'You are already a seller' }, { status: 400 });
        }

        user.sellerStatus = 'pending';
        user.storeName = storeName.trim();
        user.storeDescription = storeDescription.trim();
        await user.save();

        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Become seller error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
