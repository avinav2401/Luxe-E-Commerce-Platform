'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function CreateAdminPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const createAdmin = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/seed/admin', {
                method: 'POST',
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data);
            } else {
                setError(data.message || 'Failed to create admin');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Create Admin User</h1>
                <p className="text-gray-600">Click below to create or update an admin user account</p>
            </div>

            <Card className="p-8">
                <div className="space-y-6">
                    {!result && !error && (
                        <div className="text-center">
                            <Button
                                onClick={createAdmin}
                                disabled={loading}
                                size="lg"
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Admin...
                                    </>
                                ) : (
                                    'Create Admin User'
                                )}
                            </Button>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-6 h-6" />
                                <h3 className="text-lg font-semibold">Success!</h3>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                                <p><strong>Email:</strong> {result.email}</p>
                                {result.password && result.password !== 'Use your existing password' && (
                                    <>
                                        <p><strong>Password:</strong> {result.password}</p>
                                        <p className="text-sm text-red-600 mt-2">
                                            ⚠️ Please save these credentials and change the password after first login!
                                        </p>
                                    </>
                                )}
                                {result.password === 'Use your existing password' && (
                                    <p className="text-sm text-gray-600">
                                        Your existing account has been updated to admin. Use your current password to login.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold">Next Steps:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                                    <li>Logout if currently logged in</li>
                                    <li>Login with the admin credentials above</li>
                                    <li>Navigate to <code className="bg-gray-100 px-1 rounded">/admin/orders</code></li>
                                    <li>You should see the admin dashboard!</li>
                                </ol>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button asChild variant="outline" className="flex-1">
                                    <a href="/auth/signin">Go to Login</a>
                                </Button>
                                <Button asChild className="flex-1">
                                    <a href="/admin/orders">Admin Panel</a>
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-6 h-6" />
                                <h3 className="text-lg font-semibold">Error</h3>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>

                            <Button onClick={createAdmin} variant="outline" className="w-full">
                                Try Again
                            </Button>
                        </div>
                    )}

                    <div className="pt-6 border-t">
                        <p className="text-xs text-gray-500 text-center">
                            Note: This is a development tool. Remove this endpoint before deploying to production.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
