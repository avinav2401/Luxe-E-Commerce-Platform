'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/orders');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyAgain = (productId: string) => {
        const productDetails = products.find(p => p.id === productId);
        if (productDetails) {
            addToCart(productDetails);
            alert(`${productDetails.name} added to cart!`);
        } else {
            alert('Product not found');
        }
    };

    if (status === 'loading' || loading) {
        return <div className="p-10 text-center">Loading your orders...</div>;
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className="bg-white min-h-screen text-[#0F1111] p-4 font-sans">
            <div className="max-w-5xl mx-auto py-4">
                <div className="flex text-sm text-[#565959] mb-4 gap-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Your Orders</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-normal">Your Orders</h1>
                    <div className="flex w-64">
                        <input type="search" placeholder="Search all orders" className="w-full border border-gray-400 rounded-sm px-2 py-1 text-sm shadow-inner focus:ring-1 focus:ring-[#e77600] outline-none" />
                    </div>
                </div>

                <div className="border-b mb-6 flex gap-6 text-sm">
                    <button className="font-bold border-b-2 border-[#D5D9D9] pb-2 text-black cursor-default">Orders</button>
                    <button className="text-[#007185] hover:text-[#C7511F] hover:underline pb-2">Buy Again</button>
                    {/* <button className="text-[#007185] hover:text-[#C7511F] hover:underline pb-2">Not Yet Shipped</button> */}
                </div>

                <div className="text-sm mb-4">
                    <span className="font-bold">{orders.length} orders</span> placed in
                    <select className="ml-2 border border-[#D5D9D9] bg-[#F0F2F2] rounded-md px-2 py-1 text-xs shadow-sm cursor-pointer hover:bg-[#E3E6E6]">
                        <option>past 3 months</option>
                        <option>2023</option>
                    </select>
                </div>

                {orders.length === 0 ? (
                    <div className="mt-12 text-center text-[#565959]">
                        <p>You have not placed any orders yet.</p>
                        <Link href="/" className="text-[#007185] hover:underline hover:text-[#C7511F] mt-2 block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div key={order._id} className="border rounded-md mt-4">
                                <div className="bg-[#F0F2F2] p-4 flex justify-between text-xs text-[#565959] border-b">
                                    <div className="flex gap-8">
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] font-bold">Order Placed</span>
                                            <span className="text-[#0F1111]">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] font-bold">Total</span>
                                            <span className="text-[#0F1111]">₹ {(order.total * 80).toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] font-bold">Ship To</span>
                                            <span className="text-[#007185] hover:underline hover:text-[#C7511F] cursor-pointer relative group">
                                                {order.shippingAddress?.fullName}
                                                <div className="hidden group-hover:block absolute top-4 left-0 bg-white border p-2 shadow-lg z-10 w-48 rounded">
                                                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="uppercase text-[10px]">Order # {order._id.substring(0, 8)}...</span>
                                        <div className="flex gap-2 text-[#007185] hover:underline hover:text-[#C7511F] cursor-pointer">
                                            <span>View order details</span>
                                            <span className="border-l pl-2 border-gray-400">Invoice</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {order.items.map((item: any, idx: number) => {
                                        const productDetails = products.find(p => p.id === item.product); // Lookup static details
                                        return (
                                            <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                                                <div className="w-20 h-20 bg-gray-100 flex-shrink-0 relative">
                                                    {productDetails?.image && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={productDetails.image} alt={productDetails.name} className="object-contain w-full h-full" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <Link href="#" className="font-bold text-[#007185] hover:underline hover:text-[#C7511F] line-clamp-2">
                                                        {productDetails?.name || 'Product Item'}
                                                    </Link>
                                                    <span className="text-xs text-[#565959] mt-1">Sold by: Luxe Retail</span>
                                                    <span className="text-xs text-[#B12704] font-bold mt-1">₹ {(item.price * 80).toLocaleString()}</span>

                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleBuyAgain(item.product)}
                                                            className="bg-[#FFD814] border border-[#FCD200] rounded-full px-4 py-1 text-xs w-fit shadow-sm hover:bg-[#F3A847]"
                                                        >
                                                            Buy it again
                                                        </button>
                                                        <button className="border border-[#D5D9D9] rounded-full px-4 py-1 text-xs w-fit shadow-sm hover:bg-gray-50">View your item</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
