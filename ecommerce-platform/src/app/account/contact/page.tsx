'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Mail, Headset } from 'lucide-react';
import { useEffect } from 'react';

export default function ContactPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/account/contact');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') return null;

    const contactOptions = [
        {
            icon: Phone,
            title: 'Phone Support',
            desc: 'Talk to our customer service team',
            action: 'Call 1800-123-4567',
            color: 'text-green-600'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            desc: 'Chat with our support team in real-time',
            action: 'Start Chat',
            color: 'text-blue-600'
        },
        {
            icon: Mail,
            title: 'Email Support',
            desc: 'Send us an email and we\'ll respond within 24 hours',
            action: 'Email: support@luxe.com',
            color: 'text-orange-600'
        },
        {
            icon: Headset,
            title: 'Help Center',
            desc: 'Browse FAQs and troubleshooting guides',
            action: 'Visit Help Center',
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="bg-white min-h-screen text-[#0F1111] p-4 font-sans">
            <div className="max-w-4xl mx-auto py-4">
                <div className="text-sm text-[#565959] mb-4 space-x-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Contact Us</span>
                </div>

                <h1 className="text-3xl font-normal mb-2">Contact Customer Service</h1>
                <p className="text-[#565959] mb-8">We're here to help! Choose how you'd like to reach us.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contactOptions.map((option, i) => (
                        <div key={i} className="border border-[#D5D9D9] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => alert(`${option.title} feature coming soon!`)}>
                            <div className="flex items-start gap-4">
                                <option.icon className={`w-12 h-12 ${option.color}`} strokeWidth={1.5} />
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold mb-2">{option.title}</h2>
                                    <p className="text-sm text-[#565959] mb-3">{option.desc}</p>
                                    <button className="bg-[#FFD814] border border-[#FCD200] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F7CA00] shadow-sm">
                                        {option.action}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-[#F0F2F2] rounded-lg">
                    <h3 className="font-bold mb-2">Need immediate help?</h3>
                    <p className="text-sm text-[#565959] mb-3">
                        Check your order status, track packages, or manage returns directly from your <Link href="/orders" className="text-[#007185] hover:underline">Orders page</Link>.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/orders" className="text-[#007185] text-sm font-medium hover:underline hover:text-[#C7511F]">View Your Orders →</Link>
                        <Link href="/account/addresses" className="text-[#007185] text-sm font-medium hover:underline hover:text-[#C7511F]">Manage Addresses →</Link>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-[#565959]">
                    <p>Customer Service Hours: Monday-Sunday, 24/7</p>
                </div>
            </div>
        </div>
    );
}
