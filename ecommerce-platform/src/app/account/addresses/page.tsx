'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AddressesPage() {
    const [savedAddress, setSavedAddress] = useState<any>(null);

    useEffect(() => {
        // Mock fetching saved address from local storage for demo purposes
        const saved = localStorage.getItem('userAddress');
        if (saved) {
            setSavedAddress(JSON.parse(saved));
        } else {
            // Default mock
            setSavedAddress({
                name: 'Avinash',
                address: '123 Main Street',
                city: 'City',
                state: 'State',
                zip: '123456',
                country: 'India',
                phone: '9999999999'
            });
        }
    }, []);

    return (
        <div className="bg-white min-h-screen text-[#0F1111] font-sans">
            <div className="max-w-5xl mx-auto p-4 py-8">
                <div className="text-sm text-[#565959] mb-4 space-x-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Your Addresses</span>
                </div>

                <h1 className="text-3xl font-normal mb-8">Your Addresses</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Address Card */}
                    <div className="border border-dashed border-[#D5D9D9] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 min-h-[250px]">
                        <Plus className="w-10 h-10 text-[#D5D9D9] mb-2" />
                        <span className="text-xl font-bold text-[#565959]">Add Address</span>
                    </div>

                    {/* Existing Address Card (Mock) */}
                    {savedAddress && (
                        <div className="border border-[#D5D9D9] rounded-lg p-6 relative hover:border-gray-400 min-h-[250px] flex flex-col">
                            {/* <div className="absolute top-0 left-0 bg-[#D5D9D9] text-xs px-2 py-1 rounded-br-sm">Default</div> */}
                            <div className="text-sm font-bold border-b pb-2 mb-2">Default</div>

                            <div className="text-sm leading-relaxed flex-1">
                                <span className="font-bold block">{savedAddress.name}</span>
                                <span className="block">{savedAddress.address}</span>
                                <span className="block">{savedAddress.city}, {savedAddress.state} {savedAddress.zip}</span>
                                <span className="block">{savedAddress.country}</span>
                                <span className="block">Phone number: {savedAddress.phone}</span>
                            </div>

                            <div className="text-sm text-[#007185] flex gap-4 mt-4 font-medium">
                                <button className="hover:underline hover:text-[#C7511F]">Edit</button>
                                <button className="hover:underline hover:text-[#C7511F]">Remove</button>
                                <button className="hover:underline hover:text-[#C7511F]">Set as Default</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
