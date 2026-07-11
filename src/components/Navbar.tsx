'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin, ChevronDown, User, Home, LayoutDashboard, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { NavigationSidebar } from './NavigationSidebar';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const totalItems = useCartStore((state) => state.totalItems());
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState("All");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    const categories = ["All", "Digital Content", "Electronics", "Fashion", "Home & Kitchen", "Beauty"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [deliveryLocation, setDeliveryLocation] = useState<{ city: string, zip: string } | null>(null);

    useEffect(() => {
        setMounted(true);
        const fetchAddress = () => {
            if (session?.user?.email) {
                fetch('/api/user/addresses')
                    .then(res => res.json())
                    .then(data => {
                        if (data.addresses && data.addresses.length > 0) {
                            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
                            if (defaultAddr) {
                                setDeliveryLocation({ city: defaultAddr.city, zip: defaultAddr.zip });
                            }
                        } else {
                            setDeliveryLocation(null);
                        }
                    })
                    .catch(console.error);
            } else {
                setDeliveryLocation(null);
            }
        };

        fetchAddress();

        window.addEventListener('addressesUpdated', fetchAddress);
        return () => window.removeEventListener('addressesUpdated', fetchAddress);
    }, [session]);

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
                    {/* Desktop & Top Mobile Navbar */}
                    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border shadow-sm transition-all duration-300">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                            {/* Left: Logo & Menu */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsNavOpen(true)}
                                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
                                >
                                    <Menu className="w-5 h-5 text-foreground" />
                                </button>
                                <Link href="/" className="flex items-center gap-2 group">
                                    <span className="text-3xl font-serif font-bold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
                                        Luxe.
                                    </span>
                                </Link>
                                
                                {/* Location (Desktop Only) */}
                                <Link href="/account/addresses" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors text-sm text-muted-foreground border border-transparent hover:border-border">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] uppercase font-semibold tracking-wider">Deliver to</span>
                                        <span className="font-medium text-foreground truncate max-w-[120px]">
                                            {deliveryLocation ? `${deliveryLocation.city}` : 'Select location'}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Center: Search Bar */}
                            <div className="flex-1 max-w-2xl hidden md:flex items-center h-10 rounded-full border border-border bg-muted/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-inner relative">
                                <div ref={categoryRef} className="h-full border-r border-border hover:bg-muted/80 transition-colors relative flex items-center rounded-l-full">
                                    <button
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className="h-full px-4 pr-8 flex items-center justify-between text-sm font-medium text-foreground outline-none cursor-pointer w-full min-w-[140px] rounded-l-full"
                                    >
                                        <span className="truncate">{searchCategory === "All" ? "All Categories" : searchCategory}</span>
                                        <ChevronDown className={cn("w-3 h-3 absolute right-3 text-muted-foreground transition-transform duration-200", isCategoryOpen ? "rotate-180" : "")} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-xl overflow-hidden z-50 py-1"
                                            >
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setSearchCategory(cat);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                                            searchCategory === cat 
                                                                ? "bg-primary/10 text-primary font-medium" 
                                                                : "text-foreground hover:bg-muted/50"
                                                        )}
                                                    >
                                                        {cat === "All" ? "All Categories" : cat}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="flex-1 h-full px-4 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                    type="text"
                                    placeholder="Search for premium products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="h-full px-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center rounded-r-full"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                {/* Admin/Seller Button */}
                                <Link
                                    href={
                                        // @ts-ignore
                                        session?.user?.role === 'admin' ? '/admin' :
                                        // @ts-ignore
                                        session?.user?.role === 'seller' ? '/seller' :
                                        '/orders'
                                    }
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                >
                                    {/* @ts-ignore */}
                                    {session?.user?.role === 'admin' ? 'Dashboard' :
                                        // @ts-ignore
                                        session?.user?.role === 'seller' ? 'Dashboard' :
                                            'Track Order'}
                                </Link>

                                <Link href={session ? "/account" : "/auth/signin"} className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors group">
                                    <User className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                </Link>

                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="relative flex items-center justify-center">
                                    <Link href="/cart" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors group">
                                        <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                        {totalItems > 0 && (
                                            <motion.span 
                                                key={totalItems} // Re-animates when totalItems changes
                                                initial={{ scale: 0, y: 10 }}
                                                animate={{ scale: 1, y: 0 }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full shadow-md border-2 border-background"
                                            >
                                                {totalItems}
                                            </motion.span>
                                        )}
                                    </Link>
                                </motion.div>
                                
                                {/* Mobile Menu Trigger (if no bottom bar for some elements) */}
                                <button
                                    onClick={() => setIsNavOpen(true)}
                                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
                                >
                                    <Menu className="w-5 h-5 text-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Bar (Below Header) */}
                        <div className="md:hidden px-4 pb-3">
                            <div className="flex items-center h-10 rounded-full border border-border bg-muted/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                <input
                                    className="flex-1 h-full px-4 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                    type="text"
                                    placeholder="Search Luxe..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="h-full px-5 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>
                    
                    {/* Categories Bar (Desktop) */}
                    <div className="hidden md:block w-full border-b border-border bg-background">
                        <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm font-medium text-muted-foreground">
                            <Link href="/products" className="hover:text-primary transition-colors">All Products</Link>
                            <Link href="/products?sort=best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link>
                            <Link href="/products?cat=Fashion" className="hover:text-primary transition-colors">Fashion</Link>
                            <Link href="/products?cat=Electronics" className="hover:text-primary transition-colors">Electronics</Link>
                            <Link href="/products?cat=Beauty" className="hover:text-primary transition-colors">Beauty & Grooming</Link>
                            <Link href="/products?cat=Home & Kitchen" className="hover:text-primary transition-colors">Home & Living</Link>
                            <Link href="/products?cat=Digital Content" className="hover:text-primary transition-colors">Digital Content</Link>
                        </div>
                    </div>

                    {/* Mobile Bottom Navigation Bar (Android focus) */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
                        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                            <Home className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">Home</span>
                        </Link>
                        <Link href="/products" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                            <Search className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">Explore</span>
                        </Link>
                        <Link href="/cart" className="relative flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 mb-1" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">Cart</span>
                        </Link>
                        <Link href={session ? "/account" : "/auth/signin"} className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                            <User className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">Profile</span>
                        </Link>
                    </div>

                    <NavigationSidebar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
                </>
            )}
        </>
    );
}
