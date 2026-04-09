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
  const [data, setData] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/vendor/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsInitialLoading(false);
      }
    }
    if (session) {
      fetchData();
    } else if (!isLoading) {
      setIsInitialLoading(false);
    }
  }, [session, isLoading]);

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
        <div className="h-20 w-20 bg-zinc-950 border-4 border-zinc-950 flex items-center justify-center mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase tracking-tighter">Access Terminal Restricted</h2>
        <p className="text-zinc-500 text-center max-w-sm font-bold uppercase tracking-widest text-xs">Verify your digital identity to proceed into the VMS_OS enterprise gateway.</p>
        <Button asChild className="rounded-none border-2 border-zinc-950 px-10 h-14 font-black text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow]">
          <Link href="/login">Initialize Verification</Link>
        </Button>
      </div>
    );
  }

  const vendorStatus = data?.vendor?.status || 'PENDING';
  const verifiedDocs = data?.documents?.filter((d: any) => d.status === 'APPROVED').length || 0;
  const totalDocs = data?.documents?.length || 0;

  return (
    <div className="space-y-12 pb-24 p-8">
      {/* SaaS Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-4 border-zinc-950">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-zinc-950 text-zinc-950 rounded-none uppercase font-bold text-[10px] tracking-widest bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Status: {vendorStatus.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-zinc-950 uppercase">
            Ops. Dashboard
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            System Node: <span className="text-zinc-950">{session.user?.name || session.user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="rounded-none border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs h-12">
                <Link href="/vendor/profile">ID Config</Link>
            </Button>
            <Button asChild className="rounded-none border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs h-12">
                <Link href="/vendor/proposals">RFP Directory</Link>
            </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { icon: FileText, label: 'Compliance Docs', value: `${verifiedDocs}/${totalDocs}`, color: 'zinc' },
          { icon: Briefcase, label: 'Active Opportunities', value: data?.proposalStats?.openProposals || '0', color: 'zinc' },
          { icon: CheckCircle, label: 'System Compliance', value: vendorStatus === 'APPROVED' ? 'PASS' : 'PENDING', color: 'zinc' },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-none border-2 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white transition-[transform,box-shadow] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`h-16 w-16 border-2 border-zinc-950 rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] bg-zinc-50`}>
                <stat.icon className={`h-8 w-8 text-zinc-950`} />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-heading font-black text-zinc-950 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action SaaS Hub */}
      <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-none border-2 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <div className="p-8 border-b-2 border-zinc-950 bg-zinc-50 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-zinc-950">Compliance Gateway</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Required documentation for system eligibility.</p>
                </div>
                <div className="h-12 w-12 border-2 border-zinc-950 rounded-none flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Upload className="h-6 w-6 text-zinc-950" />
                </div>
            </div>
            <CardContent className="p-10 text-center space-y-8">
                <div className="h-24 w-24 border-2 border-zinc-950 flex items-center justify-center mx-auto bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    <FileText className={`h-10 w-10 ${totalDocs > 0 ? 'text-zinc-950' : 'text-zinc-300'}`} />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-heading font-black text-zinc-950 uppercase">
                        {totalDocs > 0 ? 'Protocol active' : 'System Idle'}
                    </p>
                    <p className="text-zinc-500 text-[10px] font-bold max-w-xs mx-auto uppercase tracking-[0.2em]">
                        {totalDocs > 0 
                          ? `${verifiedDocs} of ${totalDocs} documents verified by principal admin.` 
                          : 'Your enterprise profile is currently awaiting compliance document injection.'}
                    </p>
                </div>
                <Button asChild className="rounded-none w-full h-14 border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-[transform,box-shadow]">
                   <Link href="/vendor/documents">
                    {totalDocs > 0 ? 'MANAGE COMPLIANCE DOCS' : 'INITIATE COMPLIANCE FLOW'}
                   </Link>
                </Button>
            </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
             <div className="p-8 border-b-2 border-zinc-950 bg-zinc-50 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-zinc-950">Market Opportunities</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active procurement opportunities in the directory.</p>
                </div>
                <div className="h-12 w-12 border-2 border-zinc-950 rounded-none flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Search className="h-6 w-6 text-zinc-950" />
                </div>
            </div>
            <CardContent className="p-8 space-y-6">
                 {/* This could be fetched as real RFPs if needed, keeping simple for now */}
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-6 p-6 border-2 border-zinc-950 rounded-none bg-white hover:bg-zinc-50 transition-[background-color,box-shadow] cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                        <div className="h-10 w-10 border-2 border-zinc-950 rounded-none flex items-center justify-center bg-zinc-50">
                             <Briefcase className="h-5 w-5 text-zinc-950" />
                        </div>
                        <div className="flex-1 space-y-1">
                             <div className="flex items-center justify-between">
                                <p className="font-black uppercase tracking-tight text-xs text-zinc-950">Acquisition Profile v.{i}</p>
                                <Badge variant="outline" className="border-zinc-950 text-zinc-950 text-[8px] font-black uppercase rounded-none bg-white">Active</Badge>
                             </div>
                             <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Procurement Node • Closing T-48H</p>
                        </div>
                    </div>
                 ))}
                 <Button asChild variant="ghost" className="w-full font-black text-zinc-500 uppercase tracking-[0.3em] text-[10px] hover:text-zinc-950 hover:bg-transparent">
                     <Link href="/vendor/proposals">ACCESS FULL DIRECTORY</Link>
                 </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
