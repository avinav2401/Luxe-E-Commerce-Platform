'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, CreditCard, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/account/payment');
        } else if (status === 'authenticated') {
            const saved = localStorage.getItem('paymentMethods');
            if (saved) {
                setPaymentMethods(JSON.parse(saved));
            }
        }
    }, [status, router]);

    const addPaymentMethod = () => {
        const newMethod = {
            id: Date.now(),
            type: 'Credit Card',
            last4: '****',
            expiry: 'MM/YY',
            isDefault: paymentMethods.length === 0
        };
        const updated = [...paymentMethods, newMethod];
        setPaymentMethods(updated);
        localStorage.setItem('paymentMethods', JSON.stringify(updated));
        setIsAdding(false);
    };

    const removeMethod = (id: number) => {
        const updated = paymentMethods.filter(m => m.id !== id);
        setPaymentMethods(updated);
        localStorage.setItem('paymentMethods', JSON.stringify(updated));
    };

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className="bg-white min-h-screen text-[#0F1111] p-4 font-sans">
            <div className="max-w-4xl mx-auto py-4">
                <div className="text-sm text-[#565959] mb-4 space-x-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Payment options</span>
                </div>

                <h1 className="text-3xl font-normal mb-6">Your Payments</h1>

                <div className="space-y-4">
                    {/* Add Payment Button */}
                    <div onClick={() => alert('Payment integration coming soon! This is a demo.')} className="border-2 border-dashed border-[#D5D9D9] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 min-h-[150px]">
                        <Plus className="w-10 h-10 text-[#D5D9D9] mb-2" />
                        <span className="text-lg font-bold text-[#565959]">Add a payment method</span>
                        <span className="text-sm text-[#565959] mt-1">Credit/Debit Card, UPI, Net Banking</span>
                    </div>

                    {/* Saved Payment Methods */}
                    {paymentMethods.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">Your saved payment methods</h2>
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="border border-[#D5D9D9] rounded-lg p-4 flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="w-8 h-8 text-[#565959]" />
                                        <div>
                                            <p className="font-bold">{method.type} ending in {method.last4}</p>
                                            <p className="text-sm text-[#565959]">Expires {method.expiry}</p>
                                            {method.isDefault && <span className="text-xs bg-[#FFD814] px-2 py-0.5 rounded">Default</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => removeMethod(method.id)} className="text-[#007185] hover:text-[#C7511F]">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-[#F0F2F2] rounded-lg">
                        <p className="text-sm text-[#565959]">
                            <strong>Note:</strong> Full payment integration requires a payment gateway like Stripe, Razorpay, or PayPal. This is a demonstration of the UI.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
