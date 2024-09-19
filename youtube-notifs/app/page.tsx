"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { signInWithGoogle, signOut, checkAuthState } from '@/lib/firebaseClient';
import { useUserStore } from './store';
import { ChannelSearch } from '@/components/ChannelSearch';

export default function Home() {
  const { uid, isLoggedIn, setUser, setLoggedIn } = useUserStore();

  useEffect(() => {
    checkAuthState();
  }, []);

  const handleSignIn = async () => {
    const response = await signInWithGoogle();
    if (response) {
      console.log('User signed in successfully');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to YouTube Notifier</h1>
        {isLoggedIn ? (
          <>
            <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
              Sign Out
            </button>
            <Link href="/preferences" className="bg-blue-500 text-white px-4 py-2 rounded">
              Go to Preferences
            </Link>
          </>
        ) : (
          <button onClick={handleSignIn}  className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign In with Google
          </button>
        )}
      </div>
      <ChannelSearch />
    </main>
  );
}
