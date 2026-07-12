'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function CreateAdminPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Setting up demo accounts...');
    const router = useRouter();

    useEffect(() => {
        const setupAccounts = async () => {
            try {
                const res = await fetch('/api/setup-demo-accounts', {
                    method: 'POST',
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Demo accounts are ready!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Failed to setup accounts.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during setup.');
            }
        };

        setupAccounts();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
            <div className="max-w-md w-full bg-background rounded-2xl p-8 border shadow-sm text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <h1 className="text-xl font-bold">Please wait...</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold">Accounts Ready!</h1>
                        <p className="text-muted-foreground">{message}</p>
                        
                        <div className="bg-muted p-4 rounded-lg w-full text-left mt-4 text-sm">
                            <p className="font-semibold mb-2">You can now login with:</p>
                            <p><strong>Admin:</strong> admin@luxe.com / admin123</p>
                        </div>

                        <Button onClick={() => router.push('/auth/signin')} className="w-full mt-6">
                            Go to Login
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                            <span className="text-3xl">✖</span>
                        </div>
                        <h1 className="text-2xl font-bold text-red-600">Setup Failed</h1>
                        <p className="text-muted-foreground">{message}</p>
                        <Button onClick={() => router.push('/auth/signin')} variant="outline" className="w-full mt-6">
                            Back to Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
