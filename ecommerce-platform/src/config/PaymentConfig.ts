/**
 * Payment Configuration for Test Mode
 * 
 * This file contains payment gateway configurations for test/development mode.
 * No real money is processed, no KYC required.
 * 
 * To get actual test links:
 * - Razorpay: Visit https://dashboard.razorpay.com/app/payment-pages (Test Mode)
 * - Stripe: Visit https://dashboard.stripe.com/test/payment-links
 */

export type PaymentMethod = 'razorpay' | 'stripe' | 'mock';

export interface PaymentConfig {
    id: PaymentMethod;
    name: string;
    description: string;
    testLink?: string;
    enabled: boolean;
    icon: string;
    testCards?: {
        number: string;
        cvc: string;
        expiry: string;
    }[];
}

export const PAYMENT_METHODS: PaymentConfig[] = [
    {
        id: 'razorpay',
        name: 'Razorpay Test Mode',
        description: 'Pay with Card/UPI (Test Mode)',
        testLink: 'https://rzp.io/i/TESTLINK', // Replace with your actual Razorpay test payment link
        enabled: true,
        icon: '💳',
        testCards: [
            {
                number: '4111 1111 1111 1111',
                cvc: 'Any 3 digits',
                expiry: 'Any future date'
            },
            {
                number: '5555 5555 5555 4444',
                cvc: 'Any 3 digits',
                expiry: 'Any future date'
            }
        ]
    },
    {
        id: 'stripe',
        name: 'Stripe Test Mode',
        description: 'Pay with Card (Test Mode)',
        testLink: 'https://buy.stripe.com/test_XXXXX', // Replace with your actual Stripe test payment link
        enabled: false, // Disabled by default, enable when you have a test link
        icon: '💳',
        testCards: [
            {
                number: '4242 4242 4242 4242',
                cvc: 'Any 3 digits',
                expiry: 'Any future date'
            }
        ]
    },
    {
        id: 'mock',
        name: 'Mock Payment',
        description: 'Instant success - for testing only',
        enabled: true,
        icon: '✨'
    }
];

/**
 * Get enabled payment methods
 */
export const getEnabledPaymentMethods = () => {
    return PAYMENT_METHODS.filter(method => method.enabled);
};

/**
 * Get payment method by ID
 */
export const getPaymentMethod = (id: PaymentMethod) => {
    return PAYMENT_METHODS.find(method => method.id === id);
};
