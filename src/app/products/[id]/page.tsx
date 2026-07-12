import { getProducts } from "@/lib/data-service";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/app/products/[id]/ProductDetailsClient";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const allProducts = await getProducts();
    const product = allProducts.find((p: any) => p.id === id);

    if (!product) {
        return {
            title: "Product Not Found | Luxe",
            description: "The requested product could not be found."
        };
    }

    return {
        title: `${product.name} | Luxe`,
        description: product.description || `Buy ${product.name} at Luxe. Premium quality, exclusive collection.`,
    };
}

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    
    // Fetch all products and find the matching one
    const allProducts = await getProducts();
    const product = allProducts.find((p: any) => p.id === id);

    if (!product) {
        notFound();
    }

    const price = Math.floor(product.price * 80);
    const discount = product.discount || 20;
    const originalPrice = Math.floor(price / (1 - (discount / 100)));

    return (
        <div className="min-h-screen bg-background">
            <div className="pt-4 transition-all duration-300">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Shopping
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Side: Product Image */}
                        <div className="bg-muted/30 border border-border rounded-2xl p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-8 mix-blend-multiply hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Right Side: Product Details */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                    {product.name}
                                </h1>
                                
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex text-primary text-lg">
                                        {'★'.repeat(Math.floor(product.rating || 4.5))}
                                        {'☆'.repeat(5 - Math.floor(product.rating || 4.5))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {(product.reviews || 0).toLocaleString('en-IN')} ratings
                                    </span>
                                </div>
                            </div>

                            <hr className="border-border" />

                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-primary font-medium text-lg">-{Math.floor(discount)}%</span>
                                    <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                                        <span className="text-xl font-normal relative top-[-0.3em] mr-1">₹</span>
                                        {price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    M.R.P.: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>
                            </div>
                            
                            <hr className="border-border" />

                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
                                <h3 className="text-lg font-semibold text-foreground mb-2">About this item</h3>
                                <p className="leading-relaxed">
                                    {product.description || "Experience premium quality with this exclusive item. Hand-selected for our Luxe collection, it delivers outstanding performance and timeless design."}
                                </p>
                            </div>

                            {/* Client Component for Interactive Buttons */}
                            <ProductDetailsClient product={product} />

                            <div className="mt-4 bg-muted/20 border border-border rounded-xl p-4 flex gap-4 text-sm text-muted-foreground">
                                <div className="flex flex-col items-center text-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">↻</div>
                                    <span>7 days Replacement</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">✓</div>
                                    <span>Luxe Delivered</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">🔒</div>
                                    <span>Secure Transaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
