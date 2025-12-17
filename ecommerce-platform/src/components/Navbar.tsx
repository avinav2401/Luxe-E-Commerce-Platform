'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { NavigationSidebar } from './NavigationSidebar';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const totalItems = useCartStore((state) => state.totalItems());
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState("All");

    const [deliveryLocation, setDeliveryLocation] = useState<{ city: string, zip: string } | null>(null);

    useEffect(() => {
        setMounted(true);
        // Fetch default address for "Delivering to..."
        const saved = localStorage.getItem('userAddresses');
        if (saved) {
            const addresses = JSON.parse(saved);
            const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
            if (defaultAddr) {
                setDeliveryLocation({ city: defaultAddr.city, zip: defaultAddr.zip });
            }
        }
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('search', searchQuery);
        if (searchCategory !== 'All') params.set('cat', searchCategory);

        router.push(`/products?${params.toString()}`);
    };


    return (
        <>
            {!mounted ? null : (
                <>
                    <header className="flex flex-col relative z-40">
                        {/* Primary Navbar (Dark Blue) */}
                        <div className="bg-[#131921] text-white py-2 px-4 flex items-center gap-2 h-[60px]">
                            {/* Logo */}
                            <Link href="/" className="mr-2 flex items-center pt-2 border border-transparent hover:border-white rounded-sm p-1">
                                <span className="text-2xl font-bold tracking-tight">amazon<span className="text-[#febd69]">.in</span></span>
                            </Link>

                            {/* Location */}
                            <Link href="/account/addresses" className="hidden md:flex flex-col leading-none text-xs border border-transparent hover:border-white rounded-sm p-2">
                                <span className="text-gray-300 ml-5">Delivering to {deliveryLocation ? `${deliveryLocation.city} ${deliveryLocation.zip}` : 'Select your address'}</span>
                                <span className="font-bold flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    Update location
                                </span>
                            </Link>

                            {/* Search Bar (Dominant) */}
                            <div className="flex-1 mx-4 hidden sm:flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f90]">
                                <div className="bg-[#f3f3f3] text-gray-600 flex items-center text-xs border-r hover:bg-[#dadada] cursor-pointer relative group">
                                    <select
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        className="appearance-none bg-transparent h-full px-3 pr-6 outline-none cursor-pointer text-gray-700 bg-[#f3f3f3] hover:bg-[#dadada]"
                                    >
                                        <option value="All">All</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home & Kitchen">Home</option>
                                        <option value="Beauty">Beauty</option>
                                        <option value="Computers">Computers</option>
                                        <option value="Mobiles">Mobiles</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-2 pointer-events-none" />
                                </div>
                                <input
                                    className="flex-1 px-3 text-black outline-none h-full bg-white"
                                    type="text"
                                    placeholder="Search Amazon.in"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center"
                                >
                                    <Search className="w-6 h-6 text-[#131921]" />
                                </button>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-1">
                                {/* Language */}
                                <button className="hidden lg:flex items-center gap-1 p-2 border border-transparent hover:border-white rounded-sm font-bold text-sm">
                                    EN <ChevronDown className="w-3 h-3 text-gray-400" />
                                </button>

                                {/* Account */}
                                <Link href={session ? "/account" : "/auth/signin"} className="flex flex-col leading-none text-xs border border-transparent hover:border-white rounded-sm p-2">
                                    <span className="text-sm">Hello, {session?.user?.name ? session.user.name.split(' ')[0] : 'sign in'}</span>
                                    <span className="font-bold text-sm flex items-center">Account & Lists <ChevronDown className="w-3 h-3 ml-1 text-gray-400" /></span>
                                </Link>

                                {/* Orders */}
                                <Link href="/orders" className="hidden md:flex flex-col leading-none text-xs border border-transparent hover:border-white rounded-sm p-2 text-white">
                                    <span className="">Returns</span>
                                    <span className="font-bold text-sm">& Orders</span>
                                </Link>

                                {/* Cart */}
                                <Link href="/cart" className="flex items-end gap-1 border border-transparent hover:border-white rounded-sm p-2 text-white">
                                    <div className="relative">
                                        <ShoppingCart className="w-8 h-8" />
                                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] font-bold text-sm">
                                            {totalItems}
                                        </span>
                                    </div>
                                    <span className="font-bold text-sm hidden md:inline mb-1">Cart</span>
                                </Link>
                            </div>
                        </div>

                        {/* Secondary Navbar (lighter blue) */}
                        <div className="bg-[#232F3E] text-white text-sm flex items-center gap-6 px-4 py-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <button
                                onClick={() => setIsNavOpen(true)}
                                className="flex items-center gap-1 font-bold border border-transparent hover:border-white px-2 rounded-sm"
                            >
                                <Menu className="w-5 h-5" /> All
                            </button>
                            <Link href="/products" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Fresh</Link>
                            <Link href="/products?cat=Electronics" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">MX Player</Link>
                            <Link href="/products" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Sell</Link>
                            <Link href="/products?sort=best-sellers" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Best Sellers</Link>
                            <Link href="/products?cat=Electronics" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Mobiles</Link>
                            <Link href="/products?sort=deals" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Today&apos;s Deals</Link>
                            <Link href="/products" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Customer Service</Link>
                            <Link href="/products?cat=Electronics" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Electronics</Link>
                            <Link href="/products?cat=Home & Kitchen" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Home & Kitchen</Link>
                            <Link href="/products?prime=true" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">Prime</Link>
                            <Link href="/products?sort=newest" className="hover:border hover:border-white px-2 py-1 border border-transparent rounded-sm">New Releases</Link>
                        </div>

                        {/* Mobile Search - Visible only on small screens */}
                        <div className="sm:hidden bg-[#131921] pb-3 px-3">
                            <div className="flex h-10 rounded-md overflow-hidden">
                                <input
                                    className="flex-1 px-3 text-black outline-none h-full rounded-l-md bg-white"
                                    type="text"
                                    placeholder="Search Amazon.in"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#febd69] px-4 flex items-center justify-center rounded-r-md"
                                >
                                    <Search className="w-6 h-6 text-[#131921]" />
                                </button>
                            </div>
                        </div>
                    </header>
                    <NavigationSidebar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
                </>
            )}
        </>
    );
}
