import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { withApiHandler } from "@/lib/apiHandler";

export const POST = withApiHandler(async (req: Request) => {
    // 1. Rate Limiting based on IP
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const isAllowed = rateLimit(`register_admin_${ip}`, { windowMs: 15 * 60 * 1000, max: 10 }); // max 10 admin registrations
    
    if (!isAllowed) {
        return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 2. Parse and Validate body using Zod
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    await connectToDatabase();

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await User.create({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'admin', // Forces admin role
    });

    return NextResponse.json({ message: "Admin created successfully", userId: user._id }, { status: 201 });
});
