'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/orders');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null; // Don't render anything while redirecting
    }

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
                        <button className="bg-[#303333] text-white px-4 rounded-full text-sm font-bold ml-2 hidden">Search</button>
                    </div>
                </div>

                <div className="border-b mb-6 flex gap-6 text-sm">
                    <button className="font-bold border-b-2 border-[#D5D9D9] pb-2 text-black cursor-default">Orders</button>
                    <button className="text-[#007185] hover:text-[#C7511F] hover:underline pb-2">Buy Again</button>
                    <button className="text-[#007185] hover:text-[#C7511F] hover:underline pb-2">Not Yet Shipped</button>
                    <button className="text-[#007185] hover:text-[#C7511F] hover:underline pb-2">Cancelled Orders</button>
                </div>

                <div className="text-sm">
                    <span className="font-bold">0 orders</span> placed in
                    <select className="ml-2 border border-[#D5D9D9] bg-[#F0F2F2] rounded-md px-2 py-1 text-xs shadow-sm hover:bg-[#E3E6E6]">
                        <option>past 3 months</option>
                        <option>2023</option>
                        <option>2022</option>
                    </select>
                </div>

                <div className="mt-12 text-center text-[#565959]">
                    <p>You have not placed any orders in the past 3 months.</p>
                    <p>View orders in <Link href="#" className="text-[#007185] hover:underline hover:text-[#C7511F]">2023</Link></p>
                </div>

                {/* Mock order item (hidden for now, but ready for logic) */}
                {/* 
                <div className="border rounded-md mt-4">
                    <div className="bg-[#F0F2F2] p-4 flex justify-between text-xs text-[#565959] border-b">
                         <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="uppercase text-[10px]">Order Placed</span>
                                <span className="text-[#0F1111]">11 August 2023</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase text-[10px]">Total</span>
                                <span className="text-[#0F1111]">₹ 499.00</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase text-[10px]">Ship To</span>
                                <span className="text-[#007185] hover:underline hover:text-[#C7511F] cursor-pointer">Avinash</span>
                            </div>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="uppercase text-[10px]">Order # 404-1234567-1234567</span>
                            <div className="flex gap-2 text-[#007185] hover:underline hover:text-[#C7511F] cursor-pointer">
                                <span>View order details</span>
                                <span className="border-l pl-2 border-gray-400">Invoice</span>
                            </div>
                         </div>
                    </div>
                    <div className="p-4 flex justify-between">
                         <div className="flex gap-4">
                             <div className="w-20 h-20 bg-gray-200"></div>
                             <div className="flex flex-col">
                                 <Link href="#" className="font-bold text-[#007185] hover:underline hover:text-[#C7511F]">Sample Product Name</Link>
                                 <span className="text-xs text-[#565959]">Return window closed on 20 Aug 2023</span>
                                 <button className="bg-[#FFD814] border border-[#FCD200] rounded-full px-4 py-1 text-xs mt-2 w-fit shadow-sm hover:bg-[#F3A847]">Buy it again</button>
                             </div>
                         </div>
                    </div>
                </div> 
                */}

            </div>
        </div>
    );
}
