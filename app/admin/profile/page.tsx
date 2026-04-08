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

      <Card className="max-w-2xl border-border">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Your basic account information configured via your provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-sm text-zinc-500">Full Name</p>
              <p className="font-medium mt-1">{user?.name || 'VMS Administrator'}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Email Address</p>
              <p className="font-medium mt-1">{user?.email || 'admin@vms-system.com'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-zinc-500">System Role</p>
              <Badge className="mt-2" variant="default">Global Admin</Badge>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Account Status</p>
              <Badge className="mt-2" variant="success">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
