'use client';

import { useState } from 'react';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from '@/store/profileApi';
import { getAuth, saveAuth } from '@/store/authStorage';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';
import { useGetMyAdsQuery } from '@/store/adApi';
import AdCard from '@/components/AdCard';
import Link from 'next/link';


export default function ProfilePage() {

    const { data: profile, isLoading, isError } = useGetProfileQuery();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [updateProfile, { isLoading: isUpdating }] =
        useUpdateProfileMutation();

    const dispatch = useAppDispatch();

    const {
        data: myAds,
        isLoading: myAdsLoading,
        isError: myAdsError,
    } = useGetMyAdsQuery({
        page: 1,
        limit: 20,
    });


    if (isLoading) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-8">
                <p>Loading profile...</p>
            </main>
        );
    }

    if (isError || !profile) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-8">
                <p className="text-red-500">
                    Failed to load profile.
                </p>
            </main>
        );
    }

    const handleEdit = () => {
        setForm({
            name: profile.name,
            email: profile.email || '',
            phone: profile.phone || '',
        });

        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await updateProfile(form).unwrap();

            // Update Redux
            dispatch(
                updateUser({
                    id: updatedProfile.id,
                    name: updatedProfile.name,
                    email: updatedProfile.email,
                    phone: updatedProfile.phone,
                })
            );

            // Update localStorage
            const currentAuth = getAuth();

            if (currentAuth) {
                saveAuth({
                    ...currentAuth,
                    user: {
                        ...currentAuth.user,
                        id: updatedProfile.id,
                        name: updatedProfile.name,
                        email: updatedProfile.email,
                        phone: updatedProfile.phone,
                    },
                });
            }


            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="border rounded-lg p-6 bg-white w-full flex-shrink-0 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-3xl text-gray-500">
                            👤
                        </span>
                    </div>

                    {/* User Info */}
                    {!isEditing ? (
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">
                                {profile.name}
                            </h1>

                            <p className="text-gray-600 mt-2">
                                {profile.email || 'No email added'}
                            </p>

                            <p className="text-gray-600">
                                {profile.phone || 'No phone added'}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Member since{' '}
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-3">

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Name"
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Phone"
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                    className="bg-black text-white rounded-lg px-5 py-2 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Save'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="border rounded-lg px-5 py-2"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    )}

                    {/* Edit Button */}
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="border rounded-lg px-5 py-2 hover:bg-gray-100"
                    >
                        Edit Profile
                    </button>

                </div>
            </div>

            {/* My Ads */}
            <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                        My Ads
                    </h2>

                    <Link href='/post-ad'
                        type="button"
                        className="bg-black text-white rounded-lg px-5 py-2 hover:bg-gray-800"
                    >
                        Post New Ad
                    </Link>
                </div>

                {myAdsLoading && (
                    <div className="border rounded-lg p-10 text-center">
                        <p className="text-gray-500">
                            Loading your ads...
                        </p>
                    </div>
                )}

                {myAdsError && (
                    <div className="border rounded-lg p-10 text-center">
                        <p className="text-red-500">
                            Failed to load your ads.
                        </p>
                    </div>
                )}

                {!myAdsLoading &&
                    !myAdsError &&
                    myAds?.data.length === 0 && (
                        <div className="border rounded-lg p-10 text-center">
                            <p className="text-gray-500">
                                You haven't posted any ads yet.
                            </p>
                        </div>
                    )}

                {!myAdsLoading &&
                    !myAdsError &&
                    myAds &&
                    myAds.data.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {myAds.data.map((ad) => (
                                <div key={ad.id}>
                                    <AdCard ad={ad} />

                                    <Link
                                        href={`/edit-ad/${ad.id}`}
                                        className="mt-2 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                                    >
                                        Edit Ad
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
            </section>

        </main>
    );
}