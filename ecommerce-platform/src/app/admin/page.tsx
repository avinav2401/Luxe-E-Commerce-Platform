'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Users, TrendingUp, Clock, CheckCircle, Truck, Home, XCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalOrders: 0,
        placed: 0,
        packed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/admin');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session?.user?.role !== 'admin') {
                router.push('/');
            } else {
                fetchDashboardData();
            }
        }
    }, [status, session, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats || {});
                setRecentOrders(data.recentOrders || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="p-10 text-center">Loading admin dashboard...</div>;
    }

    // @ts-ignore
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
        return null;
    }

    const statCards = [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500', link: '/admin/orders' },
        { label: 'Placed', value: stats.placed, icon: Clock, color: 'bg-yellow-500', link: '/admin/orders?status=placed' },
        { label: 'Packed', value: stats.packed, icon: Package, color: 'bg-purple-500', link: '/admin/orders?status=packed' },
        { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'bg-orange-500', link: '/admin/orders?status=shipped' },
        { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'bg-green-500', link: '/admin/orders?status=delivered' },
        { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'bg-red-500', link: '/admin/orders?status=cancelled' },
        { label: 'Revenue', value: `₹${(stats.totalRevenue * 80).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-indigo-500', link: '/admin/orders' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={index}
                                href={stat.link}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Manage Orders</span>
                        </Link>
                        <Link
                            href="/admin/orders?status=placed"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                        >
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-gray-700">Pending Orders</span>
                        </Link>
                        <Link
                            href="/admin/orders?status=shipped"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                        >
                            <Truck className="w-5 h-5 text-orange-600" />
                            <span className="font-medium text-gray-700">In Transit</span>
                        </Link>
                        <Link
                            href="/admin/sellers"
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
                        >
                            <Users className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Seller Requests</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order: any) => (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{order._id.substring(0, 8)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{order.shippingAddress?.fullName}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 font-medium">₹{(order.total * 80).toLocaleString('en-IN')}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order.status === 'packed' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${order.status === 'shipped' ? 'bg-orange-100 text-orange-800' : ''}
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
