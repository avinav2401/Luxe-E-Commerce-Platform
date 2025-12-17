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
        <div className="w-[240px] flex-shrink-0 space-y-6 text-sm text-[#0F1111]">
            {/* Delivery */}
            <div className="space-y-2">
                <h3 className="font-bold">Delivery Day</h3>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="prime"
                        checked={isPrime}
                        onCheckedChange={(checked) => updateParam('prime', checked ? 'true' : null)}
                    />
                    <label htmlFor="prime" className="flex items-center gap-1 cursor-pointer select-none">
                        <span className="text-[#00A8E1] font-bold italic">prime</span>
                    </label>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="space-y-1">
                <h3 className="font-bold mb-1">Customer Reviews</h3>
                <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => (
                        <div
                            key={rating}
                            className="flex items-center gap-2 cursor-pointer hover:text-[#C7511F]"
                        >
                            <Checkbox
                                id={`rating-${rating}`}
                                checked={currentMinRating === rating.toString()}
                                onCheckedChange={(checked) => updateParam('minRating', checked ? rating.toString() : null)}
                            />
                            <label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer select-none flex-1">
                                <div className="flex text-[#F4A41D]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span>& Up</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
                <h3 className="font-bold mb-1">Price</h3>
                <div className="space-y-1">
                    {[
                        { label: "Under ₹2,500", min: null, max: '2500' },
                        { label: "₹2,500 - ₹5,000", min: '2500', max: '5000' },
                        { label: "₹5,000 - ₹10,000", min: '5000', max: '10000' },
                        { label: "₹10,000 - ₹20,000", min: '10000', max: '20000' },
                        { label: "Over ₹20,000", min: '20000', max: null },
                    ].map((item, i) => {
                        const isSelected = searchParams.get('minPrice') === item.min && searchParams.get('maxPrice') === item.max;
                        return (
                            <div key={i} className="flex items-center gap-2 hover:text-[#C7511F]">
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
            <div className="space-y-1">
                <h3 className="font-bold mb-1">Deals & Discounts</h3>
                <div className="flex items-center gap-2 hover:text-[#C7511F]">
                    <Checkbox
                        id="deals"
                        checked={searchParams.get('sort') === 'deals'}
                        onCheckedChange={(checked) => updateParam('sort', checked ? 'deals' : null)}
                    />
                    <label htmlFor="deals" className="cursor-pointer select-none">
                        Today&apos;s Deals
                    </label>
                </div>
            </div>

            <button
                onClick={() => router.push('/products')}
                className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-4"
            >
                Clear all filters
            </button>
        </div>
    );
}
