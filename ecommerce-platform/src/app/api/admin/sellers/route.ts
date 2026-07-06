import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const pendingSellers = await User.find({ sellerStatus: 'pending' })
            .select('name email storeName storeDescription createdAt')
            .sort({ createdAt: -1 });

        return NextResponse.json({ applications: pendingSellers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
