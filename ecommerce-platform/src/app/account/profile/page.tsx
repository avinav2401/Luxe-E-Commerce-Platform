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
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [newRole, setNewRole] = useState('');
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

    const handleEditEmail = () => {
        setNewEmail(session?.user?.email || '');
        setIsEditingEmail(true);
    };

    const handleSaveEmail = async () => {
        if (!newEmail.trim()) {
            alert('Please enter a valid email');
            return;
        }

        try {
            const response = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update email');
            }

            alert('Email updated successfully! Please sign in again with your new email.');
            setIsEditingEmail(false);
            router.push('/auth/signin');
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update email: ${error.message}`);
        }
    };

    const handleCancelEmailEdit = () => {
        setIsEditingEmail(false);
        setNewEmail('');
    };

    const handleEditPassword = () => {
        setNewPassword('');
        setIsEditingPassword(true);
    };

    const handleSavePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update password');
            }

            alert('Password updated successfully! Please sign in again.');
            setIsEditingPassword(false);
            router.push('/auth/signin');
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update password: ${error.message}`);
        }
    };

    const handleCancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setNewPassword('');
    };

    const handleEditRole = () => {
        // @ts-ignore
        setNewRole(session?.user?.role || userData?.role || 'user');
        setIsEditingRole(true);
    };

    const handleSaveRole = async () => {
        try {
            const response = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update role');
            }

            setUserData({ ...userData, role: newRole });
            alert('Account type updated successfully! Changes will take effect on next login.');
            setIsEditingRole(false);
            router.refresh();
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update role: ${error.message}`);
        }
    };

    const handleCancelRoleEdit = () => {
        setIsEditingRole(false);
        setNewRole('');
    };

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'seller': return 'Seller';
            case 'user': return 'Customer';
            default: return 'Customer';
        }
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

                    {/* Email - Editable */}
                    <div className="p-4 border-b border-[#D5D9D9] bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-bold text-sm mb-2">Email</div>
                                {isEditingEmail ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="border border-gray-400 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:ring-2 focus:ring-[#e77600] outline-none"
                                            placeholder="your@email.com"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm">{session?.user?.email || 'Not set'}</div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {isEditingEmail ? (
                                    <>
                                        <button
                                            onClick={handleSaveEmail}
                                            className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEmailEdit}
                                            className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditEmail}
                                        className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
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

                    {/* Password - Editable */}
                    <div className="p-4 bg-white hover:bg-gray-50 transition-colors rounded-b-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-bold text-sm mb-2">Password</div>
                                {isEditingPassword ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="border border-gray-400 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:ring-2 focus:ring-[#e77600] outline-none"
                                            placeholder="Enter new password (min 6 characters)"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm">••••••••</div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {isEditingPassword ? (
                                    <>
                                        <button
                                            onClick={handleSavePassword}
                                            className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelPasswordEdit}
                                            className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditPassword}
                                        className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Type/Role - Editable */}
                    <div className="p-4 bg-white hover:bg-gray-50 transition-colors rounded-b-lg border-t border-[#D5D9D9]">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-bold text-sm mb-2">Account Type</div>
                                {isEditingRole ? (
                                    <div className="flex gap-2 items-center">
                                        <select
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="border border-gray-400 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:ring-2 focus:ring-[#e77600] outline-none"
                                            autoFocus
                                        >
                                            <option value="user">Customer</option>
                                            <option value="seller">Seller</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="text-sm">
                                        {/* @ts-ignore */}
                                        {getRoleDisplay(session?.user?.role || userData?.role || 'user')}
                                        <span className="text-xs text-muted-foreground ml-2">
                                            {/* @ts-ignore */}
                                            {(session?.user?.role === 'seller' || userData?.role === 'seller') && '(Can manage products)'}
                                            {/* @ts-ignore */}
                                            {(session?.user?.role === 'admin' || userData?.role === 'admin') && '(Full platform access)'}
                                            {/* @ts-ignore */}
                                            {(session?.user?.role === 'user' || userData?.role === 'user' || (!session?.user?.role && !userData?.role)) && '(Shopping account)'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {isEditingRole ? (
                                    <>
                                        <button
                                            onClick={handleSaveRole}
                                            className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-[#F7CA00]"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelRoleEdit}
                                            className="border border-[#D5D9D9] bg-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditRole}
                                        className="border border-[#D5D9D9] bg-[#fff] hover:bg-[#F7FAFA] px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
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
