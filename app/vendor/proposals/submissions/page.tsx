'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  TrendingUp,
  Award,
  ChevronLeft,
  ArrowUpRight,
  Target,
  Layers,
  Briefcase,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposalSubmission } from '@/lib/types/proposal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const statusVariants: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  DRAFT: 'default',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft Node',
  SUBMITTED: 'Received',
  UNDER_REVIEW: 'Auditing',
  ACCEPTED: 'Nexus Won',
  REJECTED: 'Offline',
};

interface SubmissionWithProposal extends IProposalSubmission {
  proposal: {
    _id: string;
    title: string;
    category: string;
    budgetMin: number;
    budgetMax: number;
    deadline: Date;
    status: string;
  };
  ranking?: {
    rank: number;
    score: number;
    technicalScore: number;
    financialScore: number;
    experienceScore: number;
    comments?: string;
    strengths?: string[];
    weaknesses?: string[];
  };
}

interface SubmissionsResponse {
  submissions: SubmissionWithProposal[];
  stats: {
    total: number;
    draft: number;
    submitted: number;
    underReview: number;
    accepted: number;
    rejected: number;
    averageScore: number;
    totalEarnings: number;
  };
}

export default function VendorSubmissionsPage() {
  const router = useRouter();
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/vendor/proposals/submissions');
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Nexus connection refused');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Submission Registry</Badge>
            {!isLoading && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{data?.submissions.length} Total Transmissions recorded</span>}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Submission Vault
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Monitor the status of your technical tenders, track evaluator scores, and review feedback from corporate nodes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-xl h-12 px-6 font-black uppercase tracking-tight gap-2 shadow-sm border-2">
            <Link href="/vendor/proposals">
              Browse More Nodes
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Transmissions</p>
            <Layers className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-4xl font-black tracking-tighter">{data?.stats.total || 0}</p>
        </Card>
        <Card className="rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Audit</p>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-4xl font-black tracking-tighter">{(data?.stats.submitted || 0) + (data?.stats.underReview || 0)}</p>
        </Card>
        <Card className="rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-emerald-500 text-white p-6 shadow-xl shadow-emerald-500/10 dark:bg-emerald-600">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Genesis Wins</p>
            <Award className="h-5 w-5 text-emerald-100" />
          </div>
          <p className="text-4xl font-black tracking-tighter">{data?.stats.accepted || 0}</p>
        </Card>
        <Card className="rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-black text-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Avg. Performance</p>
            <TrendingUp className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-4xl font-black tracking-tighter">{data?.stats.averageScore?.toFixed(1) || '0.0'}<span className="text-base text-zinc-500 ml-1">/100</span></p>
        </Card>
      </div>

      {/* Submissions Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2">
            <Briefcase className="h-5 w-5 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Transmission Registry</h2>
        </div>

        {!data?.submissions || data.submissions.length === 0 ? (
          <Card className="rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-900 bg-transparent py-32 text-center">
            <CardContent>
              <FileText className="h-16 w-16 text-zinc-200 mx-auto mb-6" />
              <p className="text-xl font-black uppercase tracking-tight">Registry Vacant</p>
              <p className="text-zinc-500 font-medium mt-2">Access the marketplace to initiate discovery.</p>
              <Button asChild className="mt-8 rounded-xl h-12 font-black uppercase tracking-tight shadow-xl shadow-primary/20">
                <Link href="/vendor/proposals">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {data.submissions.map((submission) => {
              const hasRanking = !!submission.ranking;
              return (
                <Card key={submission._id} className="group rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-primary/20 hover:shadow-2xl transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
                      {/* Side Meta */}
                      <div className="lg:w-1/4 space-y-6 lg:border-r lg:border-zinc-50 lg:dark:border-zinc-900 lg:pr-10">
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Internal Node ID</p>
                          <p className="font-black uppercase tracking-tighter truncate">{submission._id.slice(-10).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Transmission Date</p>
                          <p className="font-bold text-sm">{new Date(submission.submittedAt || submission.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="pt-4">
                          <Badge variant={statusVariants[submission.status]} className="font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-lg border-2">
                            {statusLabels[submission.status]}
                          </Badge>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 space-y-6">
                        <div>
                          <p className="text-[10px] font-black uppercase text-indigo-500 mb-1">{submission.proposal.category.replace(/_/g, ' ')}</p>
                          <h3 className="text-3xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
                            {submission.proposal.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                          <div>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Bid Allocation</p>
                            <p className="font-black text-xl">${submission.proposedAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">RFP Range</p>
                            <p className="font-bold text-sm text-zinc-500">${submission.proposal.budgetMin.toLocaleString()} - ${submission.proposal.budgetMax.toLocaleString()}</p>
                          </div>
                          {submission.teamSize && (
                            <div>
                              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Op Unit Size</p>
                              <p className="font-bold text-sm text-zinc-500">{submission.teamSize} DEPLOYED</p>
                            </div>
                          )}
                        </div>

                        {hasRanking && submission.ranking?.comments && (
                          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border-2 border-transparent group-hover:border-zinc-50 transition-all">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              Evaluator Synthesis
                            </p>
                            <p className="text-sm font-medium leading-relaxed italic">"{submission.ranking.comments}"</p>
                          </div>
                        )}
                      </div>

                      {/* Feedback Action */}
                      <div className="lg:w-1/5 flex flex-col items-center lg:items-end justify-center gap-6">
                        {hasRanking ? (
                          <div className="text-center lg:text-right space-y-2">
                            <div className={`text-5xl font-black tracking-tighter ${getScoreColor(submission.ranking!.score)}`}>
                              {submission.ranking!.score}
                            </div>
                            <div className="flex items-center gap-2 justify-center lg:justify-end">
                              <Badge variant="outline" className="font-black uppercase text-[8px] border-zinc-200 dark:border-zinc-800">RANK #{submission.ranking!.rank}</Badge>
                              <p className="text-[10px] font-black uppercase text-zinc-400">PERFORMANCE</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center lg:text-right italic">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-loose">Evaluation Sync<br />In Progress</p>
                          </div>
                        )}
                        <Button asChild variant="outline" className="h-14 w-14 rounded-2xl border-2 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shrink-0">
                          <Link href={`/vendor/proposals/${submission.proposal._id}`}>
                            <ArrowUpRight className="h-6 w-6" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Accents */}
                    <div className={`h-1.5 w-full bg-zinc-50 dark:bg-zinc-900 relative`}>
                      <div className={`absolute top-0 left-0 h-full bg-primary transition-all duration-1000 w-[${hasRanking ? submission.ranking!.score : 10}%]`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Context Footer */}
      {!isLoading && data?.submissions && data.submissions.length > 0 && (
        <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-zinc-950 text-white overflow-hidden shadow-2xl shadow-zinc-950/20">
          <CardContent className="py-12 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Ecosystem Earnings</h3>
              <p className="text-zinc-400 font-medium uppercase text-[10px] tracking-widest">Total Value of Accepted Transmissions</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-5xl lg:text-6xl font-black tracking-tighter text-emerald-400">
                ${(data?.stats.totalEarnings || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black uppercase text-[10px]">VERIFIED ASSETS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
