import Link from 'next/link';
import { getAdminDashboardStats } from '@/lib/services/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle,
  FileText,
  Search,
  XCircle,
  Briefcase,
  Inbox,
  ClipboardList,
  Trophy,
  UserPlus,
  PlusCircle,
  Clock,
  LayoutDashboard,
  ArrowUpRight,
  TrendingUp,
  Activity,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const statCards = [
  { key: 'total' as const, label: 'Global Vendors', icon: Users, bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-600', trend: '+12.5%', trendIcon: TrendingUp },
  { key: 'approvedLogin' as const, label: 'Access Enabled', icon: CheckCircle, bgClass: 'bg-sky-500/10', textClass: 'text-sky-600', trend: '+8.2%', trendIcon: TrendingUp },
  { key: 'documentsSubmitted' as const, label: 'Audit Assets', icon: FileText, bgClass: 'bg-purple-500/10', textClass: 'text-purple-600', trend: '+15.1%', trendIcon: TrendingUp },
  { key: 'underReview' as const, label: 'Review Queue', icon: Search, bgClass: 'bg-amber-500/10', textClass: 'text-amber-600', trend: '+5.4%', trendIcon: Activity },
  { key: 'approved' as const, label: 'Verified Partners', icon: ShieldCheck, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600', trend: '+18.3%', trendIcon: TrendingUp },
  { key: 'rejected' as const, label: 'Flagged Nodes', icon: XCircle, bgClass: 'bg-rose-500/10', textClass: 'text-rose-600', trend: '-2.1%', trendIcon: Activity },
];

const proposalStatCards = [
  { key: 'total' as const, label: 'RFP Streams', icon: Briefcase, bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-600' },
  { key: 'open' as const, label: 'Active Flows', icon: Inbox, bgClass: 'bg-sky-500/10', textClass: 'text-sky-600' },
  { key: 'submissions' as const, label: 'Review Cycle', icon: ClipboardList, bgClass: 'bg-amber-500/10', textClass: 'text-amber-600' },
  { key: 'awarded' as const, label: 'Awarded Units', icon: Trophy, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600' },
];

const quickActions = [
  { label: 'Register Vendor', href: '/admin/create-vendor', icon: UserPlus, variant: 'default', description: 'Initialize new partner' },
  { label: 'Broadcast RFP', href: '/admin/proposals/create', icon: PlusCircle, variant: 'secondary', description: 'Deploy new opportunity' },
  { label: 'Audit Submissions', href: '/admin/proposals?status=OPEN', icon: Inbox, variant: 'outline', description: 'Evaluate proposals' },
  { label: 'Nexus Approvals', href: '/admin/vendors?status=UNDER_REVIEW', icon: Clock, variant: 'outline', description: 'Finalize onboarding' },
];

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardStats();

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Root Authority</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Core Status: Stable</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Central Control
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Global ecosystem overview. Monitoring <span className="text-foreground font-black tracking-tight">{data.stats.total}</span> vendors and <span className="text-foreground font-black tracking-tight">{data.proposalStats.total}</span> RFP streams.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase tracking-tight gap-2 shadow-sm border-2">
            <Activity className="h-4 w-4" />
            Pulse Logs
          </Button>
          <Button className="rounded-2xl h-12 px-6 font-black uppercase tracking-tight gap-2 shadow-xl shadow-primary/20">
            System Health
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Ecosystem Metrics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statCards.map((card) => {
            const value = data.stats[card.key] || 0;
            const Icon = card.icon;
            const TrendIcon = card.trendIcon;
            const isPositive = card.trend.includes('+');

            return (
              <Card key={card.key} className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-2xl transition-all group hover:border-indigo-500/30 overflow-hidden relative">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-3xl ${card.bgClass} ${card.textClass} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <TrendIcon className="h-3 w-3" />
                      {card.trend}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">
                      {card.label}
                    </p>
                    <p className="text-4xl font-black tracking-tighter">
                      {value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
                {/* Subtle background decoration */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${card.bgClass} rounded-full blur-3xl pointer-events-none`} />
              </Card>
            );
          })}

          <Card className="rounded-[2.5rem] border-2 border-amber-500/20 bg-amber-500/5 hover:shadow-2xl transition-all group overflow-hidden relative">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-600 group-hover:scale-110 transition-transform shadow-inner border border-amber-500/20">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                  <Activity className="h-3 w-3" />
                  Urgent
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-700/70 uppercase tracking-[0.2em] mb-1">
                  Compliance Audit
                </p>
                <p className="text-4xl font-black tracking-tighter text-amber-600">
                  {data.pendingDocuments.toLocaleString() || 0}
                </p>
              </div>
            </CardContent>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* RFP Management */}
        <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Proposal Operations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proposalStatCards.map((card) => {
              const value = data.proposalStats[card.key as keyof typeof data.proposalStats] || 0;
              const Icon = card.icon;

              return (
                <Card key={card.key} className="rounded-[2rem] border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-xl transition-all group">
                  <CardContent className="p-8 pb-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl ${card.bgClass} ${card.textClass} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase font-black border-2 tracking-widest">Active Batch</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">
                        {card.label}
                      </p>
                      <p className="text-3xl font-black tracking-tighter">
                        {value.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Help & Support Banner */}
          <Card className="rounded-[3rem] bg-gradient-to-r from-zinc-950 to-zinc-900 text-white border-2 border-zinc-800 overflow-hidden shadow-2xl relative">
            <CardContent className="p-10 lg:p-14 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 backdrop-blur-md mb-2">
                    <ShieldCheck className="h-3 w-3" />
                    Elite Security Protocol
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">Governance Hub</h3>
                  <p className="text-zinc-400 font-medium max-w-md">
                    Access specialized training modules, regulatory compliance documents, and administrative support nodes.
                  </p>
                </div>
                <Button size="lg" variant="secondary" className="rounded-2xl h-16 px-10 font-black uppercase tracking-tight shadow-2xl hover:scale-105 transition-transform group">
                  Knowledge Base
                  <ArrowUpRight className="h-5 w-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Button>
              </div>
            </CardContent>
            {/* Visual background decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-full bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />
          </Card>
        </div>

        {/* Sidebar Quick Actions */}
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
              <Activity className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Control Node</h2>
          </div>

          <div className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block group"
                >
                  <Card className="rounded-[1.5rem] border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-all hover:border-primary/50 hover:shadow-xl hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-5">
                        <div className={`
                          h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110
                          ${action.variant === 'default' ? 'bg-primary text-primary-foreground' : ''}
                          ${action.variant === 'secondary' ? 'bg-zinc-950 text-white border border-zinc-800 shadow-zinc-950/20' : ''}
                          ${action.variant === 'outline' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500' : ''}
                        `}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-xs uppercase tracking-wider mb-0.5">
                            {action.label}
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight truncate">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Audit Log Card */}
          <Card className="rounded-[2.5rem] bg-zinc-100/50 dark:bg-zinc-900/20 border-dashed border-2 border-zinc-200 dark:border-zinc-800">
            <CardContent className="p-10 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-[2rem] bg-white dark:bg-zinc-950 shadow-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-900">
                <LayoutDashboard className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Nexus Audit Stream</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                  Real-time monitoring of all cryptographic actions and system events.
                </p>
              </div>
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-tight border-2 gap-2 group" asChild>
                <Link href="/admin/audit-logs">
                  Connect Stream
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Critical Warnings */}
          <Card className="rounded-[2.5rem] border-2 border-rose-500/20 bg-rose-500/5 overflow-hidden group">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Security Patch</p>
                <p className="text-sm font-black text-rose-900 dark:text-rose-400 uppercase leading-tight">
                  v2.4 Audit Layer requires manual deployment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
