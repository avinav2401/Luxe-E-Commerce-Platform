'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#232F3E] text-white">
            {/* Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 bg-[#37475A] hover:bg-[#485769] text-sm text-center font-medium"
            >
                Back to top
            </button>

            {/* Links Section */}
            <div className="container mx-auto px-4 py-12 max-w-[1000px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Get to Know Us</h3>
                        <Link href="#" className="hover:underline text-gray-300">About Us</Link>
                        <Link href="#" className="hover:underline text-gray-300">Careers</Link>
                        <Link href="#" className="hover:underline text-gray-300">Press Releases</Link>
                        <Link href="#" className="hover:underline text-gray-300">Amazon Science</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Connect with Us</h3>
                        <Link href="#" className="hover:underline text-gray-300">Facebook</Link>
                        <Link href="#" className="hover:underline text-gray-300">Twitter</Link>
                        <Link href="#" className="hover:underline text-gray-300">Instagram</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Make Money with Us</h3>
                        <Link href="#" className="hover:underline text-gray-300">Sell on Amazon</Link>
                        <Link href="#" className="hover:underline text-gray-300">Sell under Amazon Accelerator</Link>
                        <Link href="#" className="hover:underline text-gray-300">Protect and Build Your Brand</Link>
                        <Link href="#" className="hover:underline text-gray-300">Amazon Global Selling</Link>
                        <Link href="#" className="hover:underline text-gray-300">Become an Affiliate</Link>
                        <Link href="#" className="hover:underline text-gray-300">Fulfilment by Amazon</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Let Us Help You</h3>
                        <Link href="#" className="hover:underline text-gray-300">COVID-19 and Amazon</Link>
                        <Link href="#" className="hover:underline text-gray-300">Your Account</Link>
                        <Link href="#" className="hover:underline text-gray-300">Returns Centre</Link>
                        <Link href="#" className="hover:underline text-gray-300">100% Purchase Protection</Link>
                        <Link href="#" className="hover:underline text-gray-300">Amazon App Download</Link>
                        <Link href="#" className="hover:underline text-gray-300">Help</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-600 py-8 bg-[#232F3E]">
                <div className="container mx-auto px-4 flex flex-col items-center gap-4">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold tracking-tight">amazon<span className="text-[#febd69]">.in</span></span>
                    </Link>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button className="border border-gray-400 rounded px-2 py-1 flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                            <Globe className="w-4 h-4" /> English
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-300 mt-4">
                        <Link href="#" className="hover:underline">Australia</Link>
                        <Link href="#" className="hover:underline">Brazil</Link>
                        <Link href="#" className="hover:underline">Canada</Link>
                        <Link href="#" className="hover:underline">China</Link>
                        <Link href="#" className="hover:underline">France</Link>
                        <Link href="#" className="hover:underline">Germany</Link>
                        <Link href="#" className="hover:underline">Italy</Link>
                        <Link href="#" className="hover:underline">Japan</Link>
                        <Link href="#" className="hover:underline">Mexico</Link>
                        <Link href="#" className="hover:underline">Netherlands</Link>
                        <Link href="#" className="hover:underline">Poland</Link>
                        <Link href="#" className="hover:underline">Singapore</Link>
                        <Link href="#" className="hover:underline">Spain</Link>
                        <Link href="#" className="hover:underline">Turkey</Link>
                        <Link href="#" className="hover:underline">United Arab Emirates</Link>
                        <Link href="#" className="hover:underline">United Kingdom</Link>
                        <Link href="#" className="hover:underline">United States</Link>
                    </div>
                </div>
            </div>

            <div className="bg-[#131A22] py-4 text-center">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-300 mb-1">
                    <Link href="#" className="hover:underline">Conditions of Use & Sale</Link>
                    <Link href="#" className="hover:underline">Privacy Notice</Link>
                    <Link href="#" className="hover:underline">Interest-Based Ads</Link>
                </div>
                <p className="text-xs text-gray-300">© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
            </div>
        </footer>
    );
}
