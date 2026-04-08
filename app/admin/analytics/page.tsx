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
  FileText,
  CheckCircle,
  Clock,
  Users,
  Award,
  Download,
  TrendingUp,
  Target,
  ShieldCheck,
  Activity,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  indigo: '#6366f1',
};

const CHART_COLORS = [COLORS.primary, COLORS.success, COLORS.indigo, COLORS.warning, COLORS.danger];

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
    { name: 'Under Review', value: stats.underReviewVendors || 0 },
    { name: 'Rejected', value: stats.rejectedVendors || 0 },
  ] : [];

  const proposalStatusData = stats ? [
    { name: 'Draft', value: stats.draftProposals || 0 },
    { name: 'Open', value: stats.openProposals || 0 },
    { name: 'Closed', value: stats.closedProposals || 0 },
  ] : [];

  const trendData = [
    { name: 'Jan', vendors: 12, proposals: 24 },
    { name: 'Feb', vendors: 15, proposals: 30 },
    { name: 'Mar', vendors: 20, proposals: 35 },
    { name: 'Apr', vendors: 25, proposals: 45 },
    { name: 'May', vendors: 22, proposals: 40 },
    { name: 'Jun', vendors: 30, proposals: 50 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
          <div className="h-[400px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Vendor and proposal performance overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalVendors || 0}</p>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.approvedVendors || 0}</p>
                <p className="text-sm text-muted-foreground">Verified Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.openProposals || 0}</p>
                <p className="text-sm text-muted-foreground">Open RFPs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pendingDocuments || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Vendor Distribution</CardTitle>
            <CardDescription>Vendor status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {vendorStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {vendorStatusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-sm text-muted-foreground">{d.name}</span>
                  <span className="text-sm font-medium ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposal Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">RFP Status</CardTitle>
            <CardDescription>Proposals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proposalStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Growth Trends</CardTitle>
          <CardDescription>Monthly vendor and proposal activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="vendors" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="proposals" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Proposals</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-zinc-600 dark:text-zinc-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total RFPs</p>
                <p className="text-2xl font-bold">{stats?.totalProposals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FileText className="h-5 w-5 text-zinc-600 dark:text-zinc-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold">{stats?.proposalSubmissions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Award className="h-5 w-5 text-zinc-600 dark:text-zinc-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Access Enabled</p>
                <p className="text-2xl font-bold">{stats?.approvedLoginVendors || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
