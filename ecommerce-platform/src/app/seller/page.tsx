'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, TrendingUp, ShoppingBag, Loader2 } from 'lucide-react';

export default function SellerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalSales: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/seller');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session?.user?.role !== 'seller') {
                router.push('/');
            } else {
                fetchStats();
            }
        }
    }, [status, session, router]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/seller/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
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

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
        { label: 'Active Listings', value: stats.activeProducts, icon: ShoppingBag, color: 'bg-green-500' },
        { label: 'Total Sales', value: stats.totalSales, icon: TrendingUp, color: 'bg-purple-500' },
        { label: 'Revenue', value: `₹${(stats.revenue * 80).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-indigo-500' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your products and track your sales</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/seller/products/new"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            <Plus className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Add New Product</span>
                        </Link>
                        <Link
                            href="/seller/products"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                        >
                            <Package className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-700">My Products</span>
                        </Link>
                        <Link
                            href="/account"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
                        >
                            <ShoppingBag className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
