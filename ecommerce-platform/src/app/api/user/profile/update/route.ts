import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { name: name.trim() },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Name updated successfully',
            name: updatedUser.name
        }, { status: 200 });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
