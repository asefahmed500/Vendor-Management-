'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Send, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Briefcase, Calendar, DollarSign, Layers, ArrowUpRight, FileText, Settings2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProposalsResponse {
  items: IProposal[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const statusVariants: Record<ProposalStatus, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  DRAFT: 'default',
  OPEN: 'success',
  CLOSED: 'danger',
  AWARDED: 'info',
};

const statusLabels: Record<ProposalStatus, string> = {
  DRAFT: 'Draft',
  OPEN: 'Open Flow',
  CLOSED: 'Terminated',
  AWARDED: 'Awarded',
};

const categories = [
  'IT_SERVICES',
  'CONSTRUCTION',
  'CONSULTING',
  'SUPPLY_CHAIN',
  'MARKETING',
  'MANUFACTURING',
  'PROFESSIONAL_SERVICES',
  'OTHER',
];

function ProposalsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ProposalsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submissionCount, setSubmissionCount] = useState<Record<string, number>>({});

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') as ProposalStatus | null;
  const category = searchParams.get('category');
  const search = searchParams.get('search') || '';

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      });

      if (status) params.set('status', status);
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/proposals?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to fetch node data');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, category, search]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  useEffect(() => {
    const fetchSubmissionCounts = async () => {
      const counts: Record<string, number> = {};
      for (const p of data?.items || []) {
        try {
          const response = await fetch(`/api/admin/proposals/${p._id}/submissions`);
          if (response.ok) {
            const result = await response.json();
            counts[p._id] = result.data.submissions?.length || 0;
          }
        } catch {
          counts[p._id] = 0;
        }
      }
      setSubmissionCount(counts);
    };

    if (data?.items) fetchSubmissionCounts();
  }, [data?.items]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handleStatusFilter = (newStatus: ProposalStatus | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    params.delete('page');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handleCategoryFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    params.delete('page');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Execute deletion protocol for this RFP node?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/proposals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Operation failed');
      }

      toast.success('RFP Node purged from registry');
      fetchProposals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'System rejection identified');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ProposalStatus) => {
    let newStatus: ProposalStatus;

    if (currentStatus === 'DRAFT') {
      newStatus = 'OPEN';
    } else if (currentStatus === 'OPEN') {
      newStatus = 'CLOSED';
    } else {
      return;
    }

    try {
      const response = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Update failed');
      }

      toast.success(`RFP Stream ${newStatus.toLowerCase()} active`);
      fetchProposals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registry conflict encountered');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">RFP Control Node</Badge>
            {data?.pagination && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{data.pagination.total} Operational Streams</span>}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Proposal Ecosystem
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Manage corporate biddings, technical tenders, and vendor submission cycles from a centralized governance hub.
          </p>
        </div>
        <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 shadow-xl transition-all hover:scale-105" asChild>
          <Link href="/admin/proposals/create">
            <Plus className="h-5 w-5" />
            Deploy New RFP
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col xl:flex-row gap-6 items-center">
            <form onSubmit={handleSearch} className="relative flex-1 group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Analyze RFP titles, descriptors or parameters..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-14 h-16 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium"
              />
            </form>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              <Select
                value={status || 'all'}
                onValueChange={(val) => handleStatusFilter(val as ProposalStatus | 'all')}
              >
                <SelectTrigger className="h-16 w-full sm:w-[220px] rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 opacity-50" />
                    <SelectValue placeholder="Stream Pulse" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-2 border-2">
                  <SelectItem value="all" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Global View</SelectItem>
                  <SelectItem value="DRAFT" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10 text-zinc-500">Node Idle (Draft)</SelectItem>
                  <SelectItem value="OPEN" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10 text-emerald-600">Active Stream (Open)</SelectItem>
                  <SelectItem value="CLOSED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10 text-rose-500">Link Severed (Closed)</SelectItem>
                  <SelectItem value="AWARDED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10 text-indigo-600">Nexus Awarded</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={category || 'all'}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger className="h-16 w-full sm:w-[240px] rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 opacity-50" />
                    <SelectValue placeholder="Sector Cluster" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-2 border-2">
                  <SelectItem value="all" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">All Clusters</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">
                      {cat.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-16 w-16 min-w-[64px] rounded-2xl border-2 group hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <Filter className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Stream */}
      <div className="space-y-8 relative">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] h-48 w-full" />
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent text-center py-32">
            <CardContent className="flex flex-col items-center gap-6">
              <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                <Briefcase className="h-10 w-10 text-zinc-300" />
              </div>
              <div className="max-w-md">
                <p className="text-2xl font-black uppercase tracking-tight">Ecosystem Silent</p>
                <p className="text-zinc-500 font-medium mt-2">No active RFP streams identified within current parameters. Initialize a new opportunity node to resume operations.</p>
              </div>
              <Button className="rounded-xl h-12 px-6 font-bold" asChild>
                <Link href="/admin/proposals/create">Initialize First RFP</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {data?.items.map((proposal) => (
              <Card
                key={proposal._id}
                className={`group rounded-[2.5rem] border-2 bg-white dark:bg-zinc-950 transition-all hover:shadow-2xl overflow-hidden relative ${proposal._id === searchParams.get('highlight') ? 'border-indigo-500 shadow-indigo-500/10' : 'border-zinc-100 dark:border-zinc-900 hover:border-indigo-500/30'
                  }`}
              >
                <CardContent className="p-10 lg:p-12 relative z-10">
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge variant={statusVariants[proposal.status]} className="font-black uppercase tracking-widest text-[10px] px-3.5 py-1 rounded-full border-2">
                          {statusLabels[proposal.status]}
                        </Badge>
                        <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-tighter h-7 border-zinc-200 dark:border-zinc-800">
                          NODE: {proposal._id.slice(-6).toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
                          <Layers className="h-3 w-3" />
                          {proposal.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-3xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors cursor-pointer">
                          {proposal.title}
                        </h3>
                        <p className="text-zinc-500 font-medium leading-relaxed line-clamp-2 text-lg">
                          {proposal.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/5">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Resource Allocation</p>
                            <p className="font-black text-sm">${proposal.budgetMin.toLocaleString()} - ${proposal.budgetMax.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/5">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transmission End</p>
                            <p className="font-black text-sm">{new Date(proposal.deadline).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/5">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nexus Submissions</p>
                            <p className="font-black text-sm">{submissionCount[proposal._id] || 0} Entities Received</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:w-64 border-l-0 lg:border-l border-zinc-100 dark:border-zinc-900 pl-0 lg:pl-10">
                      <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/10 transition-all hover:scale-[1.03]">
                        <Link href={`/admin/proposals/${proposal._id}`} className="gap-2">
                          <Eye className="h-5 w-5" />
                          Inspect Node
                        </Link>
                      </Button>

                      <div className="flex items-center gap-2 w-full">
                        {proposal.status === 'DRAFT' && (
                          <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-tighter text-[10px] hover:bg-zinc-50 dark:hover:bg-zinc-900">
                            <Link href={`/admin/proposals/${proposal._id}/edit`}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Reconfigure
                            </Link>
                          </Button>
                        )}

                        {(proposal.status === 'DRAFT' || proposal.status === 'OPEN') && (
                          <Button
                            onClick={() => handleToggleStatus(proposal._id, proposal.status)}
                            variant="outline"
                            className={`flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-tighter text-[10px] transition-all
                                  ${proposal.status === 'DRAFT' ? 'text-emerald-600 border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-rose-500 border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-950/20'}
                               `}
                            title={proposal.status === 'DRAFT' ? 'Activate RFP Node' : 'Terminate RFP Node'}
                          >
                            {proposal.status === 'DRAFT' ? <Send className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            {proposal.status === 'DRAFT' ? 'Activate' : 'Terminate'}
                          </Button>
                        )}

                        {proposal.status !== 'OPEN' && (
                          <Button
                            onClick={() => handleDelete(proposal._id)}
                            disabled={deletingId === proposal._id}
                            variant="destructive"
                            size="icon"
                            className="h-14 w-14 min-w-[56px] rounded-2xl shadow-xl shadow-rose-500/10 transition-all hover:scale-105"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        )}
                      </div>

                      {proposal.status === 'OPEN' && (
                        <Button asChild variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase tracking-tight text-[10px] shadow-sm border-2">
                          <Link href={`/admin/proposals/${proposal._id}/submissions`}>
                            Audit Submissions ({submissionCount[proposal._id] || 0})
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
                {/* Decorative gradients */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 -translate-y-1/2 translate-x-1/3
                   ${proposal.status === 'OPEN' ? 'bg-emerald-500' : proposal.status === 'AWARDED' ? 'bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-800'}
                `} />
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-10 mt-12 border-t-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-[2.5rem]">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Nexus Batch <span className="text-zinc-600 dark:text-zinc-300 mx-2">{(data.pagination.page - 1) * data.pagination.pageSize + 1} - {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)}</span> of <span className="text-zinc-600 dark:text-zinc-300 ml-1">{data.pagination.total}</span> RFP Sequences
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={!data.pagination.hasPrev}
                className="h-12 w-12 rounded-2xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-1 font-black text-sm uppercase text-zinc-500 bg-white dark:bg-zinc-950 px-6 h-12 rounded-2xl border-2 shadow-sm">
                <span className="text-primary">{data.pagination.page}</span>
                <span className="opacity-30 mx-2">/</span>
                <span>{data.pagination.totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={!data.pagination.hasNext}
                className="h-12 w-12 rounded-2xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Infrastructure Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {[
          { label: 'Blockchain Compliance', icon: ShieldCheck, desc: 'Every RFP interaction is immutable and verified within the system node.' },
          { label: 'Cloud Distribution', icon: Send, desc: 'Optimized delivery to global vendor sectors via distributed API networks.' },
          { label: 'Decision Logic', icon: CheckCircle, desc: 'Automated scoring engine enables rapid and unbiased partner evaluation.' }
        ].map((item) => (
          <Card key={item.label} className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 transition-colors">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-black uppercase tracking-tight text-xs">{item.label}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase leading-relaxed">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminProposalsPage() {
  return (
    <Suspense fallback={<div className="space-y-10">
      <div className="h-24 bg-muted animate-pulse rounded-[2rem]" />
      <div className="h-48 bg-muted animate-pulse rounded-[2rem] w-full" />
      <div className="h-48 bg-muted animate-pulse rounded-[2rem] w-full" />
    </div>}>
      <ProposalsPageContent />
    </Suspense>
  );
}
