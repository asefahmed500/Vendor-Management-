'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth/auth-client';

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="space-y-12 pb-24 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-zinc-950 pb-8">
        <div>
          <Badge variant="outline" className="mb-4 border-zinc-950 text-zinc-950">Identity: Operations</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-zinc-950 uppercase">
            Chief Administrator
          </h1>
          <p className="text-zinc-600 mt-2 font-medium uppercase tracking-widest text-xs">
            Assigned: System Level Privileges
          </p>
        </div>
      </div>

      <Card className="max-w-2xl border-2 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardHeader className="border-b-2 border-zinc-950 bg-zinc-50 p-8">
          <CardTitle className="font-heading font-black tracking-tight uppercase text-2xl text-zinc-950">System Credentials</CardTitle>
          <CardDescription className="font-medium text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">Verified hardware-encrypted identity tokens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-2 border-zinc-100 pb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Personnel ID</p>
              <p className="text-xl font-heading font-black text-zinc-950 uppercase italic">{user?.name || 'VMS ADMINISTRATOR'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Network Address</p>
              <p className="text-xl font-heading font-black text-zinc-950 lowercase underline underline-offset-4 decoration-2">{user?.email || 'admin@vms.system'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Clearance Tier</p>
              <Badge className="border-2 border-zinc-950 bg-zinc-950 text-white font-black" variant="default">LVL 5: EXEC</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Authorization Status</p>
              <Badge className="border-2 border-emerald-600 bg-white text-emerald-600 font-black shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]" variant="outline">OPERATIONAL</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
