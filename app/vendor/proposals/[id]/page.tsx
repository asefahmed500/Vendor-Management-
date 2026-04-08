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
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, IProposalSubmission, ICreateSubmissionInput } from '@/lib/types/proposal';
import { createSubmissionSchema } from '@/lib/validation/schemas/proposal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      toast.error('Failed to load proposal');
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
      toast.error('Please fill in all required fields');
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
        throw new Error(data.error || 'Failed to submit');
      }

      toast.success(
        status === 'SUBMITTED' ? 'Proposal submitted successfully' : 'Draft saved'
      );

      if (status === 'SUBMITTED') {
        router.push('/vendor/proposals/submissions');
      } else {
        fetchProposal();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit proposal');
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
  const isReadOnly = submission?.status === 'SUBMITTED' || submission?.status === 'UNDER_REVIEW';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <Card className="max-w-md mx-auto mt-12 text-center border-dashed py-12">
        <CardContent>
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">Proposal not found</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/vendor/proposals">Back to Proposals</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{proposal.status}</Badge>
              <Badge variant="outline" className="text-xs">ID: {proposal._id.slice(-6).toUpperCase()}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              Submit Proposal
            </h1>
            <p className="text-muted-foreground mt-1">
              for: <span className="font-medium">{proposal.title}</span>
            </p>
          </div>
        </div>
      </div>

      {cannotSubmit && submission && (
        <Card className={submission.status === 'ACCEPTED' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 
          submission.status === 'REJECTED' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 
            'border-amber-500 bg-amber-50 dark:bg-amber-900/20'}>
          <CardContent className="p-4 flex items-center gap-4">
            {submission.status === 'ACCEPTED' ? <CheckCircle className="h-6 w-6 text-green-600" /> : 
              submission.status === 'REJECTED' ? <AlertCircle className="h-6 w-6 text-red-600" /> :
                <AlertCircle className="h-6 w-6 text-amber-600" />}
            <div>
              <p className="font-semibold">
                {submission.status === 'ACCEPTED' ? 'Proposal Accepted' : 
                  submission.status === 'REJECTED' ? 'Proposal Rejected' : 'Submission Under Review'}
              </p>
              <p className="text-sm text-muted-foreground">
                {submission.status === 'ACCEPTED' ? 'Congratulations! Your proposal has been accepted.' :
                  submission.status === 'REJECTED' ? 'Unfortunately, your proposal was not selected.' :
                    'Your submission is being reviewed.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-border ${cannotSubmit ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Your Proposal
                </CardTitle>
                {submission && (
                  <Badge variant="outline">{submission.status}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposedAmount">Proposed Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="proposedAmount"
                      type="number"
                      name="proposedAmount"
                      value={formData.proposedAmount || ''}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className="pl-10"
                    />
                  </div>
                  {errors.proposedAmount && <p className="text-sm text-red-500">{errors.proposedAmount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="teamSize"
                      type="number"
                      name="teamSize"
                      value={formData.teamSize || ''}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Textarea
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="Describe your timeline and milestones..."
                  rows={3}
                  disabled={isReadOnly}
                />
                {errors.timeline && <p className="text-sm text-red-500">{errors.timeline}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your solution..."
                  rows={5}
                  disabled={isReadOnly}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="approach">Approach</Label>
                <Textarea
                  id="approach"
                  name="approach"
                  value={formData.approach}
                  onChange={handleChange}
                  placeholder="Describe your approach and methodology..."
                  rows={5}
                  disabled={isReadOnly}
                />
                {errors.approach && <p className="text-sm text-red-500">{errors.approach}</p>}
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm truncate">{attachment}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                        disabled={isReadOnly}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAttachment}
                    disabled={isReadOnly}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </div>

              {!isReadOnly && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit('DRAFT')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('SUBMITTED')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Submit Proposal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                RFP Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Budget Range</p>
                <p className="text-lg font-semibold">${proposal.budgetMin.toLocaleString()} - ${proposal.budgetMax.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className={`text-lg font-semibold ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                  {new Date(proposal.deadline).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-semibold capitalize">{proposal.category.replace(/_/g, ' ')}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-3">Requirements</p>
                <div className="space-y-2">
                  {proposal.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {proposal.attachments && proposal.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-3">Attachments</p>
                    <div className="space-y-2">
                      {proposal.attachments.map((att, i) => (
                        <Button key={i} variant="ghost" asChild className="w-full justify-start text-sm h-10">
                          <a href={att} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            {att.split('/').pop()}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
