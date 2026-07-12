'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function CreateAdminPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/auth/signin');
            } else {
                const data = await res.json();
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map((err: any) => err.message).join(' • ');
                    setError(errorMessages);
                } else {
                    setError(data.error || data.message || 'Admin registration failed');
                }
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/20">
            <div className="w-full max-w-sm space-y-6 bg-background p-8 rounded-xl shadow-lg border">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create Admin</h1>
                    <p className="text-sm text-muted-foreground">Register a new administrator account</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Admin Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Admin...' : 'Register Admin'}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground pt-4">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
