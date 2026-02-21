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
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Building2,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Award,
  Download,
  RefreshCcw,
  TrendingUp,
  Target,
  Zap,
  Globe,
  Plus,
  ArrowRight,
  Database,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils/export';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const COLORS = {
  primary: '#8b5cf6', // Violet
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  danger: '#ef4444',  // Rose
  indigo: '#6366f1',
  cyan: '#06b6d4',
  zinc: '#71717a',
};

const CHART_COLORS = [COLORS.primary, COLORS.success, COLORS.indigo, COLORS.cyan, COLORS.warning];

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

interface ActivityLog {
  _id: string;
  activityType: string;
  description: string;
  createdAt: string;
  vendorId: {
    companyName: string;
  };
  performedBy: {
    email: string;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAuditLogs();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.error || 'System rejection identified');
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      toast.error('Nexus connection failure');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs');
      const data = await response.json();

      if (data.success && data.data) {
        setActivities(data.data.recentActivities || []);
      }
    } catch (error) {
      console.error('Fetch audit logs error:', error);
    }
  };

  const vendorStatusData = stats ? [
    { name: 'Pending', value: stats.pendingVendors },
    { name: 'Approved', value: stats.approvedVendors },
    { name: 'Review', value: stats.underReviewVendors },
    { name: 'Rejected', value: stats.rejectedVendors },
  ] : [];

  const proposalStatusData = stats ? [
    { name: 'Draft', value: stats.draftProposals },
    { name: 'Open', value: stats.openProposals },
    { name: 'Closed', value: stats.closedProposals },
  ] : [];

  const trendData = [
    { name: 'Jan', vendors: 12, proposals: 24, activity: 65 },
    { name: 'Feb', vendors: 15, proposals: 30, activity: 72 },
    { name: 'Mar', vendors: 20, proposals: 35, activity: 85 },
    { name: 'Apr', vendors: 25, proposals: 45, activity: 94 },
    { name: 'May', vendors: 22, proposals: 40, activity: 88 },
    { name: 'Jun', vendors: 30, proposals: 50, activity: 98 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-0">
        <div className="h-32 bg-muted animate-pulse rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-[400px] bg-muted animate-pulse rounded-[3rem]" />
          <div className="h-[400px] bg-muted animate-pulse rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={"secondary" as any} className="font-black uppercase tracking-widest text-[10px] px-3">Ecosystem Intelligence</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Live Performance Metrics
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Network Analytics
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Advanced visualization of node growth, proposal velocity, and ecosystem health. Transitioning raw data into actionable intelligence.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border-2 border-zinc-50 dark:border-zinc-800">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${timeRange === range
                  ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button onClick={() => exportToCSV([stats || {}], 'vms-intelligence-report', ['totalVendors', 'approvedVendors', 'openProposals', 'pendingDocuments'])} variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 shadow-sm border-2">
            <Download className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Network Nodes', val: stats?.totalVendors || 0, icon: Building2, color: 'text-primary', bg: 'bg-primary/10', trend: '+12% GROWTH' },
          { label: 'Validated Entities', val: stats?.approvedVendors || 0, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '94% ACCURACY' },
          { label: 'Active Proposals', val: stats?.openProposals || 0, icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '8.4/DAY VELOCITY' },
          { label: 'Pending Audit', val: stats?.pendingDocuments || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'ACTION REQUIRED' }
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className={`h-14 w-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border shadow-inner`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{stat.val}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${stat.color}`}>{stat.trend}</span>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="h-20 w-20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
          <CardHeader className="p-10 border-b-2 border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter">Entity Distribution</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Node status classification matrix</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {vendorStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {vendorStatusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <div className="flex-1 flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{d.name}</span>
                    <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-100">{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
          <CardHeader className="p-10 border-b-2 border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter">Proposal Velocity</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Transaction volume by stage</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proposalStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontWeight: '900', fontSize: '10px' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                  />
                  <Bar
                    dataKey="value"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border-2 border-white dark:border-zinc-800 shadow-inner flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Pipeline Value</p>
                <h4 className="text-xl font-black uppercase tracking-tight">Enterprise Scale</h4>
              </div>
              <Button variant="outline" className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px] border-2">Full report</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
        <CardHeader className="p-10 border-b-2 border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter">Performance Trends</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Temporal progression of ecosystem activity</CardDescription>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10 pt-16">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontWeight: '900', fontSize: '10px' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' } as any}
                />
                <Area
                  type="monotone"
                  dataKey="vendors"
                  stroke={COLORS.primary}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVendors)"
                />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke={COLORS.success}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Key Intelligence */}
        <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-10 shadow-xl space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border-2">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter">Core Intelligence</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Avg Process Cycle', val: '2.3 SOLAR DAYS' },
              { label: 'Network Saturation', val: '94.5% OPTIMIZED' },
              { label: 'Bid Success Rate', val: '78.2% CONVERSION' },
              { label: 'Identity Trust Hash', val: '91.3% VERIFIED' }
            ].map(m => (
              <div key={m.label} className="flex flex-col gap-1 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{m.label}</span>
                <span className="text-sm font-black uppercase tracking-tighter">{m.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Performers */}
        <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-10 shadow-xl space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center border-2 border-yellow-500/10">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter">Top Performers</h3>
          </div>
          <div className="space-y-5">
            {['TechCorp Global', 'Nexus Solutions', 'Prime Logics'].map((name, i) => (
              <div key={name} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-zinc-400">0{i + 1}</span>
                  <span className="text-[11px] font-black uppercase tracking-tight">{name}</span>
                </div>
                <Badge variant="secondary" className="px-2 py-0 h-4 text-[8px] font-black uppercase tracking-tighter">PRIME</Badge>
              </div>
            ))}
            <div className="pt-4 flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="text-emerald-500">+8 NEW ENTITIES THIS MONTH</span>
            </div>
          </div>
        </Card>

        {/* Rapid Access */}
        <Card className="rounded-[3rem] border-2 border-primary/20 bg-primary/5 p-10 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase tracking-tighter text-primary">Intelligence Console</h3>
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Rapid transition to nexus nodes</p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Vendor Registry', icon: Users, href: '/admin/vendors' },
              { label: 'RFP Controller', icon: FileText, href: '/admin/proposals' },
              { label: 'Security Vault', icon: ShieldCheck, href: '/admin/documents' }
            ].map(btn => (
              <Button key={btn.label} asChild variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm group">
                <a href={btn.href} className="flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <btn.icon className="h-4 w-4 opacity-50" />
                    {btn.label}
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
    </div>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}
