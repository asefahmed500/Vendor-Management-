'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Something went wrong</h2>
                        <p className="text-muted-foreground">
                            An unexpected error occurred. Please try again or return to the dashboard.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => reset()}
                            className="gap-2"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/vendor/dashboard'}
                            className="gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
