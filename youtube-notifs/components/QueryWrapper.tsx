// /components/QueryWrapper.tsx
'use client'; // Marking this as a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryWrapper({ children }: { children: React.ReactNode }) {
    // Create a new QueryClient for managing state and caching
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
