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
        const { name, phone, email, password } = body;

        const updateData: any = {};

        if (name !== undefined) {
            if (!name || name.trim().length === 0) {
                return NextResponse.json({ message: 'Name cannot be empty' }, { status: 400 });
            }
            updateData.name = name.trim();
        }

        if (phone !== undefined) {
            updateData.phone = phone.trim();
        }

        if (email !== undefined) {
            if (!email || email.trim().length === 0) {
                return NextResponse.json({ message: 'Email cannot be empty' }, { status: 400 });
            }
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
            }
            updateData.email = email.trim().toLowerCase();
        }

        if (password !== undefined) {
            if (!password || password.length < 6) {
                return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
            }
            // Hash password with bcrypt
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                phone: updatedUser.phone,
                email: updatedUser.email
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
