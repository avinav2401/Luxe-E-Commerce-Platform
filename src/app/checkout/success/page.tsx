'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface OrderData {
    items: any[];
    total: number;
    shippingAddress: any;
    paymentMethod: string;
}

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    useEffect(() => {
        // Fire confetti on success
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Retrieve order data from localStorage
        const savedOrder = localStorage.getItem('pendingOrder');
        if (savedOrder) {
            const order = JSON.parse(savedOrder);
            setOrderData(order);

            // Submit order to backend
            submitOrder(order);
        } else {
            // No pending order, redirect to orders
            setTimeout(() => {
                router.push('/orders');
            }, 2000);
        }
    }, []);

    const submitOrder = async (order: OrderData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: order.items,
                    total: order.total,
                    shippingAddress: order.shippingAddress,
                    paymentMethod: order.paymentMethod,
                    status: 'completed', // Mark as completed since payment succeeded
                }),
            });

            if (response.ok) {
                // Clear pending order and cart
                localStorage.removeItem('pendingOrder');
                localStorage.removeItem('cart-storage'); // Clear Zustand cart
                setOrderSubmitted(true);
                
                // Automatically redirect to Your Orders after a short delay
                setTimeout(() => {
                    router.push('/orders');
                }, 4000);
            } else {
                console.error('Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderData) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-muted-foreground">Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Success Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4"
                    >
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your order. Your payment has been processed successfully.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-secondary/20 border rounded-xl p-6 space-y-6">
                    {/* Order Status */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">Order Confirmed</h3>
                            <p className="text-sm text-muted-foreground">
                                {isSubmitting ? 'Processing your order...' : orderSubmitted ? 'Your order has been placed successfully' : 'Confirming your order...'}
                            </p>
                        </div>
                        <Package className="w-8 h-8 text-primary" />
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Truck className="w-4 h-4" />
                            <span>Shipping Address</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                            <p>{orderData.shippingAddress.fullName}</p>
                            <p>{orderData.shippingAddress.addressLine1}</p>
                            <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}</p>
                            <p>{orderData.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <CreditCard className="w-4 h-4" />
                            <span>Payment Method</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                            <p>{orderData.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                        <h4 className="font-medium">Items ({orderData.items.length})</h4>
                        <div className="space-y-2">
                            {orderData.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span>₹{(item.price * item.quantity * 80).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Paid</span>
                            <span>₹{(orderData.total * 80).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1" size="lg">
                        <Link href="/orders">View Orders</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1" size="lg">
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                        <strong>Order Confirmation:</strong> You will receive an email confirmation shortly with your order details and tracking information.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
