'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-500">
            <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center shadow-lg">
                <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground">Subsystem Failure</h2>
                <p className="text-muted-foreground max-w-md font-medium">
                    An unexpected interruption occurred within the Admin Portal. The error has been logged for investigative review.
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="h-12 px-8 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Attempt Recovery
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/admin'}
                    className="h-12 px-8 font-bold rounded-xl border-2 hover:bg-muted/50 transition-all"
                >
                    Return to Nexus
                </Button>
            </div>
        </div>
    );
}
