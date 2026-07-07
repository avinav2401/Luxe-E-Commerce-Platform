'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminSellersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/admin/sellers');
        } else if (status === 'authenticated') {
            // @ts-ignore
            if (session?.user?.role !== 'admin') {
                router.push('/');
            } else {
                fetchApplications();
            }
        }
    }, [status, router, session]);

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/admin/sellers');
            if (response.ok) {
                const data = await response.json();
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            const response = await fetch(`/api/admin/sellers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Remove from list or update status
                setApplications(applications.filter((app: any) => app._id !== id));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Action failed', error);
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Seller Applications</h1>
            
            {applications.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">No pending seller applications.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {applications.map((app: any) => (
                            <li key={app._id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{app.storeName}</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Applicant: {app.name} ({app.email})
                                        </p>
                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                                            <span className="font-semibold block mb-1">Description:</span>
                                            {app.storeDescription}
                                        </div>
                                    </div>
                                    <div className="ml-6 flex items-center space-x-3">
                                        <Button
                                            onClick={() => handleAction(app._id, 'approved')}
                                            disabled={actionLoading === app._id}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {actionLoading === app._id ? 'Processing...' : 'Approve'}
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(app._id, 'rejected')}
                                            disabled={actionLoading === app._id}
                                            variant="destructive"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
