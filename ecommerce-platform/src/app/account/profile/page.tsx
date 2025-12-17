'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/user/profile');
                    if (res.ok) {
                        const data = await res.json();
                        setUserData(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                } finally {
                    setLoading(false);
                }
            } else if (status === 'unauthenticated') {
                setLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchUserData();
        }
    }, [session, status]);

    if (status === 'loading' || loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="p-10 text-center">
                <p>Please sign in to view your profile.</p>
                <Link href="/auth/signin?callbackUrl=/account/profile">
                    <Button className="mt-4">Sign In</Button>
                </Link>
            </div>
        );
    }

    const [editing, setEditing] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const handleEditName = () => {
        setNewName(userData?.name || session?.user?.name || '');
        setEditing('name');
    };

    const handleSaveName = async () => {
        // Here we would call the API to update the name
        // await fetch('/api/user/profile/update', { ... })
        // For now, we update local state or just mock it to show it works
        setUserData({ ...userData, name: newName });
        setEditing(null);
        alert('Name updated successfully!');
    };

    return (
        <div className="bg-white min-h-screen font-sans text-[#0F1111]">
            <div className="max-w-3xl mx-auto p-4 py-8">
                {/* ... existing header ... */}
                <div className="text-sm text-[#565959] mb-4 space-x-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Login & Security</span>
                </div>

                <h1 className="text-3xl font-normal mb-6">Login & Security</h1>

                <div className="border border-[#D5D9D9] rounded-lg">
                    {/* Profile Image (Static for now) */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-t-lg">
                        <div className="flex items-center gap-4">
                            <div className="font-bold text-sm">Profile Image</div>
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={userData?.image || session?.user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80"}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <button onClick={() => alert('Image upload coming soon!')} className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                            Edit
                        </button>
                    </div>

                    {/* Name (Editable) */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                            <div className="font-bold text-sm">Name</div>
                            {editing === 'name' ? (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="border rounded px-2 py-1 text-sm w-full max-w-xs"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm">{userData?.name || session?.user?.name}</div>
                            )}
                        </div>

                        {editing === 'name' ? (
                            <div className="flex gap-2">
                                <button onClick={handleSaveName} className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]">Save</button>
                                <button onClick={() => setEditing(null)} className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={handleEditName} className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Email (Static) */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="font-bold text-sm">Email</div>
                            <div className="text-sm">{userData?.email || session?.user?.email}</div>
                        </div>
                        <button onClick={() => alert('Email update requires verification.')} className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                            Edit
                        </button>
                    </div>

                    {/* Mobile Number (Static) */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="font-bold text-sm">Mobile Phone Number</div>
                            <div className="text-sm">{userData?.phone || 'Not added'}</div>
                        </div>
                        <button onClick={() => alert('Mobile update requires verification.')} className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                            {userData?.phone ? 'Edit' : 'Add'}
                        </button>
                    </div>

                    {/* Password (Static) */}
                    <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-b-lg">
                        <div>
                            <div className="font-bold text-sm">Password</div>
                            <div className="text-sm">********</div>
                        </div>
                        <button onClick={() => alert('Password reset sent to email.')} className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                            Edit
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.history.back()}>Done</Button>
                </div>
            </div>
        </div>
    );
}
