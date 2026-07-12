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
        const dbProducts = await Product.find({ isDeleted: { $ne: true } }).lean();

        // Convert _id to string id for frontend compatibility
        const formattedDbProducts = dbProducts.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }));

        // Ensure static products act as the source of truth for base items.
        // Filter out any DB products that have the same name as a static product
        // to prevent duplicates and serve the freshest static data (e.g., fixed image URLs).
        const staticProductsData = JSON.parse(JSON.stringify(staticProducts));
        const staticProductNames = new Set(staticProductsData.map((p: any) => p.name));
        
        const filteredDbProducts = formattedDbProducts.filter((p: any) => !staticProductNames.has(p.name));

        const allProducts = [
            ...filteredDbProducts,
            ...staticProductsData
        ];

        console.log(`✅ Serving ${filteredDbProducts.length} custom DB products + ${staticProductsData.length} base static products`);
        return allProducts;

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        // Fallback to static data on error to keep site alive
        return JSON.parse(JSON.stringify(staticProducts));
    }
}
