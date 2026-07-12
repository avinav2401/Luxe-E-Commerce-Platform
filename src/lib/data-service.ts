import connectToDatabase from "@/lib/mongoose";
import Product from "@/models/Product";

export async function getProducts() {
    if (!process.env.MONGODB_URI) {
        console.error("❌ No MONGODB_URI found. Cannot fetch products.");
        return []; 
    }

    try {
        await connectToDatabase();
        const dbProducts = await Product.find({ isDeleted: { $ne: true } }).lean();

        // Convert _id to string id for frontend compatibility
        const formattedDbProducts = dbProducts.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }));

        console.log(`✅ Serving ${formattedDbProducts.length} products from Database`);
        return formattedDbProducts;

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        return [];
    }
}
