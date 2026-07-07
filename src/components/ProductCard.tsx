'use client';

import Image from 'next/image';
import { Product, useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success('Added to cart!', {
            description: product.name,
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-sm p-3 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="aspect-square relative mb-2 bg-[#F7F7F7] p-2 flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply"
                />
            </div>

            <div className="flex-1 flex flex-col gap-1">
                <h3 className="text-base font-medium leading-snug text-[#0F1111] hover:text-[#C7511F] cursor-pointer line-clamp-3">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1">
                    <div className="flex text-[#F0C14B] text-sm">
                        {'★'.repeat(4)}{'☆'}
                    </div>
                    <span className="text-sm text-[#007185] hover:underline cursor-pointer">4,289</span>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                    <span className="text-[10px] relative top-[-0.3em]">₹</span>
                    <span className="text-[21px] font-medium text-[#0F1111] leading-none">{Math.floor(product.price * 80).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] relative top-[-0.3em]">00</span>
                    <span className="text-[12px] text-[#565959] ml-1">
                        M.R.P: <span className="line-through">₹{Math.floor(product.price * 100).toLocaleString('en-IN')}</span> ({Math.floor(20)}% off)
                    </span>
                </div>

                <div className="flex items-center gap-1 mb-1">
                    <span className="text-[#00A8E1] font-bold italic text-xs">prime</span>
                </div>

                <div className="text-xs text-[#565959] leading-tight">
                    FREE delivery <span className="font-bold text-[#0F1111]">Sun, 24 Dec</span> on your first order
                </div>
            </div>

            <Button
                onClick={handleAddToCart}
                className="w-full mt-3 bg-[#FFD814] hover:bg-[#F3A847] text-[#0F1111] border border-[#FCD200] rounded-full text-xs font-normal h-8 shadow-sm"
            >
                Add to Cart
            </Button>
        </div>
    );
}
