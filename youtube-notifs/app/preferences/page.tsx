"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { requestNotificationPermission, storeFCMToken } from '@/lib/firebaseClient';

import { getMessaging, onMessage } from "firebase/messaging";

const messaging = getMessaging();

// Remove this import as we're defining the interface locally
// import { Preferences } from '@/types/preferences';

interface Preferences {
    userId: string;
    channelId: string;
    searchQuery: string;
    lastChecked: Date;
}


export default function PreferencesPage() {
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState('user123');
    const [preferences, setPreferences] = useState<Preferences>({ userId: 'user123', channelId: '', searchQuery: '', lastChecked: new Date() });

    const { data: storedPreferences, isLoading, error } = useQuery({
        queryKey: ['preferences', userId],
        queryFn: async () => {
            const response = await fetch(`/api/getPreferences?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch preferences');
            }
            return response.json();
        },
    });


    onMessage(messaging, (payload) => {
        console.log('Message received in foreground: ', payload);
        // You can display a custom notification here if desired.
    });
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
            queryClient.invalidateQueries({ queryKey: ['preferences', userId] });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (preferences) {
            mutatePreferences.mutate(preferences);
        }
    };

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
            queryClient.invalidateQueries({ queryKey: ['preferences', userId] });
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleRequestPermission = async () => {
        const token = await requestNotificationPermission();
        if (token) {
            console.log('Notification permission granted. Token:', token);
            try {
                await storeFCMToken(userId, token);
                console.log('FCM token stored successfully');
                // You can update the UI here to show that permissions were granted and token was stored
            } catch (error) {
                console.error('Failed to store FCM token:', error);
                // You can update the UI here to show that token storage failed
            }
        } else {
            console.log('Failed to get notification permission or token');
            // You can update the UI here to show that permissions were denied
        }
    };

    const sendTestNotification = async () => {
        try {
            // Add a 5 second delay before calling the API
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Fetch the FCM token
            const response = await fetch(`/api/getFCMToken?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch FCM token');
            }
            const { fcmToken } = await response.json();

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Preferences</h2>

            {!isLoading && storedPreferences.data && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Current Preferences:</h3>
                    <div>
                        {storedPreferences.data.map((preference: { id: string;[key: string]: any }) => (
                            <div>
                                <h2>id: {preference.id}</h2>
                                <p>search query: {preference.searchQuery}</p>
                                <p>userId: {preference.userId}</p>
                                <p>last checked: {preference.lastChecked}</p>
                                <button onClick={() => deletePreference.mutate(preference.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <h2> New search</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label htmlFor="channelId" className="block">Channel ID:</label>
                    <input
                        type="text"
                        id="channelId"
                        name="channelId"
                        value={preferences?.channelId}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label htmlFor="searchQuery" className="block">Search Query:</label>
                    <input
                        type="text"
                        id="searchQuery"
                        name="searchQuery"
                        value={preferences?.searchQuery}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <button
                    type="submit"
                    disabled={mutatePreferences.isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    {mutatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
                </button>
            </form>

            {mutatePreferences.isError && (
                <p className="text-red-500 mt-2">Error saving preferences: {mutatePreferences.error.message}</p>
            )}
            {mutatePreferences.isSuccess && (
                <p className="text-green-500 mt-2">Preferences saved successfully!</p>
            )}


            <button onClick={handleRequestPermission} className="bg-green-500 text-white px-4 py-2 rounded mt-4 mr-2">
                Request Notification Permission
            </button>

            <button onClick={sendTestNotification} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Send Test Notification
            </button>
        </div>
    );
}