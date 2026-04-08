'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VendorSettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Vendor</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal notification preferences and security
          </p>
        </div>
      </div>

      <Card className="max-w-2xl border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive updates on RFPs and verifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-zinc-600 dark:text-zinc-400">
             All Proposal and Document validation alerts are automatically pushed to your bell icon at this time. Configuration controls will be available in V2.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
