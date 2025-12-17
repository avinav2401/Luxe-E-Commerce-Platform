'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/account/profile');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const handleEditName = () => {
        setNewName(session?.user?.name || '');
        setIsEditingName(true);
    };

    const handleSaveName = async () => {
        if (!newName.trim()) {
            alert('Please enter a valid name');
            return;
        }

        try {
            const response = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update name');
            }

            alert('Name updated successfully! Please refresh to see changes.');
            setIsEditingName(false);

            // Refresh the page to update the session
            router.refresh();
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update name: ${error.message}`);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setNewName('');
    };

    return (
        <div className="bg-white min-h-screen text-[#0F1111] font-sans">
            <div className="max-w-3xl mx-auto p-4 py-8">
                <div className="text-sm text-[#565959] mb-4 space-x-1">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <span>›</span>
                    <span className="text-[#C7511F]">Login & Security</span>
                </div>

                <h1 className="text-3xl font-normal mb-6">Login & Security</h1>

                <div className="border border-[#D5D9D9] rounded-lg">
                    {/* Profile Image */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-t-lg">
                        <div className="flex items-center gap-4">
                            <div className="font-bold text-sm">Profile Image</div>
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={session?.user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80"}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Profile image upload coming soon!')}
                            className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Name - Editable */}
                    <div className="p-4 border-b border-[#D5D9D9] bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-bold text-sm mb-2">Name</div>
                                {isEditingName ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="border border-gray-400 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:ring-2 focus:ring-[#e77600] outline-none"
                                            placeholder="Enter your name"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm">{session?.user?.name || 'Not set'}</div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {isEditingName ? (
                                    <>
                                        <button
                                            onClick={handleSaveName}
                                            className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditName}
                                        className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="font-bold text-sm">Email</div>
                            <div className="text-sm">{session?.user?.email || 'Not set'}</div>
                        </div>
                        <button
                            onClick={() => alert('Email changes require verification for security.')}
                            className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Mobile Number */}
                    <div className="p-4 border-b border-[#D5D9D9] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="font-bold text-sm">Mobile Phone Number</div>
                            <div className="text-sm">Not added</div>
                        </div>
                        <button
                            onClick={() => alert('Phone number management coming soon!')}
                            className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>

                    {/* Password */}
                    <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-b-lg">
                        <div>
                            <div className="font-bold text-sm">Password</div>
                            <div className="text-sm">••••••••</div>
                        </div>
                        <button
                            onClick={() => alert('Password reset will send a link to your email.')}
                            className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => router.push('/account')}
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
