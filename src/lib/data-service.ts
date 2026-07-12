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

        // Prefer Database products! If a product is in the DB, use it instead of the static fallback.
        // This ensures products have valid ObjectIds and can accept ratings, reviews, etc.
        const staticProductsData = JSON.parse(JSON.stringify(staticProducts));
        const dbProductNames = new Set(formattedDbProducts.map((p: any) => p.name));
        
        const filteredStaticProducts = staticProductsData.filter((p: any) => !dbProductNames.has(p.name));

        const allProducts = [
            ...formattedDbProducts,
            ...filteredStaticProducts
        ];

        console.log(`✅ Serving ${formattedDbProducts.length} DB products + ${filteredStaticProducts.length} static fallback products`);
        return allProducts;

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        // Fallback to static data on error to keep site alive
        return JSON.parse(JSON.stringify(staticProducts));
    }
}
