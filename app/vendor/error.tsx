'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, LayoutDashboard, HelpCircle } from 'lucide-react';
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
        <div className="flex items-center justify-center min-h-[70vh] px-6 animate-in fade-in zoom-in duration-700">
            <Card className="max-w-xl w-full border-zinc-200/50 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-12 text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="h-20 w-20 rounded-3xl bg-zinc-950 text-white flex items-center justify-center shadow-xl relative z-10">
                            <AlertCircle className="h-10 w-10" />
                        </div>
                        <div className="absolute -inset-3 bg-zinc-100 rounded-[2rem] -z-0 blur-sm opacity-50" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-heading text-zinc-950">Interface Error</h2>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-md mx-auto">
                            We've encountered a technical difficulty while loading your partner interface. The system has been notified.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            onClick={() => reset()}
                            className="h-14 px-8 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all duration-300 shadow-xl shadow-zinc-200"
                        >
                            <RefreshCcw className="mr-2 h-5 w-5" />
                            Restart Session
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/vendor/dashboard'}
                            className="h-14 px-8 rounded-2xl border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300"
                        >
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            Partner Portal
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center justify-center gap-2 text-zinc-400">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-widest">Support Ref: {error.digest?.slice(0, 8) || 'VND-ERR-001'}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
