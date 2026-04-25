'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  Clock,
  TrendingUp,
  ShieldCheck,
  Activity,
  Briefcase,
  ArrowUpRight,
  Filter,
  Layers,
  Database,
  Shield,
  Zap,
  Globe,
  Download,
  Fingerprint,
  Cpu,
  RefreshCw,
  Target,
  BarChart3,
  ChevronLeft,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import Link from 'next/link';

const COLORS = {
  primary: '#09090b', // Zinc-950
  accent: '#3b82f6',  // Blue-500
  success: '#10b981', // Emerald-500
  warning: '#f59e0b', // Amber-500
  muted: '#71717a',   // Zinc-500
};

const CHART_COLORS = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.warning, '#6366f1'];

interface DashboardStats {
  totalVendors: number;
  pendingVendors: number;
  approvedLoginVendors: number;
  documentsSubmittedVendors: number;
  underReviewVendors: number;
  approvedVendors: number;
  rejectedVendors: number;
  totalProposals: number;
  draftProposals: number;
  openProposals: number;
  closedProposals: number;
  proposalSubmissions: number;
  pendingDocuments: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 text-white p-6 rounded-[2rem] border border-white/10 shadow-3xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 italic font-syne">{label}</p>
        <div className="space-y-3">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{p.name}</span>
              </div>
              <span className="text-lg font-syne font-black italic">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const vendorStatusData = stats ? [
    { name: 'Pending', value: stats.pendingVendors || 0 },
    { name: 'Approved', value: stats.approvedVendors || 0 },
    { name: 'Reviewing', value: stats.underReviewVendors || 0 },
    { name: 'Rejected', value: stats.rejectedVendors || 0 },
  ] : [];

  const proposalStatusData = stats ? [
    { name: 'Draft', value: stats.draftProposals || 0 },
    { name: 'Open', value: stats.openProposals || 0 },
    { name: 'Closed', value: stats.closedProposals || 0 },
  ] : [];

  const trendData = [
    { name: 'JAN', vendors: 12, proposals: 24 },
    { name: 'FEB', vendors: 15, proposals: 30 },
    { name: 'MAR', vendors: 20, proposals: 35 },
    { name: 'APR', vendors: 25, proposals: 45 },
    { name: 'MAY', vendors: 22, proposals: 40 },
    { name: 'JUN', vendors: 30, proposals: 50 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <BarChart3 className="h-10 w-10 text-zinc-300" />
          </div>
        </div>
        <div className="space-y-3 text-center">
           <h2 className="text-2xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Compiling Intelligence</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Scanning Shards 01-99…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-20 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-zinc-950 transition-colors">Admin Core</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">Strategic Analytics</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Strategic <br /> Analytics
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Real-time operational intelligence and <span className="text-zinc-950 font-bold italic">Ecosystem Yield</span> metrics for the global ShieldPlus partner network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button 
              variant="outline" 
              className="h-20 px-10 rounded-[2.5rem] border-zinc-200 text-zinc-950 hover:bg-white hover:shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.3em] group shadow-sm bg-white/50 backdrop-blur-md"
            >
              <Calendar className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              Intelligence Period
            </Button>
            <Button 
              onClick={fetchDashboardData}
              className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
            >
              <RefreshCw className="h-5 w-5 mr-4 transition-transform duration-1000 group-hover:rotate-180" />
              Refresh Shards
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            { label: 'Network Scale', value: stats?.totalVendors || 0, sub: 'Active Entities', icon: Building2, color: 'zinc' },
            { label: 'Security Level', value: 'High', sub: 'Protocol Verified', icon: ShieldCheck, color: 'blue' },
            { label: 'Registry Flow', value: stats?.openProposals || 0, sub: 'Active Opportunities', icon: Briefcase, color: 'emerald' },
            { label: 'Sync Latency', value: '12ms', sub: 'Nexus Response', icon: Zap, color: 'zinc' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="rounded-[3rem] p-10 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-150">
                  <Icon className="w-full h-full" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-950'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-5xl font-syne font-black tracking-tighter uppercase text-zinc-950">
                    {stat.value}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.sub}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Analytics Main Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Growth Trajectory - The Black Card */}
          <Card className="lg:col-span-12 border-none shadow-3xl shadow-zinc-950/40 rounded-[4rem] bg-zinc-950 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="px-12 py-16 flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
              <div className="flex items-center gap-8">
                <div className="h-20 w-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp className="h-10 w-10 text-blue-400" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-syne font-black italic tracking-tighter uppercase leading-none">Growth Manifest</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Telemetry Stream: ACTIVE</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="text-right space-y-1">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Network Yield</p>
                   <p className="text-4xl font-syne font-black italic tracking-tighter text-emerald-400">+24.8%</p>
                </div>
                <div className="h-12 w-[1px] bg-white/10" />
                <div className="text-right space-y-1">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Projection</p>
                   <p className="text-4xl font-syne font-black italic tracking-tighter text-blue-400">OPTIMAL</p>
                </div>
              </div>
            </div>

            <div className="px-12 pb-20 relative z-10">
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProposals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#52525b', fontFamily: 'Syne' }} 
                      dy={20}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#52525b', fontFamily: 'Syne' }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="vendors" 
                      name="Partner Ingestion"
                      stroke={COLORS.accent} 
                      strokeWidth={6}
                      fillOpacity={1} 
                      fill="url(#colorVendors)" 
                      activeDot={{ r: 10, strokeWidth: 4, stroke: '#09090b', fill: COLORS.accent }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="proposals" 
                      name="Project Velocity"
                      stroke={COLORS.success} 
                      strokeWidth={6}
                      fillOpacity={1} 
                      fill="url(#colorProposals)" 
                      activeDot={{ r: 10, strokeWidth: 4, stroke: '#09090b', fill: COLORS.success }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Identity & Activity Distribution */}
          <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Pie Chart Card */}
            <Card className="rounded-[4rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-12 relative overflow-hidden group">
              <div className="flex items-center gap-8 mb-16">
                <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-3xl shadow-zinc-950/20 group-hover:rotate-12 transition-transform duration-700">
                  <Fingerprint className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Entity Distribution</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verification Lifecycle Analysis</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="h-[350px] w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vendorStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={140}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {vendorStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex-1 w-full space-y-6">
                   {vendorStatusData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 group/item hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-4 rounded-full shadow-lg" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/item:text-zinc-950 transition-colors">{d.name} Entities</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-2xl font-syne font-black text-zinc-950">{d.value}</span>
                         <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover/item:text-zinc-950 group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Bar Chart Card */}
            <Card className="rounded-[4rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-12 relative overflow-hidden group">
              <div className="flex items-center gap-8 mb-16">
                <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-3xl shadow-zinc-950/20 group-hover:rotate-12 transition-transform duration-700">
                  <Activity className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Project Velocity</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Registry Engagement Metrics</p>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={proposalStatusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#a1a1aa', fontFamily: 'Syne' }} 
                      dy={20}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa', fontFamily: 'Syne' }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafafa' }} />
                    <Bar 
                      dataKey="value" 
                      fill={COLORS.primary} 
                      radius={[20, 20, 20, 20]} 
                      barSize={60} 
                      className="hover:fill-blue-500 transition-colors duration-500 cursor-pointer" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-zinc-50">
                 {proposalStatusData.map((d) => (
                  <div key={d.name} className="text-center group cursor-pointer">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-zinc-950 transition-colors mb-4">{d.name}</p>
                    <p className="text-5xl font-syne font-black text-zinc-950 tracking-tighter transition-transform group-hover:scale-110 italic">{d.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Global Performance Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
           <Card className="rounded-[3rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                    <Shield className="h-8 w-8 text-emerald-400" />
                 </div>
                 <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[9px] font-black uppercase tracking-widest rounded-full px-4 py-2 italic font-syne">ISO 27001</Badge>
              </div>
              <div className="space-y-6 relative z-10">
                 <h4 className="text-4xl font-syne font-black italic tracking-tighter uppercase leading-[0.9]">Registry <br /> Integrity</h4>
                 <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] leading-relaxed">Cryptographically verified audit trail for all ecosystem transitions.</p>
              </div>
           </Card>

           <Card className="rounded-[3rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 min-h-[350px] flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-zinc-950" />
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic font-syne">Global Shards Online</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-4xl font-syne font-black italic tracking-tighter uppercase leading-[0.9]">Ecosystem <br /> Flux</h4>
                 <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed">Dynamic monitoring of global partner engagement and resource allocation.</p>
              </div>
           </Card>

           <Card className="rounded-[3rem] p-12 border-none bg-blue-600 text-white shadow-3xl shadow-blue-600/30 min-h-[350px] flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_70%)]" />
              <div className="flex items-center justify-between relative z-10">
                 <div className="h-16 w-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:rotate-12 transition-transform">
                    <Target className="h-8 w-8 text-white" />
                 </div>
                 <ArrowUpRight className="h-8 w-8 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-6 relative z-10">
                 <h4 className="text-4xl font-syne font-black italic tracking-tighter uppercase leading-[0.9]">Strategic <br /> Forecast</h4>
                 <p className="text-[11px] font-black text-blue-200 uppercase tracking-[0.4em] leading-relaxed">Predictive analysis of network expansion and project conversion yield.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
