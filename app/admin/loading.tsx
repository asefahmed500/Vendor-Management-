import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 rounded-lg" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-10 w-10 rounded-2xl" />
                                <Skeleton className="h-4 w-12 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-3 w-32 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-12">
                <Card className="lg:col-span-8 border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white h-[500px]">
                    <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                        <Skeleton className="h-6 w-48 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-xl" />
                    </div>
                    <CardContent className="p-8">
                        <Skeleton className="h-full w-full rounded-2xl" />
                    </CardContent>
                </Card>
                
                <Card className="lg:col-span-4 border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white h-[500px]">
                    <div className="p-8 border-b border-zinc-50">
                        <Skeleton className="h-6 w-32 rounded-lg" />
                    </div>
                    <CardContent className="p-8 space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-3 w-2/3 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
