import { useCartStore } from '../useCartStore';

describe('useCartStore Shopping Cart Logic', () => {
    // Reset the store's state before every test
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    const mockProduct1 = {
        id: '1',
        name: 'Test Shirt',
        price: 500,
        description: 'A nice shirt',
        image: '/shirt.png',
        category: 'Clothing'
    };

    const mockProduct2 = {
        id: '2',
        name: 'Test Shoes',
        price: 1200,
        description: 'Nice shoes',
        image: '/shoes.png',
        category: 'Footwear'
    };

    it('should correctly calculate the total price and item count when multiple items are added', () => {
        const store = useCartStore.getState();
        
        // Step 1: Add a ₹500 shirt
        store.addToCart(mockProduct1);
        
        // Step 2: Add ₹1200 shoes
        store.addToCart(mockProduct2);
        
        // Step 3: Add a second ₹500 shirt
        store.addToCart(mockProduct1);

        // Fetch the updated state
        const updatedStore = useCartStore.getState();

        // Expectation 1: There should be exactly 3 items in the cart
        expect(updatedStore.totalItems()).toBe(3);

        // Expectation 2: The total price should be exactly ₹2200 (500 + 1200 + 500)
        expect(updatedStore.totalPrice()).toBe(2200);
    });

    it('should correctly remove items from the cart', () => {
        const store = useCartStore.getState();
        
        // Add the shirt
        store.addToCart(mockProduct1);
        expect(useCartStore.getState().totalItems()).toBe(1);

        // Remove the shirt
        useCartStore.getState().removeFromCart(mockProduct1.id);

        // Expectation: The cart should now be empty
        expect(useCartStore.getState().totalItems()).toBe(0);
        expect(useCartStore.getState().totalPrice()).toBe(0);
    });
});
