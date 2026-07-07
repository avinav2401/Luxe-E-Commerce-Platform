'use client';

import Link from 'next/link';
import { Search, MessageCircle, Phone, FileText, Package, CreditCard, ChevronRight } from 'lucide-react';

export default function CustomerServicePage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Header / Search Area */}
            <div className="bg-white border-b p-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-sm text-[#565959] mb-4 space-x-1">
                        <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                        <span>›</span>
                        <span className="text-[#C7511F]">Customer Service</span>
                    </div>

                    <h1 className="text-3xl font-normal mb-2 text-[#0F1111]">Hello. What can we help you with?</h1>

                    <div className="border-t border-b py-6 my-6">
                        <div className="bg-white py-4 border rounded-sm pl-4 pr-4 shadow-sm max-w-2xl">
                            <h3 className="font-bold text-lg mb-2">Some things you can do here</h3>
                            <div className="space-y-3">
                                <Link href="/orders" className="flex gap-4 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                    <Package className="text-[#e47911] w-8 h-8" />
                                    <div>
                                        <div className="font-medium text-[#0F1111]">Your Orders</div>
                                        <div className="text-sm text-[#565959]">Track packages, edit or cancel orders</div>
                                    </div>
                                </Link>
                                <Link href="/orders" className="flex gap-4 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                    <FileText className="text-[#e47911] w-8 h-8" />
                                    <div>
                                        <div className="font-medium text-[#0F1111]">Returns & Refunds</div>
                                        <div className="text-sm text-[#565959]">Return or exchange items, print return labels</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-normal mb-4">Browse Help Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#007185]">
                        <HelpTopic title="Recommended Topics" />
                        <HelpTopic title="Shipping & Delivery" />
                        <HelpTopic title="Returns & Refunds" />
                        <HelpTopic title="Managing Your Account" />
                        <HelpTopic title="Security & Privacy" />
                        <HelpTopic title="Payment, Pricing & Promotions" />
                        <HelpTopic title="Devices & Digital Services" />
                        <HelpTopic title="Amazon Business" />
                        <HelpTopic title="Other Topics" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HelpTopic({ title }: { title: string }) {
    const slug = title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, '');
    return (
        <Link href={`/help/${slug}`} className="p-4 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center group">
            <span className="group-hover:text-[#C7511F] group-hover:underline font-medium text-sm">{title}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
    );
}
