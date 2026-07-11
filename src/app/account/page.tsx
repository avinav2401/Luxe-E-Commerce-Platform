'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Smartphone, Lock, MapPin, CreditCard, LogOut, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/account');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="p-10 text-center text-muted-foreground">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const cards = [
        { icon: Package, title: 'Your Orders', desc: 'Track, return, or buy things again', href: '/orders' },
        { icon: Lock, title: 'Login & security', desc: 'Edit login, name, and mobile number', href: '/account/profile' },
        { icon: MapPin, title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', href: '/account/addresses' },
        { icon: CreditCard, title: 'Payment options', desc: 'Edit or add payment methods', href: '/account/payment' },
        { icon: Smartphone, title: 'Contact Us', desc: 'Contact our customer service via phone or chat', href: '/account/contact' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="bg-background min-h-screen text-foreground p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto py-8">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif font-bold mb-8"
                >
                    Welcome back, {session?.user?.name || 'Guest'}
                </motion.h1>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {cards.map((card, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Link href={card.href} className="group block h-full">
                                <div className="bg-card border border-border rounded-2xl p-6 h-full flex items-start gap-5 transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:bg-secondary/10">
                                    <div className="h-14 w-14 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <card.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{card.title}</h2>
                                        <span className="text-sm text-muted-foreground leading-relaxed">{card.desc}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row gap-8 justify-between items-start"
                >
                    {/* Settings / Sign Out */}
                    <div className="bg-card p-6 rounded-2xl border border-border w-full md:w-1/3">
                        <h3 className="text-xl font-bold mb-4 font-serif">Account Settings</h3>
                        <p className="text-sm text-muted-foreground mb-6">Manage your session and account preferences.</p>
                        <Button 
                            variant="destructive" 
                            onClick={() => signOut({ callbackUrl: '/' })} 
                            className="w-full sm:w-auto flex items-center gap-2 rounded-full"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out securely
                        </Button>
                    </div>

                    {/* Admin Help Box */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 w-full md:w-2/3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ShieldAlert className="w-32 h-32 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-foreground mb-3 font-serif flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-primary" />
                                Admin Access Help
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-lg">
                                To test admin features (like approving sellers or viewing reports), you need an admin account. 
                                You can generate one automatically by visiting the{' '}
                                <Link href="/create-admin" className="font-bold text-primary hover:underline">
                                    /create-admin
                                </Link>{' '}
                                page.
                            </p>
                            <div className="bg-background rounded-lg p-3 inline-block border border-border">
                                <p className="text-sm text-foreground">
                                    Email: <strong className="select-all text-primary">admin@luxe.com</strong> <br/>
                                    Password: <strong className="select-all text-primary">admin123</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
