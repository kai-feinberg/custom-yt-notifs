"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

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

    const handleSave = () => {
        if (preferences) {
            mutatePreferences.mutate(preferences);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => prev ? { ...prev, [name]: value } : null);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;
    console.log(storedPreferences);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Preferences</h2>

            {!isLoading && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Current Preferences:</h3>
                    <div>
                        <p>User ID: {storedPreferences.data.userId}</p>
                        <p>Channel ID: {storedPreferences.data.channelId}</p>
                        <p>Search Query: {storedPreferences.data.searchQuery}</p>
                    </div>
                </div>
            )}

            <h2> New search</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                
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
                    onClick={handleSave}
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
        </div>
    );
}