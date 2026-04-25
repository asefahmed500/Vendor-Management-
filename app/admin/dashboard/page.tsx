'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Users,
  CheckCircle,
  FileText,
  Search,
  XCircle,
  Briefcase,
  Trophy,
  Activity,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Plus,
  Zap,
  ArrowRight,
  Target,
  Globe,
  TrendingUp,
  Fingerprint,
  ArrowUpRight,
  Cpu,
  Database,
  Lock,
  Boxes,
  Workflow,
  ShieldAlert,
  SearchX,
  History,
  Settings2
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Separator } from '@/components/ui/separator';

const statCards = [
  { key: 'total', label: 'Entity Registry', icon: Users, color: 'zinc', trend: '+12%', trendColor: 'text-emerald-600' },
  { key: 'approvedLogin', label: 'Active Streams', icon: Fingerprint, color: 'blue', trend: '+5%', trendColor: 'text-emerald-600' },
  { key: 'documentsSubmitted', label: 'New Artifacts', icon: FileText, color: 'zinc', trend: '+24', trendColor: 'text-blue-600' },
  { key: 'underReview', label: 'Core Audits', icon: Search, color: 'amber', trend: '-2', trendColor: 'text-amber-600' },
  { key: 'approved', label: 'Compliance Yield', icon: ShieldCheck, color: 'emerald', trend: '98%', trendColor: 'text-emerald-600' },
  { key: 'rejected', label: 'Revoked Access', icon: XCircle, color: 'red', trend: '0', trendColor: 'text-zinc-400' },
];

const proposalStatCards = [
  { key: 'total', label: 'Total RFPs', icon: Briefcase, color: 'zinc' },
  { key: 'open', label: 'Active Protocols', icon: Activity, color: 'blue' },
  { key: 'closed', label: 'Registry Closed', icon: Lock, color: 'zinc' },
  { key: 'awarded', label: 'Successful Tenders', icon: Trophy, color: 'emerald' },
];

const mockData = {
  stats: {
    total: 247,
    pending: 18,
    approvedLogin: 156,
    documentsSubmitted: 42,
    underReview: 23,
    approved: 189,
    rejected: 8,
  } as Record<string, number>,
  pendingDocuments: 34,
  proposalStats: {
    total: 52,
    open: 18,
    closed: 28,
    awarded: 6,
    submissions: 156,
  } as Record<string, number>,
};

export default function AdminDashboardPage() {
  const { data: session, isPending: isLoading } = useSession();
  const [data, setData] = useState<any>(mockData);
  const [showDemo, setShowDemo] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        const json = await res.json();
        if (json.success && session) {
          setData(json.data);
          setShowDemo(false);
        }
      } catch (e) {
        setData(mockData);
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
      <div className="container mx-auto p-10 max-w-[1600px] font-body">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-12 animate-fade-in font-dm-sans">
        <div className="h-32 w-32 rounded-[3.5rem] bg-zinc-950 flex items-center justify-center mb-12 shadow-3xl shadow-zinc-950/20 group relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
           <Lock className="h-12 w-12 text-white group-hover:scale-110 transition-transform relative z-10" />
        </div>
        <h2 className="text-5xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase mb-4">Registry Locked</h2>
        <p className="text-zinc-500 max-w-sm mx-auto text-[11px] font-black uppercase tracking-[0.4em] mb-12 leading-relaxed">Administrator authentication is required to access the secure governance protocols.</p>
        <Button asChild className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-3xl shadow-zinc-950/20 text-[12px] font-black uppercase tracking-[0.25em]">
          <Link href="/login">Initialize Authentication</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 lg:p-10 font-body selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-zinc-100 pb-12">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <Badge className="bg-zinc-950 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic font-syne">Matrix_Protocol_01</Badge>
              {showDemo && (
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-zinc-200 text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] bg-white shadow-sm italic font-syne">Simulation Active</Badge>
              )}
              <span className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-black font-syne italic">Infrastructure_Telemetry</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.85] drop-shadow-sm">
              Command <br className="sm:hidden" /> Center
            </h1>
            
            <p className="text-zinc-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Real-time monitoring of <span className="text-zinc-950 font-bold">Global Procurement Infrastructure</span>. Current status: <span className="text-blue-600 font-black italic underline decoration-blue-100 underline-offset-8 font-syne tracking-tight">All Systems Nominal</span>.
            </p>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button variant="outline" size="lg" asChild className="h-20 px-10 rounded-[2.5rem] border-zinc-200 text-zinc-950 hover:bg-white hover:shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.3em] group shadow-sm bg-white/50 backdrop-blur-md">
              <Link href="/admin/audit-logs" className="flex items-center">
                <History className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                Audit Logs
              </Link>
            </Button>
            <Button size="lg" asChild className="h-20 px-10 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group">
              <Link href="/admin/vendors/create" className="flex items-center">
                <Plus className="h-5 w-5 mr-4 group-hover:rotate-90 transition-transform duration-500" />
                Enroll Entity
              </Link>
            </Button>
          </div>
        </div>

        {/* Intelligence Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={card.key} className="rounded-[2.5rem] p-8 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.02] transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-150">
                  <Icon className="w-full h-full" />
                </div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={`h-12 w-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                    card.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                    card.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-950'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`text-[9px] font-black ${card.trendColor} uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100/50`}>
                    {card.trend}
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  <h3 className="text-4xl font-syne font-black tracking-tighter uppercase text-zinc-950">
                    {data.stats[card.key] || 0}
                  </h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{card.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Operational Section */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Registration Pipeline */}
            <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20 animate-fade-up">
               <div className="p-12 border-b border-zinc-50 bg-zinc-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-950/10">
                           <Workflow className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase">Registration Pipeline</h2>
                     </div>
                     <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Corporate verification and compliance flow control</p>
                  </div>
                  <Button asChild variant="outline" className="h-14 px-8 rounded-full border-zinc-200 text-zinc-950 font-black text-[10px] uppercase tracking-widest hover:bg-white shadow-sm transition-all group bg-white/50 backdrop-blur-sm">
                    <Link href="/admin/vendors" className="flex items-center">
                      Registry <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
               </div>
               
               <CardContent className="p-12">
                  <div className="grid md:grid-cols-3 gap-16">
                    <div className="space-y-10 group">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Priority Audit</span>
                         <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
                           <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Live Queue</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-8xl font-syne font-black italic tracking-tighter text-zinc-950 leading-none group-hover:scale-110 origin-left transition-transform duration-700">{data.stats.underReview}</div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Entities Pending Review</p>
                      </div>
                      <Button asChild className="h-16 w-full rounded-[1.5rem] bg-zinc-950 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-zinc-950/20 hover:bg-zinc-800 transition-all hover:-translate-y-1">
                        <Link href="/admin/vendors?status=UNDER_REVIEW">Initialize Audit Protocol</Link>
                      </Button>
                    </div>

                    <div className="space-y-10">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Verified Nodes</span>
                      <div className="space-y-8">
                        <div className="text-8xl font-syne font-black italic tracking-tighter text-zinc-950 leading-none">{data.stats.approved}</div>
                        <div className="flex -space-x-4">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="h-14 w-14 rounded-[1.25rem] border-[4px] border-white bg-zinc-50 flex items-center justify-center overflow-hidden shadow-xl transition-all hover:scale-125 hover:z-50 hover:rotate-6 cursor-pointer group">
                               <span className="text-[10px] font-black text-zinc-300 group-hover:text-zinc-950">{String.fromCharCode(64 + i)}</span>
                            </div>
                          ))}
                          <div className="h-14 w-14 rounded-[1.25rem] border-[4px] border-white bg-zinc-950 flex items-center justify-center text-[10px] font-black text-white shadow-2xl shadow-zinc-950/20">
                            +{Math.max(0, data.stats.approved - 4)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">System Health</span>
                      <div className="space-y-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-8xl font-syne font-black italic tracking-tighter text-zinc-950 leading-none">84</span>
                          <span className="text-3xl font-black text-zinc-200 italic font-syne">%</span>
                        </div>
                        <div className="space-y-4 pt-2">
                          <div className="h-4 w-full bg-zinc-50 rounded-full p-1 border border-zinc-100 shadow-inner">
                            <div className="h-full bg-zinc-950 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.15)]" style={{ width: '84%' }} />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                            <span className="text-zinc-300 italic">Threshold: 80%</span>
                            <span className="text-emerald-500 font-black">Optimized</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>

            {/* Procurement Streams */}
            <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20 animate-fade-up delay-100">
               <div className="p-12 border-b border-zinc-50 bg-zinc-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-950/10">
                           <Boxes className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase">Procurement Streams</h2>
                     </div>
                     <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Active tenders and award lifecycle analytics</p>
                  </div>
                  <Button asChild variant="outline" className="h-14 px-8 rounded-full border-zinc-200 text-zinc-950 font-black text-[10px] uppercase tracking-widest hover:bg-white shadow-sm transition-all group bg-white/50 backdrop-blur-sm">
                    <Link href="/admin/proposals" className="flex items-center">
                      RFP Logic <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
               </div>
               
               <CardContent className="p-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {proposalStatCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.key} className="p-10 rounded-[2.5rem] bg-zinc-50/50 border border-zinc-100/50 hover:bg-white hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-700 group relative overflow-hidden">
                           <div className="flex flex-col gap-10 relative z-10">
                             <div className="flex items-center justify-between">
                                <div className={`h-12 w-12 rounded-[1.25rem] bg-white border border-zinc-100 shadow-sm flex items-center justify-center group-hover:rotate-12 transition-all duration-500 ${
                                  card.color === 'blue' ? 'text-blue-500' : 
                                  card.color === 'emerald' ? 'text-emerald-500' : 'text-zinc-400'
                                }`}>
                                   <Icon className="h-5 w-5" />
                                </div>
                                <div className="h-2 w-2 rounded-full bg-zinc-200 group-hover:bg-zinc-950 transition-colors" />
                             </div>
                             <div className="space-y-2">
                               <p className="text-5xl font-syne font-black italic tracking-tighter text-zinc-950 leading-none">{data.proposalStats[card.key] || 0}</p>
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-600 transition-colors">{card.label}</p>
                             </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Infrastructure Actions Sidebar */}
          <div className="lg:col-span-4 space-y-12 animate-fade-in delay-200">
            
            {/* Priority Protocol Card */}
            {data.pendingDocuments > 0 && (
              <Card className="bg-zinc-950 text-white border-none shadow-3xl shadow-zinc-950/40 overflow-hidden rounded-[3.5rem] group relative">
                <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none duration-1000 group-hover:scale-125">
                   <Zap className="h-80 w-80 -rotate-12" />
                </div>
                
                <CardContent className="p-12 relative z-10 flex flex-col min-h-[500px]">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-16 border border-white/10 backdrop-blur-2xl shadow-3xl">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                    Immediate Attention
                  </div>
                  
                  <div className="space-y-8 flex-1">
                    <h3 className="text-5xl md:text-6xl font-syne font-black italic tracking-tighter leading-[0.9] uppercase group-hover:translate-x-2 transition-transform duration-700">
                      {data.pendingDocuments} Security <br /> Audits Pending
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-medium max-w-xs">
                      Critical infrastructure artifacts are awaiting administrator sign-off. Compliance window expiration imminent: <span className="text-white font-black italic underline decoration-white/20 underline-offset-8">4 HOURS</span>.
                    </p>
                  </div>
                  
                  <Button asChild className="h-20 bg-white text-zinc-950 hover:bg-zinc-100 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.25em] shadow-3xl transition-all hover:-translate-y-2 active:translate-y-0 group mt-12">
                    <Link href="/admin/documents" className="flex items-center justify-center">
                      Process Pipeline
                      <ArrowUpRight className="h-5 w-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Access Matrix */}
            <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden border border-white/20 relative group">
              <div className="p-12 border-b border-zinc-50 bg-zinc-50/20">
                <div className="flex items-center gap-3 mb-2">
                   <Cpu className="h-4 w-4 text-zinc-950" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne">Matrix Command</h3>
                </div>
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Operational Jump Points</p>
              </div>
              
              <CardContent className="p-6 space-y-3">
                {[
                  { label: 'Entity Registry', href: '/admin/vendors', icon: Users, desc: 'Corporate Database' },
                  { label: 'RFP Protocols', href: '/admin/proposals', icon: Briefcase, desc: 'Tender Lifecycle' },
                  { label: 'Risk Schema', href: '/admin/document-types', icon: ShieldAlert, desc: 'Compliance Policy' },
                  { label: 'System Telemetry', href: '/admin/audit-logs', icon: Activity, desc: 'Audit Integrity' },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-6 p-8 rounded-[2.5rem] hover:bg-zinc-50 transition-all duration-500 group border border-transparent hover:border-zinc-100/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-zinc-100 transition-all duration-500 border border-zinc-100/50 relative z-10">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-black text-zinc-950 uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">{item.label}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto text-zinc-200 group-hover:text-zinc-950 group-hover:translate-x-2 transition-all duration-500 relative z-10" />
                  </Link>
                ))}
              </CardContent>
            </Card>
            
            {/* System Intelligence Card */}
            <Card className="rounded-[3.5rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/20 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                     <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-[9px] uppercase tracking-widest rounded-full px-5 py-2.5 backdrop-blur-md">Secure Core</Badge>
               </div>
               <div className="space-y-6 relative z-10">
                  <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Audit Protocol</p>
                  <p className="text-3xl font-syne font-black italic uppercase tracking-tighter leading-none">Intelligence Guard <br /> <span className="text-blue-500">v4.0.2</span> Established</p>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
