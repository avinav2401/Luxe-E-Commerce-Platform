'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStatusColor, getStatusLabel, getNextStatus, formatOrderDate } from '@/lib/orderUtils';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session.user?.role !== 'admin') {
                router.push('/');
                return;
            }
            fetchOrders();
        }
    }, [status, router, session]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            } else {
                toast.error('Failed to load orders');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        setUpdating(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/update-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Order status updated to ${getStatusLabel(newStatus)}`);
                fetchOrders(); // Refresh orders
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        } finally {
            setUpdating(null);
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
    if (!session?.user || session.user.role !== 'admin') {
        return null;
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">Order Management</h1>
                    <Link href="/account">
                        <Button variant="outline">Back to Account</Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    {['placed', 'packed', 'shipped', 'delivered'].map(status => (
                        <div key={status} className="bg-white p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 capitalize">{status}</p>
                            <p className="text-2xl font-bold">
                                {orders.filter(o => o.status === status).length}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border'
                            }`}
                    >
                        All Orders
                    </button>
                    {['placed', 'packed', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as OrderStatus)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === status ? 'bg-blue-600 text-white' : 'bg-white border'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-lg border p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                <div>
                                    <p className="font-semibold">Order #{order._id.substring(0, 12)}...</p>
                                    <p className="text-sm text-gray-600">
                                        {order.shippingAddress?.fullName} • {formatOrderDate(order.createdAt)}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">
                                        ₹{(order.total * 80).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Current Status */}
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>

                                    {/* Status Update Buttons */}
                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <div className="flex gap-2">
                                            {getNextStatus(order.status) && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateOrderStatus(order._id, getNextStatus(order.status)!)}
                                                    disabled={updating === order._id}
                                                >
                                                    {updating === order._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        `Mark as ${getStatusLabel(getNextStatus(order.status)!)}`
                                                    )}
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                                disabled={updating === order._id}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Items:</p>
                                <ul className="space-y-1">
                                    {order.items.map((item: any, idx: number) => (
                                        <li key={idx}>
                                            • {item.productDetails?.name || 'Unknown Product'} (Qty: {item.quantity}) - ₹{(item.price * 80).toLocaleString('en-IN')}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-4 text-sm text-gray-600">
                                <p className="font-medium">Shipping to:</p>
                                <p>{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
