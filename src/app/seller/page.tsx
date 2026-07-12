'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, TrendingUp, ShoppingBag, Loader2, AlertTriangle, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SellerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalSales: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/seller');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session?.user?.role !== 'seller') {
                router.push('/');
            } else {
                fetchDashboardData();
            }
        }
    }, [status, session, router]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes, productsRes] = await Promise.all([
                fetch('/api/seller/stats'),
                fetch('/api/seller/recent-orders'),
                fetch('/api/seller/products')
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setRecentOrders(ordersData.orders || []);
            }

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                const lowStock = productsData.products.filter((p: any) => p.stock > 0 && p.stock <= 5);
                setLowStockProducts(lowStock);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // @ts-ignore
    if (status === 'unauthenticated' || session?.user?.role !== 'seller') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Seller Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Products */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Products</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                            </div>
                            <Package className="w-12 h-12 text-blue-200" />
                        </div>
                    </div>

                    {/* Active Listings */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Active Listings</p>
                                <p className="text-3xl font-bold mt-2">{stats.activeProducts}</p>
                            </div>
                            <ShoppingBag className="w-12 h-12 text-green-200" />
                        </div>
                    </div>

                    {/* Total Sales */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Sales</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalSales}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-purple-200" />
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">Revenue</p>
                                <p className="text-3xl font-bold mt-2">₹{(stats.revenue * 80).toLocaleString('en-IN')}</p>
                            </div>
                            <DollarSign className="w-12 h-12 text-indigo-200" />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    {lowStockProducts.length} product(s) running low on stock
                                </p>
                                <div className="mt-2 space-y-1">
                                    {lowStockProducts.slice(0, 3).map((product: any) => (
                                        <p key={product._id} className="text-xs text-yellow-600">
                                            • {product.name} - Only {product.stock} left
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <Link href="/seller/products/new">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Product
                                    </Button>
                                </Link>
                                <Link href="/seller/products">
                                    <Button variant="outline" className="w-full border-2 hover:bg-gray-50">
                                        <Package className="w-4 h-4 mr-2" />
                                        View All Products
                                    </Button>
                                </Link>
                                <Link href="/account">
                                    <Button variant="outline" className="w-full border-2 hover:bg-gray-50">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Account Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p>No recent orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.slice(0, 5).map((order: any) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Order #{order._id.substring(0, 8)}...</p>
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {order.items.length > 0 && order.items[0].productDetails?.name ? (
                                                        <>
                                                            {order.items[0].productDetails.name}
                                                            {order.items.length > 1 && <span className="text-xs text-gray-500 ml-1">(+{order.items.length - 1} more)</span>}
                                                        </>
                                                    ) : (
                                                        `${order.items.length} item(s)`
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">₹{(order.total * 80).toLocaleString('en-IN')}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
