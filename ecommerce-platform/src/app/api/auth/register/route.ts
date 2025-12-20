import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate role if provided
        const validRoles = ['user', 'seller', 'admin'];
        const userRole = role && validRoles.includes(role) ? role : 'user';

        console.log('Registration request - Role received:', role);
        console.log('Registration request - Role being saved:', userRole);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        return NextResponse.json({ message: "User created successfully", userId: user._id }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
