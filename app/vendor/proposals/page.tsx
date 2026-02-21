'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Briefcase,
  DollarSign,
  Clock,
  Send,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Target,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  Award,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal } from '@/lib/types/proposal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

const categoryColors: Record<string, string> = {
  IT_SERVICES: 'indigo',
  CONSTRUCTION: 'amber',
  CONSULTING: 'sky',
  SUPPLY_CHAIN: 'emerald',
  MARKETING: 'rose',
  MANUFACTURING: 'zinc',
  PROFESSIONAL_SERVICES: 'violet',
  OTHER: 'cyan',
};

interface ProposalWithSubmissionStatus extends IProposal {
  submissionStatus?: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  hasSubmitted: boolean;
}

function VendorProposalsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [proposals, setProposals] = useState<ProposalWithSubmissionStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category');
  const search = searchParams.get('search') || '';

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const response = await fetch(`/api/vendor/proposals?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setProposals(result.data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Nexus connection refused. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    router.push(`/vendor/proposals?${params.toString()}`);
  };

  const handleCategoryFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    router.push(`/vendor/proposals?${params.toString()}`);
  };

  const getTimeRemaining = (deadline: Date | string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Terminated';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}D REMAINING`;
    if (hours > 0) return `${hours}H REMAINING`;
    return 'LINK CLOSING';
  };

  const isDeadlineNear = (deadline: Date | string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff < 48 * 60 * 60 * 1000; // Less than 48 hours
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Opportunity Marketplace</Badge>
            {!isLoading && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{proposals.length} Open RFPs identified</span>}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Bidding Nexus
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Acquire new corporate contracts by submitting technical proposals. Our algorithm matches your profile with high-probability RFP streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl h-12 px-6 font-black uppercase tracking-tight gap-2 shadow-sm border-2">
            <Award className="h-4 w-4" />
            Winning Tips
          </Button>
        </div>
      </div>

      {/* Filter Hub */}
      <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <form onSubmit={handleSearch} className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Scan marketplace for RFP titles or keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-16 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium"
              />
            </form>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <select
                value={category || 'all'}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="h-16 w-full md:w-[260px] rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs px-6 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">Global Clusters</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <Button className="h-16 w-16 min-w-[64px] rounded-2xl border-2 bg-zinc-950 text-white shadow-xl hover:bg-zinc-800 transition-all group">
                <Filter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Marketplace */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] h-[500px] w-full" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <Card className="rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent py-32 text-center">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
              <PlusCircle className="h-10 w-10 text-zinc-300" />
            </div>
            <div className="max-w-md">
              <p className="text-2xl font-black uppercase tracking-tight">Ecosystem Silent</p>
              <p className="text-zinc-500 font-medium mt-2">Current parameters yielded no RFP nodes. Adjust filters or check back during next sync cycle.</p>
            </div>
            <Button variant="outline" className="rounded-xl h-12 font-black uppercase tracking-tight" onClick={() => router.push('/vendor/proposals')}>
              Refresh Nexus
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {proposals.map((proposal) => {
            const color = categoryColors[proposal.category] || 'zinc';
            return (
              <Card
                key={proposal._id}
                className="group rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-2xl hover:border-primary/30 transition-all overflow-hidden flex flex-col relative"
              >
                <CardContent className="p-8 lg:p-10 flex-1 flex flex-col relative z-10">
                  {/* Visual Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className={`h-14 w-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-600 border border-${color}-500/10 group-hover:scale-110 transition-transform shadow-inner`}>
                      <Briefcase className="h-7 w-7" />
                    </div>
                    {isDeadlineNear(proposal.deadline) && (
                      <Badge variant="danger" className="font-black uppercase text-[9px] tracking-widest px-3 py-1 flex items-center gap-1.5 animate-pulse rounded-lg border-2">
                        <AlertCircle className="h-3 w-3" />
                        Critical Window
                      </Badge>
                    )}
                  </div>

                  {/* Core Info */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-black uppercase tracking-widest text-[9px] px-2.5 py-0.5 whitespace-nowrap">
                        {proposal.category.replace(/_/g, ' ')}
                      </Badge>
                      <span className="h-px bg-zinc-100 dark:bg-zinc-900 flex-1" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors leading-tight min-h-[4rem] cursor-pointer">
                      {proposal.title}
                    </h3>
                    <p className="text-zinc-500 font-medium text-sm leading-relaxed line-clamp-3">
                      {proposal.description}
                    </p>
                  </div>

                  {/* Allocation Stats */}
                  <div className="space-y-3 mb-10 bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-[2rem] border-2 border-white dark:border-zinc-900 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-black uppercase text-zinc-400">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        Resource Max
                      </div>
                      <span className="font-black tracking-tight">${proposal.budgetMax.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-black uppercase text-zinc-400">
                        <Clock className={`h-4 w-4 ${isDeadlineNear(proposal.deadline) ? 'text-rose-500' : 'text-primary'}`} />
                        Pulse Remaining
                      </div>
                      <span className={`font-black tracking-tight text-xs uppercase ${isDeadlineNear(proposal.deadline) ? 'text-rose-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {getTimeRemaining(proposal.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Matrix */}
                  <div className="mb-10 flex-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      Technical Matrix
                    </p>
                    <div className="space-y-3">
                      {proposal.requirements.slice(0, 2).map((req, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 line-clamp-1">{req}</span>
                        </div>
                      ))}
                      {proposal.requirements.length > 2 && (
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter ml-7 mt-2">+{proposal.requirements.length - 2} more validation layers</p>
                      )}
                    </div>
                  </div>

                  {/* Primary Interaction */}
                  <div className="mt-auto pt-6 border-t-2 border-zinc-50 dark:border-zinc-900 border-dashed">
                    {proposal.hasSubmitted ? (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Submission State</p>
                          <Badge variant="secondary" className="font-black uppercase tracking-tighter text-[10px] px-3 py-1 rounded-lg border-2">
                            {proposal.submissionStatus === 'DRAFT' ? 'DRAFT_NODE' :
                              proposal.submissionStatus === 'SUBMITTED' ? 'RECEIVED' :
                                proposal.submissionStatus === 'UNDER_REVIEW' ? 'AUDITING' :
                                  proposal.submissionStatus === 'ACCEPTED' ? 'NEXUS_WON' :
                                    proposal.submissionStatus === 'REJECTED' ? 'OFFLINE' : 'RECEIVED'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/vendor/proposals/${proposal._id}`)}
                          className="font-black uppercase text-[10px] tracking-tight hover:bg-primary/10 hover:text-primary rounded-xl px-5 h-12 border-transparent hover:border-primary/20 border"
                        >
                          {proposal.submissionStatus === 'DRAFT' ? 'Resume Link' : 'Audit Details'}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => router.push(`/vendor/proposals/${proposal._id}`)}
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 gap-3 group/btn hover:scale-[1.02] transition-transform"
                      >
                        <PlusCircle className="h-5 w-5" />
                        Transmit Proposal
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Status Bar */}
                <div className="h-2 bg-zinc-50 dark:bg-zinc-900 w-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${isDeadlineNear(proposal.deadline) ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-primary'}`}
                    style={{
                      width: `${Math.max(
                        5,
                        Math.min(
                          100,
                          ((new Date(proposal.deadline).getTime() - Date.now()) /
                            (30 * 24 * 60 * 60 * 1000)) *
                          100
                        )
                      )}%`,
                    }}
                  />
                </div>

                {/* Visual decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl pointer-events-none`} />
              </Card>
            );
          })}
        </div>
      )}

      {/* Synchronicity Footer */}
      {!isLoading && proposals.length > 0 && (
        <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
          <CardContent className="py-8">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-900">
                  <Layers className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Stream</p>
                  <p className="font-black text-sm uppercase tracking-tighter">{proposals.length} Op Units</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-900">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Your Status</p>
                  <p className="font-black text-sm uppercase tracking-tighter">{proposals.filter((p) => p.hasSubmitted).length} Transmitted</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-900">
                  <Target className="h-5 w-5 text-sky-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Availability</p>
                  <p className="font-black text-sm uppercase tracking-tighter">{proposals.filter((p) => !p.hasSubmitted).length} Open Links</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function VendorProposalsPage() {
  return (
    <Suspense fallback={<div className="space-y-12">
      <div className="h-24 bg-muted animate-pulse rounded-[2rem]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-muted animate-pulse rounded-[3rem]" />)}
      </div>
    </div>}>
      <VendorProposalsPageContent />
    </Suspense>
  );
}
