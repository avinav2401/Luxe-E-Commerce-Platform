'use client';

import { Product, useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";

interface ProductDetailsClientProps {
    product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const addToCart = useCartStore((state) => state.addToCart);
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart(product);
        toast.success("Added to cart!", {
            description: product.name,
        });
    };

    const handleBuyNow = () => {
        addToCart(product);
        router.push("/checkout");
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 h-12 rounded-full border-primary text-primary hover:bg-primary/10 font-semibold tracking-wide"
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
            </Button>
            
            <Button
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide shadow-md"
            >
                <Zap className="w-4 h-4 mr-2" />
                Buy Now
            </Button>
        </div>
    );
}
