import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ addresses: user.addresses || [] });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { addresses } = body;

        if (!Array.isArray(addresses)) {
            return NextResponse.json({ error: "Addresses must be an array" }, { status: 400 });
        }

        await dbConnect();
        
        // Find user and update addresses
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { addresses } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.error("Error updating addresses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
