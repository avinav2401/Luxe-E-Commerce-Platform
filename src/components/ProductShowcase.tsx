'use client';

import { Product } from '@/store/useCartStore';
import { ProductCard } from "./ProductCard";
import { motion, Variants } from 'framer-motion';

interface ProductShowcaseProps {
    initialProducts: Product[];
}

export function ProductShowcase({ initialProducts, title = "Recommended for you" }: ProductShowcaseProps & { title?: string }) {
    
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };
    
    return (
        <section className="space-y-4">
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            <motion.div 
                key={initialProducts.map(p => p.id).join('-')}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            >
                {initialProducts.map((product) => (
                    <motion.div key={product.id} variants={item}>
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
