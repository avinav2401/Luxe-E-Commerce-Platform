import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    discount?: number;
    rating?: number;
    reviews?: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product) => set((state) => {
                const existingItem = state.cart.find((item) => item.id === product.id);
                if (existingItem) {
                    return {
                        cart: state.cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter((item) => item.id !== productId),
            })),
            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                ).filter(item => item.quantity > 0),
            })),
            clearCart: () => set({ cart: [] }),
            totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'shopping-cart-storage',
        }
    )
);
