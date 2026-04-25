'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, LayoutDashboard } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin Dashboard Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 text-center animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto px-6">
            <div className="relative">
                <div className="h-24 w-24 rounded-[2rem] bg-zinc-950 text-white flex items-center justify-center shadow-2xl relative z-10">
                    <AlertCircle className="h-12 w-12" />
                </div>
                <div className="absolute -inset-4 bg-zinc-100 rounded-[2.5rem] -z-0 blur-sm opacity-50" />
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-heading text-zinc-950">System Interruption</h2>
                <p className="text-zinc-500 text-lg leading-relaxed">
                    The registry encountered an unexpected error. Our system has logged the details for administrative review.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                    onClick={() => reset()}
                    className="h-14 px-10 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all duration-300 shadow-xl shadow-zinc-200"
                >
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Attempt Recovery
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/admin'}
                    className="h-14 px-10 rounded-2xl border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300"
                >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Return to Registry
                </Button>
            </div>

            <div className="pt-8 border-t border-zinc-100 w-full">
                <p className="text-zinc-400 text-xs font-mono">
                    ID: {error.digest || 'UNRECOVERABLE_CORE_FAULT'}
                </p>
            </div>
        </div>
    );
}
