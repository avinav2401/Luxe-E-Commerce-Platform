import { ProductShowcase } from "@/components/ProductShowcase";
import { getProducts } from "@/lib/data-service";
import { FilterSidebar } from "@/components/FilterSidebar";

interface SearchParams {
    cat?: string;
    sort?: string;
    prime?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    search?: string;
}

export default async function ShopPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;
    const { cat, sort, prime, minPrice, maxPrice, minRating, search } = searchParams;

    let products = await getProducts();
    let title = "Shop All Products";

    // Filter by Search Query
    if (search) {
        const q = search.toLowerCase();
        products = products.filter((p: any) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
        title = `Results for "${search}"`;
    }

    // Filter by Category
    if (cat) {
        products = products.filter((p: any) => p.category.toLowerCase().includes(cat.toLowerCase()));
        title = `${cat} Products`;
    }

    // Filter by Price
    if (minPrice) {
        products = products.filter((p: any) => (p.price * 80) >= Number(minPrice));
    }
    if (maxPrice) {
        products = products.filter((p: any) => (p.price * 80) <= Number(maxPrice));
    }

    // Filter by Rating
    if (minRating) {
        products = products.filter((p: any) => p.rating >= Number(minRating));
    }

    // Filter by Sort/Feature
    if (sort === 'best-sellers') {
        products = products.filter((p: any) => p.rating >= 4.5);
        title = "Best Sellers";
    } else if (sort === 'newest') {
        products = [...products].reverse(); // Mock newest
        title = "New Releases";
    } else if (sort === 'deals') {
        // Today's Deals: Items with > 10% discount (mocked as price < $50 or random)
        // Let's make it consistent: Items under ₹4000 ($50)
        products = products.filter((p: any) => (p.price * 80) < 4000);
        title = "Today's Deals";
    }

    // Filter by Prime (Mock)
    if (prime === 'true') {
        title = "Prime-Eligible Items";
        // Mock prime: Filter by random subset (e.g. every other item)
        // Using index logic requires index, so create new array
        products = products.filter((_: any, i: number) => i % 2 === 0);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block w-[240px] flex-shrink-0">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-4 text-left">
                        <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
                        <p className="text-sm text-gray-500">
                            {products.length} results found
                        </p>
                    </div>
                    <ProductShowcase initialProducts={products} title="" />
                </div>
            </div>
        </div>
    );
}
