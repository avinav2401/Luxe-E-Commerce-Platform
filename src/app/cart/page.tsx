'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';

export default function CartPage() {
    const { cart, totalPrice, updateQuantity, removeFromCart } = useCartStore();
    const router = useRouter();

    const subtotal = totalPrice();
    
    // Grab 4 items for recommendations
    const recommendations = products.slice(5, 9);

    if (cart.length === 0) {
        return (
            <div className="bg-background min-h-screen p-4 md:p-8">
                <div className="bg-card p-8 rounded-2xl shadow-sm border border-border max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Your Luxe Cart is empty.</h1>
                    <p className="mb-6 text-muted-foreground">
                        Your Shopping Cart lives to serve. Give it purpose — fill it with electronics, fashion, beauty products and more.
                        Continue shopping on the <Link href="/" className="text-primary hover:underline">Luxe homepage</Link>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen p-4 font-sans">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                {/* Left Side: Cart Items */}
                <div className="lg:col-span-3 bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border h-fit order-2 lg:order-1">
                    <div className="flex justify-between items-end border-b border-border pb-4 mb-6">
                        <h1 className="text-3xl font-serif font-bold">Shopping Cart</h1>
                        <span className="text-sm text-muted-foreground hidden sm:block font-medium">Price</span>
                    </div>

                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-border pb-6 last:border-0 relative">
                                {/* Image */}
                                <div className="relative w-32 h-32 flex-shrink-0 bg-secondary/30 rounded-xl overflow-hidden p-2">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <Link href={`/products?search=${encodeURIComponent(item.name)}`} className="text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight pr-4">
                                            {item.name}
                                        </Link>
                                        <span className="font-bold text-lg sm:hidden">₹{(item.price * 80).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="text-xs font-medium text-green-600 my-1.5">In stock</div>
                                    <div className="text-xs text-muted-foreground mb-1">Eligible for FREE Shipping</div>
                                    <div className="flex items-center text-xs gap-1 mb-2">
                                        <span className="text-primary font-bold italic tracking-wide text-xs">Luxe Delivery</span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center border border-border rounded-full shadow-sm bg-background overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1.5 text-sm disabled:opacity-30 hover:bg-muted transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="bg-transparent px-3 py-1.5 border-x border-border text-sm font-medium w-10 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <span className="text-muted-foreground hover:text-destructive text-sm px-3 border-l border-border cursor-pointer transition-colors" onClick={() => removeFromCart(item.id)}>
                                            Remove
                                        </span>
                                    </div>
                                </div>

                                {/* Price (Desktop) */}
                                <div className="hidden sm:block text-right w-32">
                                    <span className="font-bold text-lg">₹{(item.price * 80).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-right pt-6 text-xl">
                        Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items): <span className="font-bold text-2xl ml-2">₹{(subtotal * 80).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Right Side: Checkout Box */}
                <div className="lg:col-span-1 h-fit space-y-6 relative lg:sticky lg:top-24 order-1 lg:order-2">
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="text-lg mb-4">
                            Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items): <br />
                            <span className="font-bold text-2xl mt-1 block">₹{(subtotal * 80).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <input type="checkbox" id="gift" className="w-4 h-4 accent-primary cursor-pointer rounded border-border" />
                            <label htmlFor="gift" className="text-sm text-muted-foreground cursor-pointer">This order contains a gift</label>
                        </div>
                        <Button
                            onClick={() => router.push('/checkout')}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm py-6 text-md font-medium transition-all hover:shadow-md"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border hidden lg:block">
                        <h3 className="font-serif font-bold text-md mb-4 text-foreground">Recommended for you</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {recommendations.map(product => (
                                <Link href={`/products?search=${encodeURIComponent(product.name)}`} key={product.id} className="group flex flex-col gap-2">
                                    <div className="relative aspect-square bg-secondary/30 rounded-xl overflow-hidden p-2">
                                        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out" />
                                    </div>
                                    <div className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </div>
                                    <div className="font-bold text-sm">
                                        ₹{(product.price * 80).toLocaleString('en-IN')}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
