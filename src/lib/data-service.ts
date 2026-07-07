import { products as staticProducts } from "@/data/products";
import connectToDatabase from "@/lib/mongoose";
import Product from "@/models/Product";

export async function getProducts() {
    // If no MONGODB_URI is set, return static data immediately.
    if (!process.env.MONGODB_URI) {
        console.log("⚠️ No MONGODB_URI found. Serving static mock data.");
        return JSON.parse(JSON.stringify(staticProducts)); // Ensure serializable
    }

    try {
        await connectToDatabase();
        const dbProducts = await Product.find({}).lean();

        // Convert _id to string id for frontend compatibility
        const formattedDbProducts = dbProducts.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }));

        // Always combine database products with static products
        // This ensures default products always show even after sellers add their own
        const allProducts = [
            ...formattedDbProducts,
            ...JSON.parse(JSON.stringify(staticProducts))
        ];

        console.log(`✅ Serving ${formattedDbProducts.length} DB products + ${staticProducts.length} static products`);
        return allProducts;

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        // Fallback to static data on error to keep site alive
        return JSON.parse(JSON.stringify(staticProducts));
    }
}
