import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Vendor Header Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full bg-blue-500/20" />
                    <Skeleton className="h-3 w-40" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-72 rounded-xl" />
                    <Skeleton className="h-4 w-[500px] rounded-lg" />
                </div>
            </div>

            {/* Quick Actions / Stats */}
            <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-32 rounded-lg" />
                                <Skeleton className="h-3 w-48 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Operational View Skeleton */}
            <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white h-[600px]">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-56 rounded-lg" />
                        <Skeleton className="h-3 w-40 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-6 p-4 rounded-3xl border border-zinc-50">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-1/3 rounded-lg" />
                                    <Skeleton className="h-3 w-1/4 rounded-md" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
