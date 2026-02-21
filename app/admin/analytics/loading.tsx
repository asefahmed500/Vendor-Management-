import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-10">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-12 w-96" />
                    <Skeleton className="h-4 w-[500px]" />
                </div>
                <Skeleton className="h-12 w-48" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-none shadow-xl h-64">
                        <CardContent className="p-8 space-y-4">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-2xl h-[600px]">
                <CardHeader className="p-10 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        </div>
    );
}
