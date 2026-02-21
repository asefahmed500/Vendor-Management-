'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Vendor Dashboard Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-500">
            <div className="h-20 w-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-lg">
                <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground">Operational Interrupt</h2>
                <p className="text-muted-foreground max-w-md font-medium">
                    We've encountered a disruption in the partner workspace. Our technical team has been notified of the instance.
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-bold rounded-xl shadow-md transition-all"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry Connection
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/vendor/dashboard'}
                    className="h-12 px-8 font-bold rounded-xl border-2 hover:bg-muted/50 transition-all"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Portal Home
                </Button>
            </div>
        </div>
    );
}
