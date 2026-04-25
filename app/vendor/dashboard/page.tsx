'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Upload, 
  Search, 
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Plus,
  Zap,
  Activity,
  ArrowRight,
  Shield,
  FileCheck,
  Globe
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
      <div className="max-w-7xl mx-auto p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-12 animate-fade-in">
        <div className="h-24 w-24 rounded-[2rem] bg-zinc-50 flex items-center justify-center mb-8 border border-zinc-100 shadow-sm">
           <Shield className="h-10 w-10 text-zinc-300" />
        </div>
        <h2 className="text-3xl font-bold mb-3 font-heading text-zinc-950">Access Restricted</h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm mb-10 leading-relaxed font-medium">Please authenticate your vendor account to access the partner portal.</p>
        <Button asChild className="h-14 px-10 rounded-2xl font-bold bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
          <Link href="/login">Verify Identity</Link>
        </Button>
      </div>
    );
  }

  const vendorStatus = data?.vendor?.status || 'PENDING';
  const verifiedDocs = data?.documents?.filter((d: any) => d.status === 'APPROVED').length || 0;
  const totalDocs = data?.documents?.length || 0;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-zinc-100">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
             <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-950 border-none text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
               Partner Network
             </Badge>
             <Badge variant="outline" className={`px-4 py-1.5 rounded-full border-zinc-200 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/50 backdrop-blur-sm ${vendorStatus === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
               Status: {vendorStatus.replace('_', ' ')}
             </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-[1.1] text-zinc-950">
            Welcome, <br /> {session.user?.name?.split(' ')[0] || 'Partner'}
          </h1>
          <p className="text-muted-foreground text-lg mt-6 font-medium max-w-2xl leading-relaxed">
            Monitor your compliance status, explore new procurement opportunities, and manage your vendor profile from the central partner hub.
          </p>
        </div>
        
        <div className="flex items-center gap-4 animate-fade-up delay-100">
          <Button variant="outline" size="lg" asChild className="rounded-2xl border-zinc-200 h-14 px-8 font-bold hover:bg-zinc-50 transition-all text-sm group">
            <Link href="/vendor/profile" className="flex items-center">
              <Plus className="h-4 w-4 mr-3 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              Update Profile
            </Link>
          </Button>
          <Button size="lg" asChild className="rounded-2xl h-14 px-10 font-bold bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-200 transition-all hover:-translate-y-1 active:translate-y-0 text-sm">
            <Link href="/vendor/proposals">
              Explore RFPs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: FileCheck, label: 'Compliance Index', value: `${verifiedDocs}/${totalDocs}`, color: 'text-zinc-600', desc: 'Verified documents' },
          { icon: Briefcase, label: 'Active Streams', value: data?.proposalStats?.openProposals || '0', color: 'text-emerald-600', desc: 'Live opportunities' },
          { icon: ShieldCheck, label: 'System Trust', value: vendorStatus === 'APPROVED' ? 'Verified' : 'Pending', color: 'text-zinc-950', desc: 'Authority status' },
        ].map((stat, i) => (
          <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <Card className="border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 group rounded-[2rem] bg-white border">
              <CardContent className="p-8 flex items-center gap-8">
                <div className={`h-20 w-20 rounded-[1.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="space-y-1.5">
                  <div className="text-3xl font-bold font-heading text-zinc-950 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
                  <p className="text-[10px] text-zinc-400 font-medium">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Action Hub */}
      <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-12 pt-4">
        {/* Compliance Section */}
        <div className="lg:col-span-7 space-y-12">
          <Card className="border-border/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-up delay-400 rounded-[2.5rem] bg-white">
            <CardHeader className="p-10 border-b border-zinc-50 bg-zinc-50/20 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                    <CardTitle className="text-2xl font-bold font-heading text-zinc-950">Compliance Gateway</CardTitle>
                    <CardDescription className="font-medium text-sm text-zinc-500">Security documentation and verification status</CardDescription>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-zinc-950" />
                </div>
            </CardHeader>
            <CardContent className="p-12 text-center space-y-10">
                <div className="relative inline-block">
                  <div className="h-32 w-32 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto shadow-sm">
                      <FileText className={`h-12 w-12 ${totalDocs > 0 ? 'text-zinc-950' : 'text-zinc-300'}`} />
                  </div>
                  {totalDocs > 0 && verifiedDocs === totalDocs && (
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 max-w-sm mx-auto">
                    <h3 className="text-2xl font-bold font-heading text-zinc-950">
                        {totalDocs > 0 ? 'System Compliance' : 'Documentation Required'}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        {totalDocs > 0 
                          ? `You have successfully logged ${verifiedDocs} of ${totalDocs} required security protocols.` 
                          : 'Your account is currently limited. Please upload the required compliance documentation to unlock all features.'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="rounded-2xl h-14 font-bold border-zinc-200 text-zinc-950 hover:bg-zinc-50 transition-all">
                    <Link href="/vendor/documents">View Records</Link>
                  </Button>
                  <Button asChild className="rounded-2xl h-14 bg-zinc-950 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all font-bold">
                    <Link href="/vendor/documents">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </Link>
                  </Button>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities Sidebar */}
        <div className="lg:col-span-5 space-y-12">
          <Card className="border-border/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden rounded-[2.5rem] bg-white border animate-fade-up delay-500">
             <CardHeader className="p-10 border-b border-zinc-50 bg-zinc-50/20 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                    <CardTitle className="text-xl font-bold font-heading text-zinc-950">Market Hub</CardTitle>
                    <CardDescription className="font-medium text-[10px] text-zinc-400 uppercase tracking-widest">Active Procurement</CardDescription>
                </div>
                <Globe className="h-5 w-5 text-zinc-300" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white hover:bg-zinc-50/50 transition-all border border-zinc-50 hover:border-zinc-100 group cursor-pointer">
                        <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-zinc-950 group-hover:shadow-xl group-hover:shadow-zinc-100 transition-all border border-zinc-100/50">
                             <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                             <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors">Infrastructure Project {i}</p>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-bold uppercase rounded-full px-2 py-0.5">Live</Badge>
                             </div>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Security Cluster • Closes in 2d</p>
                        </div>
                    </div>
                 ))}
                 <div className="pt-4">
                  <Button asChild variant="ghost" className="w-full h-12 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 font-bold uppercase tracking-[0.2em] text-[10px] group transition-all">
                      <Link href="/vendor/proposals" className="flex items-center justify-center">
                        View All Opportunities <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </Button>
                 </div>
            </CardContent>
          </Card>

          {/* Support / Quick Help */}
          <Card className="bg-zinc-950 text-white border-none shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden rounded-[2.5rem] group relative animate-fade-in delay-700">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Zap className="h-32 w-32 -rotate-12" />
            </div>
            <CardContent className="p-10 relative z-10">
              <h3 className="text-2xl font-bold mb-4 font-heading tracking-tight">Need Assistance?</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-medium">
                Our support desk is available 24/7 for technical and compliance guidance.
              </p>
              <Button asChild className="w-full h-14 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl font-bold text-sm shadow-xl transition-all">
                <Link href="mailto:support@vms.system">Contact Desk</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
  );
}
