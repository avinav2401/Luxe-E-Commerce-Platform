import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        await connectToDatabase();

        const accounts = [
            { name: 'Admin User', email: 'admin@luxe.com', password: 'admin123', role: 'admin' },
            { name: 'Seller User', email: 'seller@luxe.com', password: 'seller123', role: 'seller' },
            { name: 'Demo User', email: 'user@luxe.com', password: 'user123', role: 'user' },
        ];

        let createdCount = 0;

        for (const acc of accounts) {
            const existing = await User.findOne({ email: acc.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(acc.password, 10);
                await User.create({
                    name: acc.name,
                    email: acc.email,
                    password: hashedPassword,
                    role: acc.role,
                });
                createdCount++;
            }
        }

        return NextResponse.json({ message: "Demo accounts ready", created: createdCount }, { status: 200 });
    } catch (error: any) {
        console.error('Setup demo accounts error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
