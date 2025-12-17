import { ProductShowcase } from "@/components/ProductShowcase";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/data-service"; // Updated import
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts(); // Fetch data dynamically
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Hero Section (Amazon Style) */}
      <section className="relative w-full max-w-[1500px] mx-auto">
        <div className="relative w-full h-[600px] overflow-hidden">
          {/* Banner Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80"
              alt="Banner"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Gradient Fade to connect with content below */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-gray-100/100" />
          </div>
        </div>

        {/* Category Cards Overlay */}
        <div className="relative -mt-64 z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 flex flex-col gap-4 shadow-sm z-20 h-[420px]">
              <h2 className="text-xl font-bold text-black">Revamp your home in style</h2>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300" alt="Decor" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Cushion covers, bedsheets & more</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=300" alt="Vases" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Figurines, vases & more</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=300" alt="Storage" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Home storage</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=300" alt="Lighting" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Lighting solutions</p>
                </div>
              </div>
              <Link href="/products?cat=Home" className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline">See all offers</Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 flex flex-col gap-4 shadow-sm z-20 h-[420px]">
              <h2 className="text-xl font-bold text-black">Appliances for your home | Up to 55% off</h2>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=300" alt="AC" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Air conditioners</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1536353284924-9220c464e262?auto=format&fit=crop&w=300" alt="Fridge" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Refrigerators</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=300" alt="Microwave" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Microwaves</p>
                </div>
                <div className="space-y-1">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=300" alt="Washing Machine" fill className="object-cover" />
                  </div>
                  <p className="text-xs text-black">Washing machines</p>
                </div>
              </div>
              <Link href="/products?cat=Electronics" className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline">See all offers</Link>
            </div>

            {/* Card 3 - Single Big Image */}
            <div className="bg-white p-6 flex flex-col gap-4 shadow-sm z-20 h-[420px]">
              <h2 className="text-xl font-bold text-black">Up to 60% off | Styles for Men</h2>
              <div className="flex-1 relative bg-gray-100 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600" alt="Men Fashion" fill className="object-cover" />
              </div>
              <Link href="/products?cat=Fashion" className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline">See all offers</Link>
            </div>

            {/* Card 4 - Single Big Image */}
            <div className="bg-white p-6 flex flex-col gap-4 shadow-sm z-20 h-[420px]">
              <h2 className="text-xl font-bold text-black">Automotive essentials | Up to 60% off</h2>
              <div className="flex-1 relative bg-gray-100 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600" alt="Automotive" fill className="object-cover" />
              </div>
              <Link href="/products" className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline">See all offers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-8 space-y-12">
        {/* Best Sellers */}
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <ProductShowcase initialProducts={products.filter((p: any) => p.rating >= 4.5).slice(0, 5)} title="Best Sellers" />
        </div>

        {/* Electronics */}
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <ProductShowcase initialProducts={products.filter((p: any) => p.category === 'Electronics').slice(0, 5)} title="Electronics & Gadgets" />
        </div>

        {/* Home & Kitchen */}
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <ProductShowcase initialProducts={products.filter((p: any) => p.category === 'Home & Kitchen').slice(0, 5)} title="Home & Kitchen Essentials" />
        </div>

        {/* Fashion */}
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <ProductShowcase initialProducts={products.filter((p: any) => p.category === 'Fashion').slice(0, 5)} title="Fashion Trends" />
        </div>

        {/* All Products */}
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <ProductShowcase initialProducts={products} title="Explore All Products" />
        </div>
      </div>
    </div>
  );
}
