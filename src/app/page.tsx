import { ProductShowcase } from "@/components/ProductShowcase";
import { getProducts } from "@/lib/data-service";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export default async function Home() {
  const products = await getProducts(); // Fetch data dynamically
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Hero Section (Classic Luxury Style) */}
      <section className="relative w-full bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 py-12 lg:py-24">
            <div className="flex flex-col gap-8 w-full lg:w-1/2 text-center lg:text-left z-10">
                <FadeIn delay={0.1}>
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-semibold">The New Standard</span>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-foreground leading-[1.1] tracking-tight">
                        Timeless <br className="hidden lg:block" />
                        <span className="italic text-primary">Elegance</span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.5}>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                        Discover a curated collection of refined essentials designed for those who appreciate the true meaning of luxury.
                    </p>
                </FadeIn>
                <FadeIn delay={0.7}>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                        <Link href="/products" className="w-full sm:w-auto h-12 flex items-center justify-center bg-foreground text-background px-8 text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                            Explore Collection
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </FadeIn>
            </div>
            
            <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[700px]">
                <FadeIn delay={0.2} direction="left" className="h-full w-full relative">
                    <div className="absolute inset-0 bg-primary/5 -translate-x-4 translate-y-4 lg:-translate-x-8 lg:translate-y-8 z-0"></div>
                    <div className="relative w-full h-full z-10 shadow-2xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=1200&q=80"
                            alt="Classic Luxury"
                            fill
                            className="object-cover object-center hover:scale-105 transition-transform duration-[2s] ease-out"
                            priority
                        />
                    </div>
                </FadeIn>
            </div>
        </div>
      </section>

      {/* Featured Categories - Minimalist Grid */}
      <section className="bg-card py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                <h2 className="text-2xl md:text-3xl font-serif tracking-wide">Curated For You</h2>
                <Link href="/products" className="text-primary hover:text-foreground transition-colors font-medium text-sm flex items-center gap-1 uppercase tracking-wider">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
          </FadeIn>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Category 1 */}
            <FadeIn delay={0.1}>
                <Link href="/products?cat=Fashion" className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600" alt="Fashion" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-serif text-lg tracking-wide">Fashion</h3>
                        <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">Shop</span>
                    </div>
                </Link>
            </FadeIn>

            {/* Category 2 */}
            <FadeIn delay={0.2}>
                <Link href="/products?cat=Home & Kitchen" className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600" alt="Home" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-serif text-lg tracking-wide">Living</h3>
                        <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">Shop</span>
                    </div>
                </Link>
            </FadeIn>

            {/* Category 3 */}
            <FadeIn delay={0.3}>
                <Link href="/products?cat=Electronics" className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image src="https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=600" alt="Tech" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-serif text-lg tracking-wide">Technology</h3>
                        <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">Shop</span>
                    </div>
                </Link>
            </FadeIn>

            {/* Category 4 */}
            <FadeIn delay={0.4}>
                <Link href="/products?cat=Beauty" className="group flex flex-col gap-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600" alt="Beauty" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-serif text-lg tracking-wide">Beauty</h3>
                        <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">Shop</span>
                    </div>
                </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 space-y-20 lg:space-y-32">
        {/* Best Sellers */}
        <div>
          <FadeIn>
              <h2 className="text-center font-serif text-3xl mb-10 tracking-wide">Signature Pieces</h2>
          </FadeIn>
          <ProductShowcase initialProducts={products.filter((p: any) => p.rating >= 4.5).slice(0, 5)} title="" />
        </div>

        {/* Fashion */}
        <div>
          <FadeIn>
              <h2 className="text-center font-serif text-3xl mb-10 tracking-wide">The Wardrobe</h2>
          </FadeIn>
          <ProductShowcase initialProducts={products.filter((p: any) => p.category === 'Fashion').slice(0, 5)} title="" />
        </div>

        {/* All Products */}
        <div>
          <FadeIn>
              <h2 className="text-center font-serif text-3xl mb-10 tracking-wide">Explore All</h2>
          </FadeIn>
          <ProductShowcase initialProducts={products} title="" />
        </div>
      </div>
    </div>
  );
}
