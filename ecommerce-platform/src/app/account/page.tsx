'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Smartphone, Headset, Lock, MapPin, CreditCard } from 'lucide-react';
import { useEffect } from 'react';

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/account');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const cards = [
        { icon: Package, title: 'Your Orders', desc: 'Track, return, or buy things again', href: '/orders' },
        { icon: Lock, title: 'Login & security', desc: 'Edit login, name, and mobile number', href: '/account/profile' },
        { icon: MapPin, title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', href: '/account/addresses' },
        { icon: CreditCard, title: 'Payment options', desc: 'Edit or add payment methods', href: '#' },
        { icon: Smartphone, title: 'Contact Us', desc: 'Contact our customer service via phone or chat', href: '#' },
    ];

    return (
        <div className="bg-white min-h-screen text-[#0F1111] p-4 font-sans">
            <div className="max-w-4xl mx-auto py-4">
                <h1 className="text-3xl font-normal mb-4">Your Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, i) => (
                        <Link href={card.href} key={i} className="border border-[#D5D9D9] rounded-lg p-4 flex gap-4 hover:bg-[#F2F4F8] items-center cursor-pointer">
                            <div className="h-12 w-12 flex-shrink-0">
                                <card.icon className="w-full h-full text-[#007185]" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-normal">{card.title}</h2>
                                <span className="text-sm text-[#565959]">{card.desc}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 border-t pt-4">
                    <p className="mb-2 font-bold">Settings</p>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[#007185] hover:underline hover:text-[#C7511F] text-sm">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
