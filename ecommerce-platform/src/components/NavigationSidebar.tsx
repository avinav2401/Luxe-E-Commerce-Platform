'use client';

import { X, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

interface NavigationSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
    const { data: session } = useSession();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-[365px] bg-white z-50 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#232f3e] text-white p-4 pl-9 flex items-center gap-3">
                            <User className="w-8 h-8 rounded-full bg-white text-[#232f3e] p-1" />
                            <div className="flex flex-col">
                                {session?.user ? (
                                    <span className="text-lg font-bold">Hello, {session.user.name?.split(' ')[0]}</span>
                                ) : (
                                    <Link href="/auth/signin" onClick={onClose} className="text-lg font-bold hover:underline">
                                        Hello, Sign in
                                    </Link>
                                )}
                            </div>
                            <button onClick={onClose} className="ml-auto text-white hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto pb-4">
                            {/* Section 1 */}
                            <div className="py-4 border-b border-gray-200">
                                <h3 className="px-9 pb-2 text-lg font-bold text-[#111]">Trending</h3>
                                <SidebarLink href="/products?sort=best-sellers" label="Best Sellers" />
                                <SidebarLink href="/products?sort=newest" label="New Releases" />
                                <SidebarLink href="/products?sort=best-sellers" label="Movers and Shakers" />
                            </div>

                            {/* Section 2 */}
                            <div className="py-4 border-b border-gray-200">
                                <h3 className="px-9 pb-2 text-lg font-bold text-[#111]">Digital Content & Devices</h3>
                                <SidebarLink href="/products?search=Echo" label="Echo & Alexa" withArrow />
                                <SidebarLink href="/products?search=Fire TV" label="Fire TV" withArrow />
                                <SidebarLink href="/products?search=Kindle" label="Kindle E-Readers & eBooks" withArrow />
                                <SidebarLink href="/products?search=Audible" label="Audible Audiobooks" withArrow />
                                <SidebarLink href="/products?search=Prime Video" label="Amazon Prime Video" withArrow />
                                <SidebarLink href="/products?search=Amazon Music" label="Amazon Music" withArrow />
                            </div>

                            {/* Section 3 */}
                            <div className="py-4 border-b border-gray-200">
                                <h3 className="px-9 pb-2 text-lg font-bold text-[#111]">Shop By Category</h3>
                                <SidebarLink href="/products?cat=Mobiles" label="Mobiles, Computers" withArrow />
                                <SidebarLink href="/products?cat=Electronics" label="TV, Appliances, Electronics" withArrow />
                                <SidebarLink href="/products?cat=Fashion&search=Men" label="Men's Fashion" withArrow />
                                <SidebarLink href="/products?cat=Fashion&search=Women" label="Women's Fashion" withArrow />
                                <SidebarLink href="/products?cat=Home" label="Home, Kitchen, Pets" withArrow />
                                <SidebarLink href="/products?cat=Beauty" label="Beauty, Health, Grocery" withArrow />
                                <SidebarLink href="/products?cat=Sports" label="Sports, Fitness, Bags, Luggage" withArrow />
                            </div>

                            {/* Section 4 */}
                            <div className="py-4 border-b border-gray-200">
                                <h3 className="px-9 pb-2 text-lg font-bold text-[#111]">Help & Settings</h3>
                                <SidebarLink href="/account" label="Your Account" />
                                <SidebarLink href="/help" label="Customer Service" />
                                {session ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-9 py-3 text-sm font-medium text-[#111] hover:bg-gray-100 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <SidebarLink href="/auth/signin" label="Sign In" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function SidebarLink({ href, label, withArrow = false }: { href: string, label: string, withArrow?: boolean }) {
    return (
        <Link href={href} className="flex items-center justify-between px-9 py-3 text-sm font-medium text-[#111] hover:bg-gray-100 transition-colors group">
            <span>{label}</span>
            {withArrow && <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#111]" />}
        </Link>
    );
}
