import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { getVendorDashboardData } from '@/lib/services/dashboard';
import { VendorStatus } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  FileText,
  Search,
  ShieldCheck,
  Briefcase,
  User,
  Award,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<
  VendorStatus,
  { label: string; description: string; variant: 'default' | 'info' | 'warning' | 'success' | 'danger'; icon: React.ElementType; barBgClass: string; iconBgClass: string; iconTextClass: string }
> = {
  PENDING: {
    label: 'Registration Pending',
    description: 'Awaiting initial administrative verification. Usually takes 24-48 hours.',
    variant: 'warning',
    icon: Clock,
    barBgClass: 'bg-amber-500',
    iconBgClass: 'bg-amber-500/10',
    iconTextClass: 'text-amber-600',
  },
  APPROVED_LOGIN: {
    label: 'Access Enabled',
    description: 'System access granted. Please proceed to upload business compliance documents.',
    variant: 'info',
    icon: FileText,
    barBgClass: 'bg-sky-500',
    iconBgClass: 'bg-sky-500/10',
    iconTextClass: 'text-sky-600',
  },
  DOCUMENTS_SUBMITTED: {
    label: 'Audit in Progress',
    description: 'Compliance documentation received. Internal audit team is verifying your data.',
    variant: 'default',
    icon: Search,
    barBgClass: 'bg-zinc-500',
    iconBgClass: 'bg-zinc-500/10',
    iconTextClass: 'text-zinc-600',
  },
  UNDER_REVIEW: {
    label: 'Technical Review',
    description: 'Final technical evaluation in progress. We are cross-referencing industry standards.',
    variant: 'warning',
    icon: Search,
    barBgClass: 'bg-amber-500',
    iconBgClass: 'bg-amber-500/10',
    iconTextClass: 'text-amber-600',
  },
  APPROVED: {
    label: 'Verified Partner',
    description: 'Authentication complete. You are now a certified vendor within our ecosystem.',
    variant: 'success',
    icon: ShieldCheck,
    barBgClass: 'bg-emerald-500',
    iconBgClass: 'bg-emerald-500/10',
    iconTextClass: 'text-emerald-600',
  },
  REJECTED: {
    label: 'Access Denied',
    description: 'Compliance mismatch identified. Please review rejection logs or contact support.',
    variant: 'danger',
    icon: AlertCircle,
    barBgClass: 'bg-rose-500',
    iconBgClass: 'bg-rose-500/10',
    iconTextClass: 'text-rose-600',
  },
};

const steps = [
  { key: 'APPROVED_LOGIN' as const, label: 'Portal Access', description: 'Authentication active' },
  { key: 'DOCUMENTS_SUBMITTED' as const, label: 'Compliance Upload', description: 'Documentation entry' },
  { key: 'UNDER_REVIEW' as const, label: 'Audit Phase', description: 'Verification cycle' },
  { key: 'APPROVED' as const, label: 'Certification', description: 'Network verification' },
];

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  const data = await getVendorDashboardData(session.user.id);
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Configuration Error</h2>
        <p className="text-muted-foreground">Vendor profile not localized for this account node.</p>
        <Button asChild><Link href="/login">Return to Home</Link></Button>
      </div>
    );
  }

  const { vendor, documents, proposalStats } = data;
  const config = statusConfig[vendor.status as VendorStatus] || statusConfig.PENDING;
  const currentStepIndex = steps.findIndex((s) => s.key === vendor.status);
  const StatusIcon = config.icon;

  const pendingDocs = documents.filter((d: any) => d.status === 'PENDING').length;
  const verifiedDocs = documents.filter((d: any) => d.status === 'VERIFIED').length;
  const rejectedDocs = documents.filter((d: any) => d.status === 'REJECTED').length;

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">System Node Active</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID: {vendor._id?.slice(-8).toUpperCase()}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Nexus Dashboard
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Welcome back, <span className="text-foreground font-black tracking-tight">{vendor.contactPerson}</span>.
            Monitoring <span className="text-indigo-600 font-bold uppercase">{vendor.companyName}</span> network status and active compliance streams.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Rating</div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i <= 4 ? 'bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
            ))}
            <span className="ml-2 font-black text-sm uppercase">Level 4</span>
          </div>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl transition-all hover:border-indigo-500/50">
        <div className={`absolute top-0 left-0 w-2 h-full ${config.barBgClass}`} />
        <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className={`h-24 w-24 rounded-3xl ${config.iconBgClass} ${config.iconTextClass} shrink-0 shadow-inner flex items-center justify-center`}>
            <StatusIcon className="h-10 w-10" />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                {config.label}
              </h2>
              <Badge variant={config.variant} className="uppercase font-bold text-[10px] px-2 py-0.5">Live Status</Badge>
            </div>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-3xl">
              {config.description}
            </p>
          </div>
          <Button size="lg" className="rounded-2xl h-16 w-full lg:w-auto px-8 font-black uppercase tracking-tight gap-3 shadow-xl hover:scale-105 transition-transform" asChild>
            <Link href="/vendor/profile">Review Roadmap <ChevronRight className="h-5 w-5" /></Link>
          </Button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-100 dark:bg-zinc-900 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Compliance Stream</h2>
              </div>
              <Button variant="ghost" size="sm" className="font-bold text-xs uppercase" asChild>
                <Link href="/vendor/documents">Manage Vault <ArrowUpRight className="h-3 w-3 ml-2" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Network Total', value: documents.length, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { label: 'Pending Review', value: pendingDocs, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/10' },
                { label: 'Verified Blocks', value: verifiedDocs, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              ].map((stat) => (
                <Card key={stat.label} className="rounded-3xl border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-xl transition-all group overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                        <TrendingUp className="h-3 w-3" />
                        Stable
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {vendor.status === 'APPROVED' && proposalStats && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Active Bidding Hub</h2>
                </div>
                <Button variant="ghost" size="sm" className="font-bold text-xs uppercase" asChild>
                  <Link href="/vendor/proposals">Marketplace <ArrowUpRight className="h-3 w-3 ml-2" /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Submissions', value: proposalStats.total, icon: FileText, bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-500' },
                  { label: 'In Review', value: proposalStats.submitted + proposalStats.underReview, icon: Clock, bgClass: 'bg-amber-500/10', textClass: 'text-amber-500' },
                  { label: 'Accepted', value: proposalStats.accepted, icon: CheckCircle2, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-500' },
                  { label: 'Avg Pulse', value: `${proposalStats.averageScore > 0 ? Math.round(proposalStats.averageScore) : '0'}/100`, icon: ShieldCheck, bgClass: 'bg-purple-500/10', textClass: 'text-purple-500' },
                ].map((stat) => (
                  <Card key={stat.label} className="rounded-[1.75rem] border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`h-10 w-10 rounded-xl ${stat.bgClass} ${stat.textClass} flex items-center justify-center`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {proposalStats.openProposals > 0 && (
                <div className="mt-8 group relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 text-white shadow-2xl hover:scale-[1.01] transition-all">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                      <Briefcase className="h-8 w-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1">
                      <h3 className="text-2xl font-black tracking-tight uppercase">
                        {proposalStats.openProposals} Active RFP Opportunities
                      </h3>
                      <p className="text-indigo-100 font-medium">New vendor requests matched your corporate profile. Submit proposals now.</p>
                    </div>
                    <Button variant="secondary" size="lg" className="rounded-xl font-black uppercase tracking-tight h-14 px-8 shadow-xl" asChild>
                      <Link href="/vendor/proposals">Launch Bidder</Link>
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Onboarding Roadmap</h2>
            </div>
            <Card className="rounded-[2rem] border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden">
              <CardContent className="p-10">
                <div className="relative">
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-900" />
                  <div className="space-y-12">
                    {steps.map((step, index) => {
                      const isComplete = currentStepIndex >= index;
                      const isCurrent = currentStepIndex === index;
                      return (
                        <div key={step.key} className="relative flex gap-8 group">
                          <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-4 text-xs font-black transition-all duration-500 shadow-xl ${isComplete ? 'border-indigo-500 bg-indigo-500 text-white scale-110' : 'border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 text-zinc-400'}`}>
                            {isComplete ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                          </div>
                          <div className="pt-0.5">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className={`font-black uppercase tracking-tight ${isCurrent ? 'text-indigo-500 text-lg' : isComplete ? 'text-foreground' : 'text-zinc-400'}`}>{step.label}</h3>
                              {isCurrent && <Badge variant="secondary" className="text-[9px] uppercase font-black px-2 animate-pulse">In Progress</Badge>}
                            </div>
                            <p className={`text-sm font-medium ${isCurrent ? 'text-zinc-600 dark:text-zinc-400 text-base leading-relaxed' : 'text-zinc-400'}`}>{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">Active Alerts</h2>
          </div>
          {rejectedDocs > 0 ? (
            <Card className="rounded-[2rem] border-2 border-rose-500/20 bg-rose-500/5 overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-rose-600">Compliance Warning</h3>
                  <p className="text-sm font-bold text-rose-600/70 leading-relaxed uppercase"><span className="text-2xl mr-1">{rejectedDocs}</span> Audit Failures identified.</p>
                </div>
                <Button variant="destructive" className="w-full h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl" asChild>
                  <Link href="/vendor/documents">Fix Compliance <ChevronRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[2rem] border-zinc-100 dark:border-zinc-900 bg-zinc-100/30 dark:bg-zinc-900/10 border-dashed">
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight text-zinc-500">System Clear</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase">No high-priority alerts identified</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2 mt-4">Node Operations</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Network Profile', icon: User, href: '/vendor/profile' },
                { label: 'Security Vault', icon: FileText, href: '/vendor/documents' },
                { label: 'Node Certificate', icon: Award, href: '/vendor/certificate', hide: vendor.status !== 'APPROVED' },
              ].filter(a => !a.hide).map(action => (
                <Link key={action.label} href={action.href} className="block group">
                  <Card className="rounded-2xl border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-indigo-500/50 overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-zinc-400">
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-wider">{action.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <Card className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <HelpCircle className="h-8 w-8 text-indigo-300" />
                <Badge className="bg-white/20 text-white font-black text-[9px] uppercase hover:bg-white/30 cursor-pointer">Live 24/7</Badge>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Support Node</h3>
              <Button variant="secondary" className="w-full h-12 rounded-xl font-black uppercase tracking-tight text-xs shadow-xl">Contact Engineering</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
