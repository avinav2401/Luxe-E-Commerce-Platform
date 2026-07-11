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
                        className="fixed top-0 left-0 h-full w-[365px] max-w-[85vw] bg-background z-50 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-muted text-foreground border-b border-border p-6 pl-9 flex items-center gap-4">
                            <User className="w-10 h-10 rounded-full bg-background border border-border text-foreground p-2" />
                            <div className="flex flex-col">
                                {session?.user ? (
                                    <span className="text-xl font-serif font-bold">Hello, {session.user.name?.split(' ')[0]}</span>
                                ) : (
                                    <Link href="/auth/signin" onClick={onClose} className="text-xl font-serif font-bold hover:text-primary transition-colors">
                                        Hello, Sign in
                                    </Link>
                                )}
                            </div>
                            <button onClick={onClose} className="ml-auto text-foreground hover:text-primary transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto pb-4">
                            {/* Section 1 */}
                            <div className="py-6 border-b border-border">
                                <h3 className="px-9 pb-4 text-lg font-serif font-bold text-foreground">Trending</h3>
                                <SidebarLink href="/products?sort=best-sellers" label="Best Sellers" />
                                <SidebarLink href="/products?sort=newest" label="New Releases" />
                                <SidebarLink href="/products?sort=deals" label="Today's Deals" />
                            </div>

                            {/* Section 2 */}
                            <div className="py-6 border-b border-border">
                                <h3 className="px-9 pb-4 text-lg font-serif font-bold text-foreground">Digital Content & Devices</h3>
                                <SidebarLink href="/products?search=Echo" label="Luxe Echo & Smart Home" withArrow />
                                <SidebarLink href="/products?search=Fire TV" label="Luxe Fire TV" withArrow />
                                <SidebarLink href="/products?search=Kindle" label="Luxe Kindle & eBooks" withArrow />
                                <SidebarLink href="/products?search=Audiobooks" label="Luxe Audiobooks" withArrow />
                                <SidebarLink href="/products?search=Luxe Video" label="Luxe Video" withArrow />
                                <SidebarLink href="/products?search=Luxe Music" label="Luxe Music" withArrow />
                            </div>

                            {/* Section 3 */}
                            <div className="py-6 border-b border-border">
                                <h3 className="px-9 pb-4 text-lg font-serif font-bold text-foreground">Shop By Category</h3>
                                <SidebarLink href="/products?cat=Mobiles" label="Mobiles, Computers" withArrow />
                                <SidebarLink href="/products?cat=Electronics" label="TV, Appliances, Electronics" withArrow />
                                <SidebarLink href="/products?cat=Fashion&search=Men" label="Men's Fashion" withArrow />
                                <SidebarLink href="/products?cat=Fashion&search=Women" label="Women's Fashion" withArrow />
                                <SidebarLink href="/products?cat=Home" label="Home, Kitchen, Pets" withArrow />
                                <SidebarLink href="/products?cat=Beauty" label="Beauty, Health, Grocery" withArrow />
                                <SidebarLink href="/products?cat=Sports" label="Sports, Fitness, Bags, Luggage" withArrow />
                            </div>

                            {/* Section 4 */}
                            <div className="py-6 border-b border-border">
                                <h3 className="px-9 pb-4 text-lg font-serif font-bold text-foreground">Help & Settings</h3>
                                <SidebarLink href="/account" label="Your Account" />
                                <SidebarLink href="/help" label="Customer Service" />
                                {session ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-9 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
        <Link href={href} className="flex items-center justify-between px-9 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group">
            <span>{label}</span>
            {withArrow && <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground" />}
        </Link>
    );
}
