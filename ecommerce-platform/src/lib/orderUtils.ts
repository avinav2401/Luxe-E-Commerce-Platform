/**
 * Order utility functions for tracking, status management, and delivery estimates
 */

export const orderStatuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof orderStatuses[number];

/**
 * Calculate estimated delivery date (5 business days from order date)
 */
export function calculateEstimatedDelivery(orderDate: Date): Date {
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    return estimatedDate;
}

/**
 * Get color class for order status badges
 */
export function getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
        placed: 'bg-blue-100 text-blue-800',
        packed: 'bg-purple-100 text-purple-800',
        shipped: 'bg-orange-100 text-orange-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
        placed: 'Order Placed',
        packed: 'Packed',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
    };
    return labels[status] || status;
}

/**
 * Check if a status is completed (for timeline display)
 */
export function isStatusCompleted(currentStatus: OrderStatus, checkStatus: OrderStatus): boolean {
    const statusOrder = ['placed', 'packed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(checkStatus);

    if (currentStatus === 'cancelled') {
        return checkStatus === 'cancelled';
    }

    return checkIndex <= currentIndex;
}

/**
 * Get the next status in the order flow
 */
export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const flow: Record<OrderStatus, OrderStatus | null> = {
        placed: 'packed',
        packed: 'shipped',
        shipped: 'delivered',
        delivered: null,
        cancelled: null,
    };
    return flow[currentStatus];
}

/**
 * Format date for display
 */
export function formatOrderDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format date and time for display
 */
export function formatOrderDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
