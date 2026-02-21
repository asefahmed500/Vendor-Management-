'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Award,
  MessageSquare,
  Save,
  Eye,
  Clock,
  ChevronLeft,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Briefcase,
  Layers,
  Loader2,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, IProposalSubmission, IProposalRanking, ProposalStatus } from '@/lib/types/proposal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const statusVariants: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

const statusLabels: Record<string, string> = {
  SUBMITTED: 'Received',
  UNDER_REVIEW: 'Auditing',
  ACCEPTED: 'Nexus Won',
  REJECTED: 'Offline',
};

interface RankingFormData {
  rank: number;
  score: number;
  technicalScore: number;
  financialScore: number;
  experienceScore: number;
  comments: string;
  strengths: string[];
  weaknesses: string[];
}

const emptyRanking: RankingFormData = {
  rank: 0,
  score: 0,
  technicalScore: 0,
  financialScore: 0,
  experienceScore: 0,
  comments: '',
  strengths: [],
  weaknesses: [],
};

export default function ProposalSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<IProposal | null>(null);
  const [submissions, setSubmissions] = useState<(IProposalSubmission & {
    vendor?: { companyName: string; contactPerson: string; email: string };
    ranking?: IProposalRanking;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [rankingForm, setRankingForm] = useState<Record<string, RankingFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}/submissions`);
      if (response.ok) {
        const result = await response.json();
        setProposal(result.data.proposal);
        setSubmissions(result.data.submissions);

        const initialRankings: Record<string, RankingFormData> = {};
        result.data.submissions.forEach((sub: IProposalSubmission & {
          ranking?: IProposalRanking;
        }) => {
          if (sub.ranking) {
            initialRankings[sub._id] = {
              rank: sub.ranking.rank,
              score: sub.ranking.score,
              technicalScore: sub.ranking.technicalScore,
              financialScore: sub.ranking.financialScore,
              experienceScore: sub.ranking.experienceScore,
              comments: sub.ranking.comments || '',
              strengths: sub.ranking.strengths || [],
              weaknesses: sub.ranking.weaknesses || [],
            };
          } else {
            initialRankings[sub._id] = { ...emptyRanking };
          }
        });
        setRankingForm(initialRankings);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Nexus connection refused');
    } finally {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleRankingChange = (submissionId: string, field: keyof RankingFormData, value: string | number | string[]) => {
    setRankingForm((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      },
    }));
  };

  const addStrength = () => {
    if (selectedSubmission && newStrength.trim()) {
      setRankingForm((prev) => ({
        ...prev,
        [selectedSubmission]: {
          ...prev[selectedSubmission],
          strengths: [...(prev[selectedSubmission]?.strengths || []), newStrength.trim()],
        },
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    if (selectedSubmission) {
      setRankingForm((prev) => ({
        ...prev,
        [selectedSubmission]: {
          ...prev[selectedSubmission],
          strengths: prev[selectedSubmission].strengths.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const addWeakness = () => {
    if (selectedSubmission && newWeakness.trim()) {
      setRankingForm((prev) => ({
        ...prev,
        [selectedSubmission]: {
          ...prev[selectedSubmission],
          weaknesses: [...(prev[selectedSubmission]?.weaknesses || []), newWeakness.trim()],
        },
      }));
      setNewWeakness('');
    }
  };

  const removeWeakness = (index: number) => {
    if (selectedSubmission) {
      setRankingForm((prev) => ({
        ...prev,
        [selectedSubmission]: {
          ...prev[selectedSubmission],
          weaknesses: prev[selectedSubmission].weaknesses.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const saveRanking = async (submissionId: string) => {
    const ranking = rankingForm[submissionId];
    if (ranking.rank < 1 || ranking.score < 1) {
      toast.error('Rank and Score verification required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}/submissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rank',
          submissionId,
          ...ranking,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Calibration failed');
      }

      toast.success('Ranking synchronized');
      fetchSubmissions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Calibration error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}/submissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          submissionId,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Status override failed');
      }

      toast.success(`Submission ${status.toLowerCase()}`);
      fetchSubmissions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status override error');
    }
  };

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

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const rankA = a.ranking?.rank ?? 999;
    const rankB = b.ranking?.rank ?? 999;
    return rankA - rankB;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div className="flex items-start gap-5">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 shrink-0" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">
                Audit Flow
              </Badge>
              {proposal && (
                <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-tighter h-7 border-zinc-200 dark:border-zinc-800">
                  NODE: {proposal._id.slice(-6).toUpperCase()}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
              Submission Audit
            </h1>
            <p className="text-zinc-500 max-w-xl font-medium">
              Reviewing <span className="text-zinc-800 dark:text-zinc-200 font-bold">{submissions.length} transmissions</span> for the active RFP stream.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Submissions Sidebar List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2">
                <Layers className="h-5 w-5 text-zinc-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Transmission Feed</h2>
            </div>
          </div>

          <div className="space-y-4">
            {sortedSubmissions.map((submission) => {
              const currentRanking = rankingForm[submission._id];
              const hasRanking = currentRanking?.rank > 0;
              const isSelected = selectedSubmission === submission._id;

              return (
                <Card
                  key={submission._id}
                  onClick={() => setSelectedSubmission(submission._id)}
                  className={`group rounded-[2rem] border-2 cursor-pointer transition-all overflow-hidden ${isSelected ? 'border-primary shadow-xl shadow-primary/10' : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-200'
                    }`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {hasRanking && (
                          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center text-xs font-black">
                            #{currentRanking.rank}
                          </div>
                        )}
                        <div>
                          <p className="font-black uppercase tracking-tight text-sm truncate max-w-[150px]">
                            {submission.vendor?.companyName || 'Unknown Entity'}
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">{submission.vendor?.contactPerson || 'Anonymous'}</p>
                        </div>
                      </div>
                      <Badge variant={statusVariants[submission.status]} className="font-black uppercase tracking-widest text-[8px] px-2 h-6 border-2">
                        {statusLabels[submission.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-zinc-400" />
                        <span className="text-xs font-black">${submission.proposedAmount.toLocaleString()}</span>
                      </div>
                      {hasRanking && (
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className={`text-xs font-black ${getScoreColor(currentRanking.score)}`}>
                            {currentRanking.score}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Audit Details Panel */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              {(() => {
                const submission = submissions.find((s) => s._id === selectedSubmission);
                if (!submission) return null;
                const ranking = rankingForm[selectedSubmission];

                return (
                  <>
                    {/* Vendor & Submission Info Card */}
                    <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
                      <CardContent className="p-8 md:p-12 space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-zinc-50 dark:border-zinc-900 pb-8">
                          <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-500/10 text-indigo-600 flex items-center justify-center border-2 border-indigo-500/10">
                              <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Entity Signature</p>
                              <h2 className="text-3xl font-black uppercase tracking-tighter">{submission.vendor?.companyName}</h2>
                              <p className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2 mt-1">
                                {submission.vendor?.contactPerson} <span className="h-1 w-1 rounded-full bg-zinc-300" /> {submission.vendor?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {submission.status !== 'ACCEPTED' && (
                              <Button
                                onClick={() => updateSubmissionStatus(submission._id, 'ACCEPTED')}
                                className="h-12 px-6 rounded-xl font-black uppercase tracking-tight text-xs bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                            )}
                            {submission.status !== 'REJECTED' && (
                              <Button
                                onClick={() => updateSubmissionStatus(submission._id, 'REJECTED')}
                                variant="destructive"
                                className="h-12 px-6 rounded-xl font-black uppercase tracking-tight text-xs shadow-lg shadow-rose-500/20"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              <DollarSign className="h-3 w-3" /> Bid Allocation
                            </div>
                            <p className="text-3xl font-black tracking-tighter uppercase">${submission.proposedAmount.toLocaleString()}</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              <Users className="h-3 w-3" /> Team Unit
                            </div>
                            <p className="text-3xl font-black tracking-tighter uppercase">{submission.teamSize || '1'} UNITS</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              <Clock className="h-3 w-3" /> Duration
                            </div>
                            <p className="text-lg font-bold tracking-tight uppercase leading-none">{submission.timeline}</p>
                          </div>
                        </div>

                        <Separator className="bg-zinc-50 dark:bg-zinc-900" />

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                              <Target className="h-3 w-3" /> Mission approach
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{submission.approach}</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                              <FileText className="h-3 w-3" /> Technical descriptor
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{submission.description}</p>
                          </div>
                        </div>

                        {submission.attachments && submission.attachments.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                              <Layers className="h-5 w-5 text-zinc-400" />
                              <h2 className="text-sm font-black uppercase tracking-widest">Resource Vault</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {submission.attachments.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl hover:bg-white hover:shadow-xl hover:border-zinc-100 transition-all border-2 border-transparent group"
                                >
                                  <FileText className="h-6 w-6 text-zinc-400 group-hover:text-primary" />
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">External Resource</p>
                                    <p className="font-bold text-sm truncate">Link Node {idx + 1}</p>
                                  </div>
                                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-primary" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Ranking & Calibration Panel */}
                    <Card className="rounded-[2.5rem] border-2 border-zinc-950 bg-black text-white shadow-2xl overflow-hidden">
                      <CardContent className="p-8 md:p-12 space-y-10">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                              <Award className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Evaluation Calibration</h2>
                          </div>
                          <Badge variant="outline" className="border-white/20 text-white/40 font-black uppercase text-[10px] px-3">Protocol Active</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Rank Position</Label>
                            <Input
                              type="number"
                              min="1"
                              value={ranking.rank || ''}
                              onChange={(e) => handleRankingChange(selectedSubmission, 'rank', parseInt(e.target.value) || 0)}
                              className="h-16 rounded-2xl border-white/10 bg-white/5 font-black text-2xl focus-visible:ring-primary/40 text-white text-center"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Overall Nexus Score</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={ranking.score || ''}
                              onChange={(e) => handleRankingChange(selectedSubmission, 'score', parseInt(e.target.value) || 0)}
                              className="h-16 rounded-2xl border-white/10 bg-white/5 font-black text-2xl focus-visible:ring-primary/40 text-white text-center"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Technical Matrix</Label>
                            <Input
                              type="number"
                              value={ranking.technicalScore || ''}
                              onChange={(e) => handleRankingChange(selectedSubmission, 'technicalScore', parseInt(e.target.value) || 0)}
                              className="h-14 rounded-xl border-white/10 bg-white/5 font-bold text-center text-white"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Financial Index</Label>
                            <Input
                              type="number"
                              value={ranking.financialScore || ''}
                              onChange={(e) => handleRankingChange(selectedSubmission, 'financialScore', parseInt(e.target.value) || 0)}
                              className="h-14 rounded-xl border-white/10 bg-white/5 font-bold text-center text-white"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Experience Layer</Label>
                            <Input
                              type="number"
                              value={ranking.experienceScore || ''}
                              onChange={(e) => handleRankingChange(selectedSubmission, 'experienceScore', parseInt(e.target.value) || 0)}
                              className="h-14 rounded-xl border-white/10 bg-white/5 font-bold text-center text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Audit Synthesis</Label>
                          <Textarea
                            value={ranking.comments}
                            onChange={(e) => handleRankingChange(selectedSubmission, 'comments', e.target.value)}
                            rows={4}
                            placeholder="Provide technical feedback and rationale..."
                            className="p-6 rounded-2xl border-white/10 bg-white/5 font-medium focus-visible:ring-primary/40 text-white resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1">Technical Strengths</Label>
                            <div className="flex gap-3">
                              <Input
                                value={newStrength}
                                onChange={(e) => setNewStrength(e.target.value)}
                                placeholder="Add strength node..."
                                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                              />
                              <Button onClick={addStrength} size="icon" className="h-12 w-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl shrink-0">
                                <Plus className="h-5 w-5" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {ranking.strengths.map((str, i) => (
                                <div key={i} className="flex items-center justify-between bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight">{str}</span>
                                  <button onClick={() => removeStrength(i)} className="text-emerald-500 hover:text-white">
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-rose-400 ml-1">Operational Weaknesses</Label>
                            <div className="flex gap-3">
                              <Input
                                value={newWeakness}
                                onChange={(e) => setNewWeakness(e.target.value)}
                                placeholder="Add weakness node..."
                                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                              />
                              <Button onClick={addWeakness} size="icon" className="h-12 w-12 bg-rose-500 hover:bg-rose-600 rounded-xl shrink-0">
                                <Plus className="h-5 w-5" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {ranking.weaknesses.map((wk, i) => (
                                <div key={i} className="flex items-center justify-between bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
                                  <span className="text-xs font-bold text-rose-400 uppercase tracking-tight">{wk}</span>
                                  <button onClick={() => removeWeakness(i)} className="text-rose-500 hover:text-white">
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-white/10">
                          <Button
                            onClick={() => saveRanking(selectedSubmission)}
                            disabled={isSaving}
                            className="w-full h-16 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 bg-white text-black hover:bg-zinc-200"
                          >
                            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                              <>
                                <Save className="h-5 w-5 mr-3" />
                                Synchronize Audit Calibration
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          ) : (
            <Card className="h-full min-h-[600px] rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-900 bg-transparent flex flex-col items-center justify-center text-center p-12">
              <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 mb-6">
                <ShieldCheck className="h-10 w-10 text-zinc-300" />
              </div>
              <p className="text-xl font-black uppercase tracking-tighter">Diagnostic Standby</p>
              <p className="text-zinc-500 font-medium mt-2 max-w-xs">Select a transmission from the registry to initiate a high-fidelity audit.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
