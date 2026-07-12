import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';

export async function GET() {
    try {
        await connectToDatabase();
        const orders = await Order.find({});
        let updatedCount = 0;

        for (const order of orders) {
            let modified = false;
            for (const item of order.items) {
                if (item.product && item.product.length < 24) {
                    const num = parseInt(item.product);
                    if (!isNaN(num)) {
                        const hex = num.toString(16).padStart(2, '0');
                        item.product = `507f1f77bcf86cd7994390${hex}`;
                        modified = true;
                    }
                }
            }
            if (modified) {
                await order.save();
                updatedCount++;
            }
        }
        
        return NextResponse.json({ message: `Successfully updated ${updatedCount} legacy orders.` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
