'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TrendingUp,
  Award,
  ArrowUpRight,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposalSubmission } from '@/lib/types/proposal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
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
        toast.error('Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-2">My Submissions</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Proposal Submissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your submitted proposals
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/vendor/proposals">
            Browse Proposals
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{data?.stats.total || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-2xl font-bold">{(data?.stats.submitted || 0) + (data?.stats.underReview || 0)}</p>
          </CardContent>
        </Card>
        <Card className="border-border border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <p className="text-2xl font-bold text-emerald-600">{data?.stats.accepted || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <p className="text-2xl font-bold">{data?.stats.averageScore?.toFixed(1) || '0.0'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold">Your Submissions</h2>

        {!data?.submissions || data.submissions.length === 0 ? (
          <Card className="border-dashed border-border py-12 text-center">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">No submissions yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse available RFPs and submit your proposals
              </p>
              <Button asChild className="mt-4">
                <Link href="/vendor/proposals">Browse Proposals</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.submissions.map((submission) => {
              const hasRanking = !!submission.ranking;
              
              return (
                <Card key={submission._id} className="border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{submission.proposal.category.replace(/_/g, ' ')}</Badge>
                          <Badge variant={statusVariants[submission.status]}>
                            {statusLabels[submission.status]}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{submission.proposal.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Proposed: ${submission.proposedAmount.toLocaleString()}</span>
                          <span>Budget: ${submission.proposal.budgetMin.toLocaleString()} - ${submission.proposal.budgetMax.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {hasRanking ? (
                          <div className="text-center">
                            <p className={`text-3xl font-bold ${getScoreColor(submission.ranking!.score)}`}>
                              {submission.ranking!.score}
                            </p>
                            <p className="text-xs text-muted-foreground">Rank #{submission.ranking!.rank}</p>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Clock className="h-6 w-6 mx-auto mb-1" />
                            <p className="text-xs">Under Review</p>
                          </div>
                        )}
                        
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/vendor/proposals/${submission.proposal._id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {hasRanking && submission.ranking?.comments && (
                      <Separator className="mt-4" />
                    )}
                    {hasRanking && submission.ranking?.comments && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Evaluator Feedback:</p>
                        <p className="text-sm text-muted-foreground italic">"{submission.ranking!.comments}"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {data?.stats.totalEarnings && data.stats.totalEarnings > 0 && (
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${data.stats.totalEarnings.toLocaleString()}
              </p>
            </div>
            <Award className="h-8 w-8 text-emerald-600" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
