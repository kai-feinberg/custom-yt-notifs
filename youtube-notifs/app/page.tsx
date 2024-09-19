"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signInWithGoogle, signOut, checkAuthState } from '@/lib/firebaseClient';
import { useUserStore } from './store';
import { ChannelSearch } from '@/components/ChannelSearch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function Home() {
  const { uid, isLoggedIn, setUser, setLoggedIn } = useUserStore();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const [searchString, setSearchString] = useState('');

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

  const handleSubmitNew = async () => {
    console.log('Submitting new preferences');
    console.log(selectedChannel);
    console.log(searchString);
  }


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
          <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign In with Google
          </button>
        )}
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">YouTube Creator Search</h2>
            <ChannelSearch
              onChannelSelect={setSelectedChannel}
              selectedChannel={selectedChannel}
            />

            <Input
              label="Search for videos containing"
              value={searchString}
              onChange={(e: any) => setSearchString(e.target.value)}
              placeholder="Dream SNP"
            />
          </div>
          <button onClick={handleSubmitNew} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </CardContent>
      </Card>



    </main>
  );
}
