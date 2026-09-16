'use client';

import { useState } from 'react';
import {
    useCheckIdentifierMutation,
    useRegisterMutation,
    useLoginMutation
} from '@/store/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/authSlice';
import { saveAuth } from '@/store/authStorage';

interface AuthModalProps {
    onClose: () => void;
}

export default function AuthModal({
    onClose,
}: AuthModalProps) {

    const [identifier, setIdentifier] = useState('');
    const [step, setStep] = useState<'identifier' | 'login' | 'register'>(
        'identifier'
    );
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [register, { isLoading: isRegistering }] =
        useRegisterMutation();

    const [checkIdentifier, { isLoading }] =
        useCheckIdentifierMutation();
    const [login, { isLoading: isLoggingIn }] =
        useLoginMutation();

    const dispatch = useAppDispatch();

    const handleContinue = async () => {
        if (!identifier.trim()) return;

        try {
            const result = await checkIdentifier({
                identifier: identifier.trim(),
            }).unwrap();

            if (result.exists) {
                setStep('login');
            } else {
                setStep('register');
            }
        } catch (error) {
            console.error('Check identifier failed:', error);
        }
    };

    const handleRegister = async () => {
        if (!fullName.trim() || !password) return;

        try {
            await register({
                name: fullName.trim(),
                identifier: identifier.trim(),
                password,
            }).unwrap();

            alert('Account created successfully');

            onClose();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleLogin = async () => {
        if (!password) return;

        try {
            const result = await login({
                identifier: identifier.trim(),
                password,
            }).unwrap();

            const authData = {
                user: result.user,
                accessToken: result.accessToken,
            };

            dispatch(setCredentials(authData));
            saveAuth(authData);

            onClose();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {step === 'identifier' && (
                    <>
                        <input
                            type="text"
                            placeholder="Email or Phone Number"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="border rounded w-full p-2 mt-6"
                        />

                        <button
                            onClick={handleContinue}
                            disabled={isLoading || !identifier.trim()}
                            className="cursor-pointer bg-black text-white rounded w-full p-2 mt-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Checking...' : 'Continue'}
                        </button>
                    </>
                )}

                {step === 'login' && (
                    <>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full p-2 mt-6"
                        />

                        <button
                            onClick={handleLogin}
                            disabled={isLoggingIn || !password}
                            className="bg-black text-white rounded w-full p-2 mt-4 disabled:opacity-50"
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </>
                )}

                {step === 'register' && (
                    <>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="border rounded w-full p-2 mt-6"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full p-2 mt-2"
                        />

                        <button
                            onClick={handleRegister}
                            disabled={
                                isRegistering ||
                                !fullName.trim() ||
                                !password
                            }
                            className="bg-black text-white rounded w-full p-2 mt-4 disabled:opacity-50"
                        >
                            {isRegistering ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </>
                )}
                {/* <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        Login / Register
                    </h2>

                    <button onClick={onClose}>✕</button>
                </div>

                <input
                    type="text"
                    placeholder="Email or Phone Number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="border rounded w-full p-2 mt-6"
                />

                <button
                    onClick={handleContinue}
                    disabled={isLoading || !identifier.trim()}
                    className="bg-black text-white rounded w-full p-2 mt-4 disabled:opacity-50"
                >
                    {isLoading ? 'Checking...' : 'Continue'}
                </button> */}
            </div>
        </div>
    );
}