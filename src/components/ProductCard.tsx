'use client';

import Image from 'next/image';
import Link from 'next/link';
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
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Link href={`/products/${product.id}`} className="aspect-square relative mb-4 bg-muted/30 rounded-md p-4 flex items-center justify-center overflow-hidden block">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
            </Link>

            <div className="flex-1 flex flex-col gap-1 sm:gap-1.5">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm sm:text-base font-serif font-semibold leading-snug text-foreground hover:text-primary cursor-pointer line-clamp-2 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1.5">
                    <div className="flex text-primary text-sm">
                        {'★'.repeat(Math.floor(product.rating || 4.5))}{'☆'.repeat(5 - Math.floor(product.rating || 4.5))}
                    </div>
                    <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        {(product.reviews || 0).toLocaleString('en-IN')} reviews
                    </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-1 my-1">
                    <span className="text-[10px] text-muted-foreground relative top-[-0.3em]">₹</span>
                    <span className="text-lg sm:text-[22px] font-bold text-foreground leading-none tracking-tight">{Math.floor(product.price * 80).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-muted-foreground relative top-[-0.3em]">00</span>
                    <span className="text-[9px] sm:text-[11px] text-muted-foreground sm:ml-1.5 w-full sm:w-auto">
                        M.R.P: <span className="line-through">₹{Math.floor((product.price * 80) / (1 - ((product.discount || 20) / 100))).toLocaleString('en-IN')}</span> <span className="text-primary font-medium">({Math.floor(product.discount || 20)}% off)</span>
                    </span>
                </div>

                <div className="flex items-center gap-1 mb-1">
                    <span className="text-primary font-bold italic tracking-wide text-xs">Luxe Delivery</span>
                </div>

                <div className="text-xs text-muted-foreground leading-tight">
                    FREE delivery <span className="font-semibold text-foreground">Sun, 24 Dec</span> on your first order
                </div>
            </div>

            <Button
                onClick={handleAddToCart}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-xs font-semibold tracking-wide uppercase h-9 shadow-sm transition-all"
            >
                Add to Cart
            </Button>
        </div>
    );
}
