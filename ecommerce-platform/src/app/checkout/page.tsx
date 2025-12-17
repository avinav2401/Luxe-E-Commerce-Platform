'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: session?.user?.email || '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart,
                    total: totalPrice(),
                    shippingAddress: {
                        fullName: formData.name,
                        addressLine1: formData.address,
                        city: formData.city,
                        postalCode: formData.zip,
                        country: 'IN', // Hardcoded for now
                    },
                    paymentMethod: 'Credit Card',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            clearCart();
            alert('Order placed successfully! Thank you for shopping with Luxe.');
            router.push('/');
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Failed to place order: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (status === 'loading') {
        return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-3xl font-bold">Sign in to Checkout</h1>
                <p className="text-muted-foreground">You need to be logged in to place an order.</p>
                <Button asChild>
                    <Link href="/auth/signin?callbackUrl=/checkout">Sign In</Link>
                </Button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Shopping
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Checkout Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <Input id="name" name="name" required placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" name="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleInputChange} disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">Address</label>
                                <Input id="address" name="address" required placeholder="123 Main St" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium">City</label>
                                    <Input id="city" name="city" required placeholder="New York" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
                                    <Input id="zip" name="zip" required placeholder="10001" value={formData.zip} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input id="cardNumber" name="cardNumber" required placeholder="0000 0000 0000 0000" className="pl-10" value={formData.cardNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="expiry" className="text-sm font-medium">Expiry</label>
                                            <Input id="expiry" name="expiry" required placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="cvc" className="text-sm font-medium">CVC</label>
                                            <Input id="cvc" name="cvc" required placeholder="123" value={formData.cvc} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-secondary/20 p-6 rounded-xl h-fit border"
                >
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-background p-3 rounded-lg border">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground">₹{(item.price * 80).toLocaleString()}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="font-medium text-sm">
                                    ₹{(item.price * item.quantity * 80).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{(totalPrice() * 80).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>₹{(totalPrice() * 80).toLocaleString()}</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        form="checkout-form"
                        className="w-full mt-6"
                        size="lg"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing Order...' : 'Place Order'}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
