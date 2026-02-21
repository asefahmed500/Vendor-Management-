'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  DollarSign,
  Clock,
  Users,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
  ChevronLeft,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Briefcase,
  Layers,
  Loader2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, IProposalSubmission, ICreateSubmissionInput } from '@/lib/types/proposal';
import { createSubmissionSchema } from '@/lib/validation/schemas/proposal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const initialFormData: ICreateSubmissionInput = {
  proposalId: '',
  proposedAmount: 0,
  timeline: '',
  description: '',
  approach: '',
  teamSize: 1,
};

export default function VendorProposalSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<IProposal | null>(null);
  const [submission, setSubmission] = useState<IProposalSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ICreateSubmissionInput>(initialFormData);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ICreateSubmissionInput, string>>>({});

  const fetchProposal = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vendor/proposals/${proposalId}`);
      if (response.ok) {
        const result = await response.json();
        setProposal(result.data.proposal);
        if (result.data.submission) {
          setSubmission(result.data.submission);
          setFormData({
            proposalId: result.data.submission.proposalId,
            proposedAmount: result.data.submission.proposedAmount,
            timeline: result.data.submission.timeline,
            description: result.data.submission.description,
            approach: result.data.submission.approach,
            teamSize: result.data.submission.teamSize || 1,
          });
          setAttachments(result.data.submission.attachments || []);
        } else {
          setFormData((prev) => ({ ...prev, proposalId }));
        }
      } else if (response.status === 404) {
        toast.error('Proposal not found or closed');
        router.push('/vendor/proposals');
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      toast.error('Nexus connection refused');
    } finally {
      setIsLoading(false);
    }
  }, [proposalId, router]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'proposedAmount' || name === 'teamSize' ? Number(value) || 0 : value,
    }));
    if (name in formData) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      createSubmissionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: Partial<Record<keyof ICreateSubmissionInput, string>> = {};
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: (string | number)[], message: string }> };
        zodError.errors.forEach((err) => {
          const field = err.path[0] as keyof ICreateSubmissionInput;
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (status: 'DRAFT' | 'SUBMITTED') => {
    if (status === 'SUBMITTED' && !validateForm()) {
      toast.error('Submission validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/vendor/proposals/${proposalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Transmission failed');
      }

      toast.success(
        status === 'SUBMITTED'
          ? 'Proposal transmitted successfully'
          : 'Draft node synchronized'
      );

      if (status === 'SUBMITTED') {
        router.push('/vendor/proposals/submissions');
      } else {
        fetchProposal();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transmission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttachment = () => {
    const url = prompt('Enter attachment URL:');
    if (url) {
      setAttachments((prev) => [...prev, url]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isDeadlinePassed = proposal ? new Date(proposal.deadline) < new Date() : false;
  const cannotSubmit = isDeadlinePassed || proposal?.status !== 'OPEN' || submission?.status === 'ACCEPTED' || submission?.status === 'REJECTED';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <Card className="max-w-md mx-auto mt-12 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-900 bg-transparent py-20">
        <CardContent>
          <AlertCircle className="h-12 w-12 text-zinc-300 mx-auto mb-6" />
          <p className="text-xl font-black uppercase tracking-tighter">Node Not Found</p>
          <Button asChild variant="link" className="mt-4 font-bold uppercase tracking-widest text-[10px]">
            <Link href="/vendor/proposals">Back to Marketplace</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div className="flex items-start gap-5">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 shrink-0" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">
                Transmission Portal
              </Badge>
              <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-tighter h-7 border-zinc-200 dark:border-zinc-800">
                NODE: {proposal._id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
              Submit Proposal
            </h1>
            <p className="text-zinc-500 max-w-xl font-medium">
              Configure your technical bid for: <span className="text-zinc-800 dark:text-zinc-200 font-bold underline">{proposal.title}</span>
            </p>
          </div>
        </div>
      </div>

      {cannotSubmit && submission && (
        <Card className={`rounded-[2rem] border-2 shadow-xl overflow-hidden ${submission.status === 'ACCEPTED' ? 'border-emerald-500/20 bg-emerald-500/5' :
            submission.status === 'REJECTED' ? 'border-rose-500/20 bg-rose-500/5' :
              'border-amber-500/20 bg-amber-500/5'
          }`}>
          <CardContent className="p-8 flex items-center gap-6">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 ${submission.status === 'ACCEPTED' ? 'bg-emerald-500 text-white border-emerald-400' :
                submission.status === 'REJECTED' ? 'bg-rose-500 text-white border-rose-400' :
                  'bg-amber-500 text-white border-amber-400'
              }`}>
              {submission.status === 'ACCEPTED' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Node Status Feedback</p>
              <p className="text-lg font-black uppercase tracking-tight">
                {submission.status === 'ACCEPTED' ? 'Proposal Accepted' : submission.status === 'REJECTED' ? 'Proposal Terminated' : 'Submission Link Severed'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Submission Form */}
          <Card className={`rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden ${cannotSubmit ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardContent className="p-8 md:p-12 space-y-12">
              <div className="flex items-center justify-between border-b-2 border-zinc-50 dark:border-zinc-900 pb-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Send className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Technical Tender</h2>
                </div>
                {submission && (
                  <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] h-8 px-4 border-2">
                    {submission.status === 'DRAFT' ? 'Draft State' : 'Transmitted'}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="proposedAmount" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Allocation Request ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                      id="proposedAmount"
                      type="number"
                      name="proposedAmount"
                      value={formData.proposedAmount || ''}
                      onChange={handleChange}
                      disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                      className={`pl-14 h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black text-xl focus-visible:ring-primary/20 ${errors.proposedAmount ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}
                    />
                  </div>
                  {errors.proposedAmount && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-1">{errors.proposedAmount}</p>}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="teamSize" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Operational Unit Size</Label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                      id="teamSize"
                      type="number"
                      name="teamSize"
                      value={formData.teamSize || ''}
                      onChange={handleChange}
                      disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                      className="pl-14 h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black text-xl focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="timeline" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Temporal Execution Plan</Label>
                <Textarea
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="Define key milestones and delivery cycles..."
                  rows={3}
                  disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                  className={`p-6 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium focus-visible:ring-primary/20 resize-none ${errors.timeline ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}
                />
                {errors.timeline && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-1">{errors.timeline}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Proposal Synthesis</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a high-fidelity summary of your solution..."
                  rows={6}
                  disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                  className={`p-6 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium focus-visible:ring-primary/20 resize-none ${errors.description ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}
                />
                {errors.description && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-1">{errors.description}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="approach" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Technical Methodology Matrix</Label>
                <Textarea
                  id="approach"
                  name="approach"
                  value={formData.approach}
                  onChange={handleChange}
                  placeholder="Describe your execution strategy and validation logic..."
                  rows={6}
                  disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                  className={`p-6 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium focus-visible:ring-primary/20 resize-none ${errors.approach ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}
                />
                {errors.approach && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-1">{errors.approach}</p>}
              </div>

              <div className="space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Resource Attachments (Binary Links)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-transparent hover:border-zinc-100 transition-all group overflow-hidden">
                      <FileText className="h-6 w-6 text-zinc-400 group-hover:text-primary shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">External Data</p>
                        <p className="font-bold text-sm truncate">{attachment}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl"
                        onClick={() => removeAttachment(index)}
                        disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAttachment}
                    disabled={submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW'}
                    className="h-20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 font-black uppercase tracking-tight text-[10px] gap-3"
                  >
                    <Upload className="h-5 w-5" />
                    Inject Resource Node
                  </Button>
                </div>
              </div>

              {submission?.status !== 'SUBMITTED' && submission?.status !== 'UNDER_REVIEW' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t-2 border-zinc-50 dark:border-zinc-900 border-dashed">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit('DRAFT')}
                    disabled={isSubmitting}
                    className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-tight shadow-sm"
                  >
                    <Save className="h-5 w-5 mr-3" />
                    Synchronize Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('SUBMITTED')}
                    disabled={isSubmitting}
                    className="flex-[2] h-16 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 bg-zinc-950 text-white hover:bg-zinc-800"
                  >
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Execute Transmission
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          {/* Proposal Summary Card */}
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden sticky top-8">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <Target className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">RFP Specifications</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                    <DollarSign className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Budget Window</p>
                    <p className="font-black text-lg">${proposal.budgetMin.toLocaleString()} - ${proposal.budgetMax.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                    <Clock className={`h-6 w-6 ${isDeadlinePassed ? 'text-rose-500' : 'text-zinc-400'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Temporal Bound</p>
                    <p className={`font-black text-lg ${isDeadlinePassed ? 'text-rose-500' : ''}`}>
                      {new Date(proposal.deadline).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                    <Layers className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sector Cluster</p>
                    <p className="font-black text-lg uppercase tracking-tight">{proposal.category.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-50 dark:bg-zinc-900" />

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Projected Requirements</p>
                <div className="space-y-3">
                  {proposal.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {proposal.attachments && proposal.attachments.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Technical Briefs</p>
                  <div className="space-y-3">
                    {proposal.attachments.map((att, i) => (
                      <Button key={i} variant="ghost" asChild className="w-full justify-start h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 p-4 border border-zinc-100 dark:border-zinc-800">
                        <a href={att} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-zinc-400" />
                          <span className="text-[10px] font-black uppercase truncate">{att.split('/').pop()}</span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
