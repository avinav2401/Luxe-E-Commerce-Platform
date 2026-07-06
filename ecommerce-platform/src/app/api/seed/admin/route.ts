import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * Create Admin User
 * 
 * This script creates an admin user for testing.
 * Access: POST /api/seed/admin
 * 
 * IMPORTANT: Remove this endpoint in production!
 */
export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const adminEmail = 'admin@luxe.com';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        const hashedPassword = await bcrypt.hash('admin123', 10);

        if (existingAdmin) {
            // Update existing user to admin and reset their password
            existingAdmin.role = 'admin';
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();

            return NextResponse.json({
                message: 'Existing user updated to admin and password reset',
                email: adminEmail,
                password: 'admin123',
                note: 'Please change this password after first login!'
            }, { status: 200 });
        }

        // Create new admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        return NextResponse.json({
            message: 'Admin user created successfully',
            email: adminEmail,
            password: 'admin123',
            note: 'Please change this password after first login!'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({
            message: 'Failed to create admin user',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
