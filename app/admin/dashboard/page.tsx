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
  { key: 'total', label: 'Total Vendors', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { key: 'approvedLogin', label: 'Access Granted', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { key: 'documentsSubmitted', label: 'Documents', icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  { key: 'underReview', label: 'Under Review', icon: Search, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { key: 'approved', label: 'Verified', icon: Trophy, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
];

const proposalStatCards = [
  { key: 'total', label: 'Total RFPs', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { key: 'open', label: 'Open', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { key: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-zinc-800/50' },
  { key: 'awarded', label: 'Awarded', icon: Trophy, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
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
    <div className="space-y-8 pb-12 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {showDemo ? 'Preview mode - showing demo data' : `Managing ${data.stats.total} vendors and ${data.proposalStats.total} RFPs`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/audit-logs">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const value = data.stats[card.key] || 0;
          const Icon = card.icon;
          return (
            <Card key={card.key} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Documents Alert */}
      {data.pendingDocuments > 0 && (
        <Card className="border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pending Document Reviews</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {data.pendingDocuments} documents awaiting verification
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/documents">Review Documents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFP Stats */}
      <div>
        <h2 className="text-xl font-heading font-bold mb-4 text-foreground">RFP Overview</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {proposalStatCards.map((card) => {
            const value = data.proposalStats[card.key] || 0;
            const Icon = card.icon;
            return (
              <Card key={card.key} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
                      <p className="text-sm font-medium text-muted-foreground mt-0.5">{card.label}</p>
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
