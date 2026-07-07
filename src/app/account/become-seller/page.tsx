'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BecomeSellerPage() {
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/user/become-seller', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeName, storeDescription }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            alert('Your seller application has been submitted and is pending admin approval.');
            router.push('/account/profile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Become a Seller</h2>
                    <p className="mt-2 text-sm text-gray-600">Start selling your products on our platform today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                            Store Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="storeName"
                                name="storeName"
                                type="text"
                                required
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e77600] focus:border-[#e77600] sm:text-sm"
                                placeholder="Enter your store name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
                            Store Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="storeDescription"
                                name="storeDescription"
                                rows={4}
                                required
                                value={storeDescription}
                                onChange={(e) => setStoreDescription(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e77600] focus:border-[#e77600] sm:text-sm"
                                placeholder="Tell us about what you sell"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] text-black shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
