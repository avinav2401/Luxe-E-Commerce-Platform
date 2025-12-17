'use client';

import { Product } from '@/store/useCartStore';

interface ProductShowcaseProps {
    initialProducts: Product[];
}

import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";

export function ProductShowcase({ initialProducts, title = "Recommended for you" }: ProductShowcaseProps & { title?: string }) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {initialProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
