'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddProductPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        discount: ''
    });

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    // @ts-ignore
    if (status === 'unauthenticated' || session?.user?.role !== 'seller') {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error('Please upload a product image');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/seller/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price) / 80, // Convert INR to USD
                    stock: parseInt(formData.stock),
                    discount: formData.discount ? parseInt(formData.discount) : 20
                })
            });

            if (res.ok) {
                toast.success('Product added successfully!');
                router.push('/seller/products');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to add product');
            }
        } catch (error) {
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Product</h1>
                <p className="text-gray-600 mt-1">List a new product for sale</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                    </label>
                    <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                    />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹ INR) *
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity *
                        </label>
                        <Input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Discount, Rating, Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount % (Optional)
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            placeholder="e.g. 20"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Books">Books</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image *
                    </label>
                    <div className="space-y-3">
                        <CldUploadButton
                            uploadPreset="products"
                            onSuccess={(result: any) => {
                                setFormData({ ...formData, image: result.info.secure_url });
                                toast.success('Image uploaded successfully!');
                            }}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white"
                        >
                            <Upload className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Click to Upload Image</span>
                        </CldUploadButton>

                        {formData.image && (
                            <div className="relative">
                                <img
                                    src={formData.image}
                                    alt="Product preview"
                                    className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-green-200"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <ImageIcon className="w-4 h-4" />
                                    Image Ready
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding Product...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
