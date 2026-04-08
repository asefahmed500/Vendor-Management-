'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Upload, 
  Search, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { data: session, isPending: isLoading } = useSession();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate real SaaS loading experience
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6 bg-background">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-sm font-medium">Please authenticate through our secure enterprise gateway to access the vendor portal.</p>
        <Button asChild className="rounded-xl px-10 h-14 font-black text-lg shadow-xl shadow-primary/20">
          <Link href="/login">Verify Identity</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SaaS Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b-2 border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational Status: Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground italic uppercase">
            Portal Control Center
          </h1>
          <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
            Session: <span className="text-foreground font-bold">{session.user?.name || session.user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="rounded-2xl h-14 px-8 font-black border-2 shadow-sm">
                <Link href="/vendor/profile">Enterprise Profile</Link>
            </Button>
            <Button asChild className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20 bg-primary text-primary-foreground">
                <Link href="/vendor/proposals">Active RFP List</Link>
            </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { icon: FileText, label: 'Verified Docs', value: '0', color: 'blue' },
          { icon: Briefcase, label: 'Active Bids', value: '0', color: 'emerald' },
          { icon: CheckCircle, label: 'Portal Rank', value: 'N/A', color: 'purple' },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[2.5rem] border-2 border-border/50 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden bg-card/40 backdrop-blur-sm">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`h-16 w-16 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center border-2 border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-foreground tracking-tighter italic">{stat.value}</p>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action SaaS Hub */}
      <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-[3rem] border-2 border-border/50 shadow-2xl overflow-hidden bg-card/60 backdrop-blur-xl group">
            <div className="p-10 border-b-2 border-border/30 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Pending Compliance</h2>
                    <p className="text-sm font-medium text-muted-foreground">Required documentation for system eligibility.</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                    <Upload className="h-6 w-6" />
                </div>
            </div>
            <CardContent className="p-10 text-center space-y-6">
                <div className="h-32 w-32 bg-muted/30 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-muted relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                    <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <p className="text-lg font-bold">No High-Priority Tasks</p>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">Your enterprise profile is currently undergoing a secondary compliance audit.</p>
                </div>
                <Button className="rounded-2xl h-14 w-full font-black text-base shadow-lg shadow-primary/20 group">
                   CONTINUE VERIFICATION
                   <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
            </CardContent>
        </Card>

        <Card className="rounded-[3rem] border-2 border-border/50 shadow-2xl overflow-hidden bg-card/60 backdrop-blur-xl">
             <div className="p-10 border-b-2 border-border/30 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Opportunity Stream</h2>
                    <p className="text-sm font-medium text-muted-foreground">Recommended RFPs based on your profile.</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <Search className="h-6 w-6" />
                </div>
            </div>
            <CardContent className="p-10 space-y-6">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-6 p-5 rounded-2xl bg-muted/40 border-2 border-transparent hover:border-primary/20 hover:bg-muted transition-all cursor-pointer group">
                        <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                             <Briefcase className="h-6 w-6 text-primary/60" />
                        </div>
                        <div className="flex-1 space-y-1">
                             <div className="flex items-center justify-between">
                                <p className="font-black uppercase tracking-tight text-sm">Strategic Supply Framework v.0{i}</p>
                                <Badge variant="outline" className="text-[10px] font-black uppercase">Open</Badge>
                             </div>
                             <p className="text-xs text-muted-foreground font-medium">Global Logistics Division • Closes in 4 days</p>
                        </div>
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground">
                     VIEW ALL OPPORTUNITIES
                 </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
