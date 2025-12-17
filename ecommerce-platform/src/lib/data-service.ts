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
        const products = await Product.find({}).lean();

        // If DB is empty, return static data so the site looks good initially
        if (products.length === 0) {
            console.log("⚠️ Database connected but empty. Serving static mock data.");
            // Optional: you could seed the DB here if you wanted
            return JSON.parse(JSON.stringify(staticProducts));
        }

        // Convert _id to string id for frontend compatibility
        return products.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }));

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        // Fallback to static data on error to keep site alive
        return JSON.parse(JSON.stringify(staticProducts));
    }
}
