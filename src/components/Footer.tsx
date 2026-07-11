'use client';

import Link from 'next/link';
import { Globe, Instagram, Twitter, Facebook, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-card text-card-foreground border-t border-border mt-auto">
            {/* Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 bg-muted hover:bg-muted/80 text-sm text-center font-medium transition-colors"
            >
                Back to top
            </button>

            {/* Links Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <span className="text-3xl font-serif font-bold tracking-tight text-primary">
                                Luxe.
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Premium e-commerce experience curated for those who appreciate the finer things in life.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-base mb-2">Company</h3>
                        <Link href="/about" className="hover:text-primary transition-colors text-muted-foreground">About Us</Link>
                        <Link href="/careers" className="hover:text-primary transition-colors text-muted-foreground">Careers</Link>
                        <Link href="/sustainability" className="hover:text-primary transition-colors text-muted-foreground">Sustainability</Link>
                        <Link href="/press" className="hover:text-primary transition-colors text-muted-foreground">Press</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-base mb-2">Support</h3>
                        <Link href="/help" className="hover:text-primary transition-colors text-muted-foreground">Help Center</Link>
                        <Link href="/orders" className="hover:text-primary transition-colors text-muted-foreground">Track Order</Link>
                        <Link href="/help/returns-refunds" className="hover:text-primary transition-colors text-muted-foreground">Returns & Exchanges</Link>
                        <Link href="/help/shipping-delivery" className="hover:text-primary transition-colors text-muted-foreground">Shipping Info</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-base mb-2">Connect</h3>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <Link href="https://instagram.com" className="hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="https://twitter.com" className="hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="https://facebook.com" className="hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="https://github.com/avinav2401" className="hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border py-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button className="rounded-full px-3 py-1.5 flex items-center gap-2 text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors">
                            <Globe className="w-4 h-4" /> English (IN)
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Luxe Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
