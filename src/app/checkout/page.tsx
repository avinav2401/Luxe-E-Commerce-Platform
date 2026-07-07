'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronLeft, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { getEnabledPaymentMethods, type PaymentMethod } from '@/config/PaymentConfig';
import { toast } from 'sonner';

// Declare Razorpay type for TypeScript
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('razorpay');
    const paymentMethods = getEnabledPaymentMethods();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: session?.user?.email || '',
        address: '',
        city: '',
        zip: ''
    });

    // Load Razorpay SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Load Default Address
    useEffect(() => {
        if (session?.user?.email) {
            fetch('/api/user/addresses')
                .then(res => res.json())
                .then(data => {
                    if (data.addresses && data.addresses.length > 0) {
                        const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
                        if (defaultAddr) {
                            setFormData(prev => ({
                                ...prev,
                                name: defaultAddr.name || prev.name,
                                address: defaultAddr.address || '',
                                city: defaultAddr.city || '',
                                zip: defaultAddr.zip || '',
                            }));
                        }
                    }
                })
                .catch(console.error);
        }
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRazorpayPayment = async (orderData: any) => {
        try {
            // Create Razorpay order on server
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalPrice() * 80, // Convert to INR
                    currency: 'INR'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Razorpay order');
            }

            const { orderId, amount, currency, keyId } = await response.json();

            // Initialize Razorpay checkout
            const options = {
                key: keyId,
                amount,
                currency,
                order_id: orderId,
                name: 'Luxe E-Commerce',
                description: 'Order Payment',
                handler: async function (response: any) {
                    try {
                        // Verify payment on server
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        clearCart();
                        toast.success('Payment successful! Order placed.');
                        router.push('/checkout/success');
                    } catch (error: any) {
                        console.error('Verification error:', error);
                        toast.error('Payment verification failed');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                },
                theme: {
                    color: '#000000'
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.error('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            console.error('Razorpay error:', error);
            toast.error('Failed to initialize payment');
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);

        // Prepare order data
        const orderData = {
            items: cart,
            total: totalPrice(),
            shippingAddress: {
                fullName: formData.name,
                addressLine1: formData.address,
                city: formData.city,
                postalCode: formData.zip,
                country: 'IN',
            },
            paymentMethod: selectedMethod?.name || 'Unknown',
        };

        try {
            // Razorpay payment
            if (selectedPaymentMethod === 'razorpay') {
                if (!razorpayLoaded) {
                    toast.error('Payment system is loading, please try again');
                    setIsProcessing(false);
                    return;
                }
                await handleRazorpayPayment(orderData);
                return;
            }

            // Mock payment: process immediately
            if (selectedPaymentMethod === 'mock') {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Something went wrong');
                }

                clearCart();
                toast.success('Order placed successfully!');
                router.push('/checkout/success');
                return;
            }

            throw new Error('Invalid payment method selected');
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(`Failed to process order: ${error.message}`);
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
                                    <Input id="city" name="city" required placeholder="Mumbai" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
                                    <Input id="zip" name="zip" required placeholder="400001" value={formData.zip} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                            className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-primary ${selectedPaymentMethod === method.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="text-2xl mt-0.5">{method.icon}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">{method.name}</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {method.description}
                                                    </p>
                                                    {method.testCards && selectedPaymentMethod === method.id && (
                                                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                                                            <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">Test Card:</p>
                                                            <p className="text-blue-700 dark:text-blue-400">{method.testCards[0].number}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id
                                                            ? 'border-primary'
                                                            : 'border-border'
                                                            }`}
                                                    >
                                                        {selectedPaymentMethod === method.id && (
                                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
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
                                    <p className="text-xs text-muted-foreground">₹{(item.price * 80).toLocaleString('en-IN')}</p>
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
                                    ₹{(item.price * item.quantity * 80).toLocaleString('en-IN')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{(totalPrice() * 80).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>₹{(totalPrice() * 80).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        form="checkout-form"
                        className="w-full mt-6"
                        size="lg"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            'Processing...'
                        ) : selectedPaymentMethod === 'mock' ? (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Place Order (Instant)
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Proceed to Payment
                            </span>
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
