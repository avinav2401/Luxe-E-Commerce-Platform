'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, totalPrice, updateQuantity, removeFromCart } = useCartStore();
    const router = useRouter();

    const subtotal = totalPrice();

    if (cart.length === 0) {
        return (
            <div className="bg-gray-100 min-h-screen p-4 md:p-8">
                <div className="bg-white p-8 rounded shadow-sm max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Your Amazon Cart is empty.</h1>
                    <p className="mb-6">
                        Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics and more.
                        Continue shopping on the <Link href="/" className="text-[#007185] hover:underline">Amazon.in homepage</Link>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#eaeded] min-h-screen p-4 font-sans">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Side: Cart Items */}
                <div className="lg:col-span-3 bg-white p-6 rounded-sm shadow-sm h-fit">
                    <div className="flex justify-between items-end border-b pb-2 mb-4">
                        <h1 className="text-3xl font-normal">Shopping Cart</h1>
                        <span className="text-sm text-[#565959] hidden sm:block">Price</span>
                    </div>

                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b py-4 last:border-0 relative">
                                {/* Image */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <Link href={`/products?search=${encodeURIComponent(item.name)}`} className="text-lg font-medium text-[#007185] hover:underline hover:text-[#C7511F] line-clamp-2 leading-tight">
                                            {item.name}
                                        </Link>
                                        <span className="font-bold text-lg sm:hidden">₹{(item.price * 80).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="text-xs text-[#007600] my-1">In stock</div>
                                    <div className="text-xs text-[#565959] mb-1">Eligible for FREE Shipping</div>
                                    <div className="flex items-center text-xs gap-1 mb-2">
                                        <Image src="https://m.media-amazon.com/images/G/31/marketing/prime/Prime_icon_pixel._CB485934333_.png" alt="Prime" width={40} height={40} className="object-contain" />
                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center border rounded-md shadow-sm bg-[#F0F2F2] hover:bg-[#E3E6E6]">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 text-sm disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="bg-white px-3 py-1 border-x text-sm font-medium w-10 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 text-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <span className="text-[#007185] text-xs px-2 border-l hover:underline cursor-pointer" onClick={() => removeFromCart(item.id)}>
                                            Delete
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

                    <div className="text-right pt-4 text-xl">
                        Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items): <span className="font-bold">₹{(subtotal * 80).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Right Side: Checkout Box */}
                <div className="lg:col-span-1 h-fit">
                    <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
                        <div className="text-lg mb-4">
                            Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items): <span className="font-bold">₹{(subtotal * 80).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" id="gift" className="w-4 h-4 accent-[#e47911]" />
                            <label htmlFor="gift" className="text-sm">This order contains a gift</label>
                        </div>
                        <Button
                            onClick={() => router.push('/checkout')}
                            className="w-full bg-[#FFD814] hover:bg-[#F3A847] text-black border border-[#FCD200] rounded-full shadow-sm"
                        >
                            Proceed to Buy
                        </Button>
                    </div>

                    {/* Recommendations (Mock) */}
                    <div className="bg-white p-4 rounded-sm shadow-sm mt-4">
                        <h3 className="font-bold text-sm mb-2">Customers who bought this also bought</h3>
                        <div className="flex gap-2">
                            <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
