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
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const [userData, setUserData] = useState<any>(null);

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

    const handleEditPhone = () => {
        setNewPhone(userData?.phone || '');
        setIsEditingPhone(true);
    };

    const handleSavePhone = async () => {
        try {
            const response = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: newPhone.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update phone');
            }

            setUserData({ ...userData, phone: newPhone.trim() });
            alert('Phone number updated successfully!');
            setIsEditingPhone(false);
            router.refresh();
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update phone: ${error.message}`);
        }
    };

    const handleCancelPhoneEdit = () => {
        setIsEditingPhone(false);
        setNewPhone('');
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
                    {/* Name - Editable */}
                    <div className="p-4 border-b border-[#D5D9D9] bg-white hover:bg-gray-50 transition-colors rounded-t-lg">
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
                            onClick={() => alert('⚠️ Email changes require verification.\n\nFor security, changing your email requires:\n1. Verification of new email\n2. Confirmation from old email\n\nThis feature requires backend email service integration.')}
                            className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Mobile Phone Number - Editable */}
                    <div className="p-4 border-b border-[#D5D9D9] bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-bold text-sm mb-2">Mobile Phone Number</div>
                                {isEditingPhone ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="tel"
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            className="border border-gray-400 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:ring-2 focus:ring-[#e77600] outline-none"
                                            placeholder="+91 1234567890"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm">{userData?.phone || 'Not added'}</div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {isEditingPhone ? (
                                    <>
                                        <button
                                            onClick={handleSavePhone}
                                            className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelPhoneEdit}
                                            className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditPhone}
                                        className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                                    >
                                        {userData?.phone ? 'Edit' : 'Add'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-b-lg">
                        <div>
                            <div className="font-bold text-sm">Password</div>
                            <div className="text-sm">••••••••</div>
                        </div>
                        <button
                            onClick={() => alert('🔒 Password Change Security\n\nChanging your password requires:\n1. Current password verification\n2. New password confirmation\n3. Email verification link\n\nThis feature requires:\n- Backend password hashing (bcrypt)\n- Email service integration\n- Secure token generation\n\nFor now, use the "Forgot Password" flow on the login page.')}
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
