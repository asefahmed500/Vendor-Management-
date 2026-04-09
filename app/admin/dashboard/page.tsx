'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DollarSign
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

const statCards = [
  { key: 'total', label: 'Total Vendors', icon: Users, color: 'text-zinc-950', bg: 'bg-zinc-50' },
  { key: 'approvedLogin', label: 'Access Granted', icon: CheckCircle, color: 'text-zinc-600', bg: 'bg-zinc-50' },
  { key: 'documentsSubmitted', label: 'Documents', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'underReview', label: 'Under Review', icon: Search, color: 'text-zinc-500', bg: 'bg-zinc-50' },
  { key: 'approved', label: 'Verified', icon: Trophy, color: 'text-zinc-950', bg: 'bg-zinc-50' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
];

const proposalStatCards = [
  { key: 'total', label: 'Total RFPs', icon: Briefcase, color: 'text-zinc-950', bg: 'bg-zinc-50' },
  { key: 'open', label: 'Open', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-zinc-500', bg: 'bg-zinc-100' },
  { key: 'awarded', label: 'Awarded', icon: Trophy, color: 'text-zinc-950', bg: 'bg-zinc-50' },
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
  },
  pendingDocuments: 34,
  proposalStats: {
    total: 52,
    open: 18,
    closed: 28,
    awarded: 6,
    submissions: 156,
  },
};

export default function AdminDashboardPage() {
  const { data: session, isPending: isLoading } = useSession();
  const [data, setData] = useState<any>(mockData);
  const [showDemo, setShowDemo] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': 'Bearer demo-token',
          },
        });
        const json = await res.json();
        if (json.success && session) {
          setData(json.data);
          setShowDemo(false);
        }
      } catch (e) {
        console.log('Using demo data');
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
      <div className="max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-heading font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center">Admin access required.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-zinc-950 pb-8">
        <div>
          <Badge variant="outline" className="mb-4 border-zinc-950 text-zinc-950">System: Principal Admin</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-zinc-950 uppercase">
            Operations Center
          </h1>
          <p className="text-zinc-600 mt-2 font-medium uppercase tracking-widest text-xs">
            {showDemo ? 'Terminal: Simulated Data Mode' : `Authorized: Managing ${data.stats.total} entities`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Link href="/admin/audit-logs">
              <Activity className="h-4 w-4 mr-2" />
              Audit Log
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statCards.map((card) => {
          const value = data.stats[card.key] || 0;
          const Icon = card.icon;
          return (
            <Card key={card.key} className="border-2 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={`h-16 w-16 border-2 border-zinc-950 flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <Icon className={`h-8 w-8 text-zinc-950`} />
                  </div>
                  <div>
                    <p className="text-5xl font-heading font-black text-zinc-950 tracking-tighter">{value}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Documents Alert */}
      {data.pendingDocuments > 0 && (
        <Card className="border-4 border-amber-500 bg-amber-50 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 border-2 border-amber-500 bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]">
                  <FileText className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-black text-amber-950 uppercase tracking-tight">Pending Action Required</p>
                  <p className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-widest">
                    {data.pendingDocuments} documents awaiting supervisor verification
                  </p>
                </div>
              </div>
              <Button variant="outline" size="lg" asChild className="border-2 border-amber-600 bg-white shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]">
                <Link href="/admin/documents">Execute Review</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFP Stats */}
      <div className="pt-8 border-t-2 border-zinc-950/10">
        <h2 className="text-2xl font-heading font-black mb-8 text-zinc-950 uppercase tracking-tighter">Asset Acquisition Protocol</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {proposalStatCards.map((card) => {
            const value = data.proposalStats[card.key] || 0;
            const Icon = card.icon;
            return (
              <Card key={card.key} className="border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 border-2 border-zinc-950 flex items-center justify-center bg-zinc-50`}>
                      <Icon className={`h-5 w-5 text-zinc-950`} />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-black text-zinc-950 tracking-tighter">{value}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{card.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button asChild className="h-12">
          <Link href="/admin/vendors">
            <Users className="mr-2 h-4 w-4" />
            Manage Vendors
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12">
          <Link href="/admin/proposals">
            <Briefcase className="mr-2 h-4 w-4" />
            View RFPs
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12">
          <Link href="/admin/documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Link>
        </Button>
      </div>
    </div>
  );
}
