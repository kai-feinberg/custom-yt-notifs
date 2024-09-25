"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signInWithGoogle, signOut, checkAuthState } from '@/lib/firebaseClient';
import { useUserStore } from './store';
import { ChannelSearch } from '@/components/ChannelSearch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getMessaging, onMessage } from "firebase/messaging";
interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface Preferences {
  userId: string;
  channelId: string;
  channelName: string;
  searchQuery: string;
}
const messaging = getMessaging();


export default function Home() {
  const queryClient = useQueryClient();

  const { uid, isLoggedIn, setUser, setLoggedIn } = useUserStore();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({ userId: uid || '', channelId: '', searchQuery: '', channelName: '' });

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      setPreferences(prev => ({ ...prev, channelId: selectedChannel.id, channelName: selectedChannel.title }));
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (isLoggedIn) {
      setPreferences(prev => ({ ...prev, userId: uid }));
    }
  }, [isLoggedIn]);

  const handleSignIn = async () => {
    const response = await signInWithGoogle();
    if (response) {
      console.log('User signed in successfully');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const mutatePreferences = useMutation({
    mutationFn: async (prefs: Preferences) => {
      const response = await fetch('/api/savePreferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prefs),
      });
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences', uid] });
      setPreferences({ userId: '', channelId: '', searchQuery: '', channelName: '' });
    },
  });

  const { data: storedPreferences, isLoading, error } = useQuery({
    queryKey: ['preferences', uid],
    queryFn: async () => {
      if (!uid) throw new Error('User not logged in');
      const response = await fetch(`/api/getPreferences?userId=${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
    },
    enabled: !!uid && isLoggedIn,
  });

  const deletePreference = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/deletePreference?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete preference');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences', uid] });
    },
  });

  const handleSubmitNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (preferences) {
      mutatePreferences.mutate(preferences);
    }
  };

  const triggerCronJob = async () => {
    const response = await fetch('/api/cronTrigger', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to trigger cron job');
    }
    console.log('Cron job triggered successfully');
    console.log('Next message for debugging:', await response.json());
  };

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground: ', payload);
    // You can display a custom notification here if desired.
  });

  const sendTestNotification = async () => {
    if (!uid) {
      console.error('User not logged in');
      return;
    }
    try {
      // Add a 5 second delay before calling the API
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Fetch the FCM token
      const response = await fetch(`/api/getFCMToken?userId=${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch FCM token');
      }
      const { fcmToken } = await response.json();
      console.log('FCM token:', fcmToken);

      // Send a test notification
      const notificationResponse = await fetch('/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken,
          title: 'Test Notification',
          body: 'This is a test notification from YouTube Notifier!',
        }),
      });

      if (!notificationResponse.ok) {
        throw new Error('Failed to send test notification');
      }

      console.log('Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
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
            <button onClick={triggerCronJob} className="bg-green-500 text-white px-4 py-2 rounded">
              Trigger Cron Job
            </button>
            <button onClick={sendTestNotification} className="bg-green-500 text-white px-4 py-2 rounded">
              Send Test Notification
            </button>
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
              value={preferences.searchQuery}
              onChange={(e: any) => setPreferences(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Dream SNP"
            />
          </div>
          {mutatePreferences.isLoading ? (
            <div>Loading...</div>
          ) : (
            <button onClick={handleSubmitNew} className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          )}
        </CardContent>
      </Card>



      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center">Current Preferences</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {(error as Error).message}</p>}
          {storedPreferences && storedPreferences.data && (
            <div>
              {storedPreferences.data.map((preference: { id: string;[key: string]: any }) => (
                <div key={preference.id} className="flex items-center justify-between border-b py-4">
                  <div>
                    <h2>{preference.channelName}</h2>
                    <p>Videos containing the word {preference.searchQuery}</p>
                  </div>
                  <button onClick={() => deletePreference.mutate(preference.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </main>
  );
}
