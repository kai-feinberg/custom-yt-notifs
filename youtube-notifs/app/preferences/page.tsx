"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Preferences } from '@/types/preferences'; // Create this type file if it doesn't exist

interface Preferences {
    userId: string;
    channelId: string;
    searchQuery: string;
    lastChecked: Date;
}

export default function SavePreferences() {
    const queryClient = useQueryClient();
    const [preferences, setPreferences] = useState<Preferences>({
        userId: 'user123',
        channelId: 'UC12345',
        searchQuery: 'React tutorials',
        lastChecked: new Date(),
    });

    const mutation = useMutation({
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
            queryClient.invalidateQueries({ queryKey: ['preferences'] });
        },
    });

    const handleSave = () => {
        mutation.mutate(preferences);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Save Preferences</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="block">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={preferences.userId}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label htmlFor="channelId" className="block">Channel ID:</label>
                    <input
                        type="text"
                        id="channelId"
                        name="channelId"
                        value={preferences.channelId}
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
                        value={preferences.searchQuery}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    {mutation.isPending ? 'Saving...' : 'Save Preferences'}
                </button>
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-2">Error saving preferences: {mutation.error.message}</p>
            )}
            {mutation.isSuccess && (
                <p className="text-green-500 mt-2">Preferences saved successfully!</p>
            )}
        </div>
    );
}