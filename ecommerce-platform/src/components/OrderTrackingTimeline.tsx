'use client';

import { Check, Package, Truck, Home, XCircle } from 'lucide-react';
import { OrderStatus, getStatusLabel, formatOrderDateTime, isStatusCompleted } from '@/lib/orderUtils';

interface TrackingUpdate {
    status: OrderStatus;
    timestamp: Date | string;
    message?: string;
}

interface OrderTrackingTimelineProps {
    currentStatus: OrderStatus;
    trackingHistory: TrackingUpdate[];
    estimatedDelivery?: Date | string;
}

const statusIcons: Record<OrderStatus, any> = {
    placed: Package,
    packed: Package,
    shipped: Truck,
    delivered: Home,
    cancelled: XCircle,
};

const statusSteps: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered'];

export function OrderTrackingTimeline({
    currentStatus,
    trackingHistory,
    estimatedDelivery
}: OrderTrackingTimelineProps) {
    // If cancelled, show cancelled status
    if (currentStatus === 'cancelled') {
        const cancelledUpdate = trackingHistory.find(h => h.status === 'cancelled');
        return (
            <div className="py-4">
                <div className="flex items-center gap-3 text-red-600">
                    <XCircle className="w-6 h-6" />
                    <div>
                        <p className="font-semibold">Order Cancelled</p>
                        {cancelledUpdate && (
                            <p className="text-sm text-gray-600">
                                {formatOrderDateTime(cancelledUpdate.timestamp)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            {/* Desktop: Horizontal Timeline */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200" />
                    <div
                        className="absolute top-6 left-0 h-0.5 bg-green-500 transition-all duration-500"
                        style={{
                            width: `${(statusSteps.indexOf(currentStatus) / (statusSteps.length - 1)) * 100}%`
                        }}
                    />

                    {/* Status Steps */}
                    <div className="relative flex justify-between">
                        {statusSteps.map((status, index) => {
                            const Icon = statusIcons[status];
                            const completed = isStatusCompleted(currentStatus, status);
                            const isCurrent = status === currentStatus;
                            const update = trackingHistory.find(h => h.status === status);

                            return (
                                <div key={status} className="flex flex-col items-center flex-1">
                                    {/* Icon Circle */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'bg-white border-gray-300 text-gray-400'
                                            } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                                    >
                                        {completed ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <Icon className="w-6 h-6" />
                                        )}
                                    </div>

                                    {/* Status Label */}
                                    <div className="mt-3 text-center">
                                        <p className={`text-sm font-medium ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {getStatusLabel(status)}
                                        </p>
                                        {update && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {formatOrderDateTime(update.timestamp)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Estimated Delivery */}
                {estimatedDelivery && currentStatus !== 'delivered' && (
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <span className="font-semibold">Estimated Delivery:</span>{' '}
                            {formatOrderDateTime(estimatedDelivery)}
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="md:hidden space-y-4">
                {statusSteps.map((status, index) => {
                    const Icon = statusIcons[status];
                    const completed = isStatusCompleted(currentStatus, status);
                    const isCurrent = status === currentStatus;
                    const update = trackingHistory.find(h => h.status === status);

                    return (
                        <div key={status} className="flex gap-4">
                            {/* Icon & Line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                                >
                                    {completed ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index < statusSteps.length - 1 && (
                                    <div className={`w-0.5 h-16 ${completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-4">
                                <p className={`text-sm font-medium ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {getStatusLabel(status)}
                                </p>
                                {update && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        {formatOrderDateTime(update.timestamp)}
                                    </p>
                                )}
                                {update?.message && (
                                    <p className="text-xs text-gray-500 mt-1">{update.message}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Estimated Delivery */}
                {estimatedDelivery && currentStatus !== 'delivered' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <span className="font-semibold">Estimated Delivery:</span>{' '}
                            {formatOrderDateTime(estimatedDelivery)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
