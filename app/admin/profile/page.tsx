'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth/auth-client';

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Administrator Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            View your system administrator credentials and access levels
          </p>
        </div>
      </div>

      <Card className="max-w-2xl border-zinc-200 bg-white shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="font-heading tracking-wide uppercase text-xl">Personal Details</CardTitle>
          <CardDescription className="font-sans text-base">Your basic account information configured via your provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-6 border-b border-zinc-100 pb-6">
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-zinc-500">Full Name</p>
              <p className="font-sans text-lg font-medium text-zinc-950 mt-1">{user?.name || 'VMS Administrator'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-zinc-500">Email Address</p>
              <p className="font-sans text-lg font-medium text-zinc-950 mt-1">{user?.email || 'admin@vms-system.com'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-zinc-500">System Role</p>
              <Badge className="mt-2 font-sans font-medium px-3 py-1 shadow-sm" variant="default">Global Admin</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-zinc-500">Account Status</p>
              <Badge className="mt-2 font-sans font-medium px-3 py-1 bg-emerald-100 text-emerald-800 shadow-sm hover:bg-emerald-200 border-emerald-200" variant="outline">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
