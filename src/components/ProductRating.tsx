'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ProductRatingProps {
    productId: string;
}

export function ProductRating({ productId }: ProductRatingProps) {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const submitRating = async (selectedRating: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: selectedRating })
            });

            const data = await res.json();
            
            if (res.ok) {
                setRating(selectedRating);
                setSubmitted(true);
                toast.success('Thanks for your rating!');
            } else {
                toast.error(data.error ? `Error: ${data.error}` : (data.message || 'Failed to submit rating'));
            }
        } catch (error) {
            toast.error('An error occurred while submitting rating');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="mt-3 flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#007185]">You rated this:</span>
                <div className="flex gap-1 text-[#FFA41C] text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= rating ? '★' : '☆'}</span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3 flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Rate this product:</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    return (
                        <button
                            key={star}
                            disabled={loading}
                            type="button"
                            className={`text-2xl transition-colors duration-150 ${
                                star <= (hover || rating) ? "text-[#FFA41C]" : "text-gray-300"
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                            onClick={() => submitRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            <span className="drop-shadow-sm">★</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
