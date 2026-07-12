'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // I need to ensure this is available
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            setError('Failed to sign in with Google');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/20">
            <div className="w-full max-w-sm space-y-6 bg-background p-8 rounded-xl shadow-lg border">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full" 
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                >
                    {googleLoading ? (
                        "Redirecting..."
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            Google
                        </>
                    )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>

                {/* Demo Credentials Box */}
                <div className="mt-4 space-y-2">
                    <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">🛡️ Admin Login</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">Email: <span className="font-mono font-semibold">admin@luxe.com</span></p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">Password: <span className="font-mono font-semibold">admin123</span></p>
                    </div>
                    <div className="bg-green-50/60 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-xs font-bold text-green-800 dark:text-green-300 mb-1">🏪 Seller Login</p>
                        <p className="text-xs text-green-700 dark:text-green-400">Email: <span className="font-mono font-semibold">seller@luxe.com</span></p>
                        <p className="text-xs text-green-700 dark:text-green-400">Password: <span className="font-mono font-semibold">seller123</span></p>
                    </div>
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                        <p className="text-xs font-bold text-foreground mb-1">👤 User Login</p>
                        <p className="text-xs text-muted-foreground">Email: <span className="font-mono font-semibold">user@luxe.com</span></p>
                        <p className="text-xs text-muted-foreground">Password: <span className="font-mono font-semibold">user123</span></p>
                    </div>
                </div>

            </div>
        </div>
    );
}
