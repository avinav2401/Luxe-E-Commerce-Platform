'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HelpTopicPage() {
    const params = useParams();
    // Safely handle params.slug
    const slug = typeof params.slug === 'string'
        ? params.slug
        : Array.isArray(params.slug)
            ? params.slug[0]
            : 'Topic';

    const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="bg-white border-b p-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-sm text-[#565959] mb-4 space-x-1">
                        <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                        <span>›</span>
                        <Link href="/help" className="hover:underline hover:text-[#C7511F]">Customer Service</Link>
                        <span>›</span>
                        <span className="text-[#C7511F]">{title}</span>
                    </div>

                    <h1 className="text-3xl font-normal mb-8 text-[#0F1111]">{title}</h1>

                    <div className="max-w-3xl">
                        <div className="bg-[#F0F2F2] p-4 border rounded-md mb-6">
                            <h3 className="font-bold mb-2">Quick Solution</h3>
                            <p className="text-sm">
                                Most issues with <strong>{title}</strong> can be resolved by checking your
                                <Link href="/orders" className="text-[#007185] hover:underline mx-1">Orders</Link>
                                page.
                            </p>
                        </div>

                        <div className="space-y-4 text-[#0F1111]">
                            <h2 className="text-xl font-bold">About {title}</h2>
                            <p>
                                Welcome to the help page for {title}. Here you can find information regarding our policies and common questions.
                            </p>
                            <p>
                                If you cannot find what you are looking for, please contact our support team directly.
                            </p>

                            <h3 className="font-bold mt-4">Frequently Asked Questions</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>How do I manage my {title}?</li>
                                <li>What are the policies regarding {title}?</li>
                                <li>Where can I find more details?</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
