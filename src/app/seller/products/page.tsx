'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function MyProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/seller/products');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session?.user?.role !== 'seller') {
                router.push('/');
            } else {
                fetchProducts();
            }
        }
    }, [status, session, router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/seller/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/seller/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Product deleted successfully');
                fetchProducts();
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            toast.error('Failed to delete product');
        } finally {
            setDeleting(null);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    // @ts-ignore
    if (status === 'unauthenticated' || session?.user?.role !== 'seller') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product listings</p>
                </div>
                <Link href="/seller/products/new">
                    <Button>Add New Product</Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No products yet</p>
                    <Link href="/seller/products/new">
                        <Button>Add Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-lg font-bold text-blue-600">
                                        ₹{(product.price * 80).toLocaleString('en-IN')}
                                    </span>
                                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        Stock: {product.stock}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/seller/products/${product._id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deleting === product._id}
                                    >
                                        {deleting === product._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
