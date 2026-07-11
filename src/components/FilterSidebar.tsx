'use client';

import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to update params
    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/products?${params.toString()}`);
    };

    // Keep single update for backward compatibility if needed, or refactor
    const updateParam = (key: string, value: string | null) => updateParams({ [key]: value });

    const isPrime = searchParams.get('prime') === 'true';
    const currentMinRating = searchParams.get('minRating');
    const currentMinPrice = searchParams.get('minPrice');

    return (
        <div className="w-[240px] flex-shrink-0 space-y-8 text-sm text-foreground">
            {/* Delivery */}
            <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg tracking-wide border-b border-border pb-2">Delivery</h3>
                <div className="flex items-center gap-3 pt-2">
                    <Checkbox
                        id="prime"
                        checked={isPrime}
                        onCheckedChange={(checked) => updateParam('prime', checked ? 'true' : null)}
                        className="rounded-[4px]"
                    />
                    <label htmlFor="prime" className="flex items-center gap-1 cursor-pointer select-none">
                        <span className="text-primary font-bold italic tracking-wide">Luxe Delivery</span>
                    </label>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg tracking-wide border-b border-border pb-2">Reviews</h3>
                <div className="space-y-3 pt-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <div
                            key={rating}
                            className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group"
                        >
                            <Checkbox
                                id={`rating-${rating}`}
                                checked={currentMinRating === rating.toString()}
                                onCheckedChange={(checked) => updateParam('minRating', checked ? rating.toString() : null)}
                                className="rounded-[4px]"
                            />
                            <label htmlFor={`rating-${rating}`} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                <div className="flex text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-muted/50'}`} />
                                    ))}
                                </div>
                                <span className="text-muted-foreground group-hover:text-primary transition-colors">& Up</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg tracking-wide border-b border-border pb-2">Price</h3>
                <div className="space-y-3 pt-2">
                    {[
                        { label: "Under ₹2,500", min: null, max: '2500' },
                        { label: "₹2,500 - ₹5,000", min: '2500', max: '5000' },
                        { label: "₹5,000 - ₹10,000", min: '5000', max: '10000' },
                        { label: "₹10,000 - ₹20,000", min: '10000', max: '20000' },
                        { label: "Over ₹20,000", min: '20000', max: null },
                    ].map((item, i) => {
                        const isSelected = searchParams.get('minPrice') === item.min && searchParams.get('maxPrice') === item.max;
                        return (
                            <div key={i} className="flex items-center gap-3 hover:text-primary transition-colors text-muted-foreground">
                                <Checkbox
                                    id={`price-${i}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            updateParams({ minPrice: item.min, maxPrice: item.max });
                                        } else {
                                            updateParams({ minPrice: null, maxPrice: null });
                                        }
                                    }}
                                    className="rounded-[4px]"
                                />
                                <label htmlFor={`price-${i}`} className="cursor-pointer select-none">
                                    {item.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Deals & Discounts */}
            <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg tracking-wide border-b border-border pb-2">Specials</h3>
                <div className="flex items-center gap-3 pt-2 text-muted-foreground hover:text-primary transition-colors">
                    <Checkbox
                        id="deals"
                        checked={searchParams.get('sort') === 'deals'}
                        onCheckedChange={(checked) => updateParam('sort', checked ? 'deals' : null)}
                        className="rounded-[4px]"
                    />
                    <label htmlFor="deals" className="cursor-pointer select-none">
                        Today&apos;s Exclusives
                    </label>
                </div>
            </div>

            <button
                onClick={() => router.push('/products')}
                className="w-full text-center py-2 text-sm text-muted-foreground hover:text-primary transition-colors border border-border hover:border-primary mt-8 uppercase tracking-wider font-medium"
            >
                Clear all filters
            </button>
        </div>
    );
}
