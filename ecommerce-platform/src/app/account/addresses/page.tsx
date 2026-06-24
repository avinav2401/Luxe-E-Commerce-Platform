'use client';

import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddressesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        phone: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated') {
            fetch('/api/user/addresses')
                .then(res => res.json())
                .then(data => {
                    if (data.addresses) {
                        setAddresses(data.addresses);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch addresses", err);
                    setIsLoading(false);
                });
        }
    }, [status, router]);

    const saveToDb = async (newAddresses: any[]) => {
        // Optimistic update
        setAddresses(newAddresses);
        try {
            await fetch('/api/user/addresses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: newAddresses })
            });
            
            // Dispatch a custom event so Navbar can instantly re-fetch or sync
            window.dispatchEvent(new Event('addressesUpdated'));
        } catch (error) {
            console.error("Failed to save addresses", error);
        }
    };

    const handleEdit = (addr: any) => {
        setFormData(addr);
        setEditingId(addr.id);
        setIsFormOpen(true);
    };

    const handleRemove = (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            const newAddresses = addresses.filter(a => a.id !== id);
            saveToDb(newAddresses);
        }
    };

    const handleSetDefault = (id: string) => {
        const newAddresses = addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        }));
        saveToDb(newAddresses);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let newAddresses = [...addresses];

        if (editingId) {
            // Update existing
            newAddresses = newAddresses.map(a =>
                a.id === editingId ? { ...formData, id: editingId, isDefault: a.isDefault } : a
            );
        } else {
            // Add new
            const newId = Date.now().toString();
            newAddresses.push({
                ...formData,
                id: newId,
                isDefault: addresses.length === 0 // First one is default
            });
        }

        saveToDb(newAddresses);
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', address: '', city: '', state: '', zip: '', country: 'India', phone: '' });
    };

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen text-[#0F1111] font-sans flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#f08804]" />
            </div>
        )
    }

    if (isFormOpen) {
        return (
            <div className="bg-white min-h-screen text-[#0F1111] font-sans">
                <div className="max-w-2xl mx-auto p-4 py-8">
                    <div className="text-sm text-[#565959] mb-4 space-x-1">
                        <Link href="/account/addresses" onClick={() => setIsFormOpen(false)} className="hover:underline hover:text-[#C7511F]">Your Addresses</Link>
                        <span>›</span>
                        <span className="text-[#C7511F]">{editingId ? 'Edit Address' : 'New Address'}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Address' : 'Add a new address'}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-bold text-sm">Full name (First and Last name)</label>
                            <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)]" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-sm">Mobile number</label>
                            <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-sm">Flat, House no., Building, Company, Apartment</label>
                            <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-bold text-sm">City</label>
                                <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-sm">State</label>
                                <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-bold text-sm">Zip Code</label>
                                <input required className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-sm">Country</label>
                                <input disabled value="India" className="w-full border border-gray-400 rounded p-2 bg-gray-100" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button type="submit" className="bg-[#FFD814] border border-[#FCD200] px-6 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]">
                                {editingId ? 'Update address' : 'Add address'}
                            </button>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="border border-[#D5D9D9] bg-white px-6 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

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
                    <div onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', address: '', city: '', state: '', zip: '', country: 'India', phone: '' });
                        setIsFormOpen(true);
                    }} className="border border-dashed border-[#D5D9D9] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 min-h-[260px] group">
                        <Plus className="w-10 h-10 text-[#D5D9D9] mb-2 group-hover:text-gray-400" />
                        <span className="text-xl font-bold text-[#565959] group-hover:text-gray-700">Add Address</span>
                    </div>

                    {/* Address List */}
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`border ${addr.isDefault ? 'border-2 border-[#e77600]' : 'border-[#D5D9D9]'} rounded-lg p-6 relative hover:border-gray-400 min-h-[260px] flex flex-col bg-white`}>
                            {addr.isDefault && (
                                <div className="text-xs text-[#565959] border-b pb-2 mb-2 font-bold flex items-center gap-2">
                                    Default Address
                                </div>
                            )}

                            <div className="text-sm leading-relaxed flex-1">
                                <span className="font-bold block text-base mb-1">{addr.name}</span>
                                <span className="block">{addr.address}</span>
                                <span className="block">{addr.city}, {addr.state} {addr.zip}</span>
                                <span className="block">{addr.country}</span>
                                <span className="block mt-2">Phone number: {addr.phone}</span>
                            </div>

                            <div className="text-sm text-[#007185] flex gap-4 mt-6 font-medium bottom-0">
                                <button onClick={() => handleEdit(addr)} className="hover:underline hover:text-[#C7511F]">Edit</button>
                                <button onClick={() => handleRemove(addr.id)} className="hover:underline hover:text-[#C7511F]">Remove</button>
                                {!addr.isDefault && (
                                    <button onClick={() => handleSetDefault(addr.id)} className="hover:underline hover:text-[#C7511F]">Set as Default</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
