'use client';

import React from 'react'
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { clearAuth } from '@/store/authStorage';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Header() {

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [search, setSearch] = useState('');

    const { user, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );
    const dispatch = useAppDispatch();
    const router = useRouter();



    const handleLogout = () => {
        dispatch(logout());
        clearAuth();
        router.push('/');
    };

    return (
        <>
            <header className='bg-white border-b border-gray-200 sticky top-0 z-40'>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='flex items-center gap-3 py-3'>
                        <Link href="/" className='flex-shrink-0 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors'>
                            Sellora
                        </Link>

                        {/* <button
                            type="button"
                            className="hidden sm:flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-colors flex-shrink-0 min-h-[44px]"
                            aria-label="Select location"
                        >
                            Location pin icon
                            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="max-w-[100px] truncate">
                                {selectedCity ? selectedCity.name : 'Select City'}
                                Select City
                            </span>
                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button> */}


                        <div className='relative flex-1'>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    const query = search.trim();

                                    if (!query) {
                                        router.push('/');
                                        return;
                                    }

                                    router.push(`/?search=${encodeURIComponent(query)}`);
                                }}
                                className='flex items-center border border-gray-300 rounded-md
                             overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-transparent'>
                                <input placeholder='Find Cars, Mobile Phones and more...'
                                    className='flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none
                                 bg-white' type='text' value={search} onChange={(e) => setSearch(e.target.value)} />
                                {/* <button type="submit" aria-label="Submit search" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors focus:outline-none min-h-[44px]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                                        </path>
                                    </svg>
                                </button> */}
                                <button
                                    type="submit"
                                    aria-label="Submit search"
                                    className=" bg-blue-600 px-4 py-2 text-center
                                     text-white hover:bg-blue-700" style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        <div className='hidden md:flex items-center gap-3 flex-shrink-0'>
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span>
                                            Hi, {user?.name}
                                        </span>

                                        <span className="text-sm">
                                            {showProfileMenu ? '▲' : '▼'}
                                        </span>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

                                            <Link
                                                href="/profile"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block px-4 py-3 hover:bg-gray-100"
                                            >
                                                My Profile
                                            </Link>

                                            <Link
                                                href="/profile"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block px-4 py-3 hover:bg-gray-100"
                                            >
                                                My Ads
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    handleLogout();
                                                }}
                                                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                                            >
                                                Logout
                                            </button>

                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button className='cursor-pointer bg-gray-400 px-4 py-2 text-center text-white
                                 hover:bg-gray-500' style={{ borderRadius: '8px' }} onClick={() => setShowAuthModal(true)}>
                                    Login / Register
                                </button>
                            )}
                            <Link href='/post-ad' className=' bg-blue-600 px-4 py-2 text-center
                                     text-white hover:bg-blue-700' style={{ borderRadius: '7px' }}> + Post Free Ad </Link>
                        </div>

                    </div>
                </div>
            </header>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    )
}


export default Header