'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  DollarSign,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Briefcase,
  Layers,
  ArrowUpRight,
  Settings2,
  ChevronLeft,
  MoreHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { IProposalSubmission } from '@/lib/types/proposal';
import Link from 'next/link';

const statusConfig: Record<ProposalStatus, { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  DRAFT: { label: 'Draft', variant: 'default' },
  OPEN: { label: 'Open', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'danger' },
  AWARDED: { label: 'Awarded', variant: 'info' },
};

export default function AdminProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<IProposal | null>(null);
  const [submissions, setSubmissions] = useState<IProposalSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    budgetMin: 0,
    budgetMax: 0,
    deadline: '',
    status: 'DRAFT' as ProposalStatus,
  });

  useEffect(() => {
    fetchProposalData();
  }, [proposalId]);

  const fetchProposalData = async () => {
    try {
      setIsLoading(true);
      const [proposalRes, submissionsRes] = await Promise.all([
        fetch(`/api/admin/proposals/${proposalId}`),
        fetch(`/api/admin/proposals/${proposalId}/submissions`),
      ]);

      const proposalData = await proposalRes.json();
      const submissionsData = await submissionsRes.json();

      if (proposalData.success) {
        setProposal(proposalData.data.proposal);
        setEditForm({
          title: proposalData.data.proposal.title,
          description: proposalData.data.proposal.description,
          budgetMin: proposalData.data.proposal.budgetMin,
          budgetMax: proposalData.data.proposal.budgetMax,
          deadline: new Date(proposalData.data.proposal.deadline).toISOString().split('T')[0],
          status: proposalData.data.proposal.status,
        });
      }
      if (submissionsData.success) {
        setSubmissions(submissionsData.data.submissions || []);
      }
    } catch (error) {
      console.error('Fetch proposal error:', error);
      toast.error('Failed to fetch proposal data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProposal = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Proposal updated successfully');
        setShowEditModal(false);
        fetchProposalData();
      } else {
        toast.error(data.error || 'Failed to update proposal');
      }
    } catch (error) {
      console.error('Update proposal error:', error);
      toast.error('Failed to update proposal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProposal = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Proposal deleted');
        router.push('/admin/proposals');
      } else {
        toast.error(data.error || 'Failed to delete proposal');
      }
    } catch (error) {
      console.error('Delete proposal error:', error);
      toast.error('Failed to delete proposal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (newStatus: ProposalStatus) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Proposal marked as ${newStatus.toLowerCase()}`);
        fetchProposalData();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const daysRemaining = proposal 
    ? Math.max(0, Math.ceil((new Date(proposal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Proposal not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10 shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={statusConfig[proposal.status].variant}>
                {statusConfig[proposal.status].label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                ID: {proposal._id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              {proposal.title}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-xl">
              {proposal.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowEditModal(true)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {proposal.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget Range</p>
                  <p className="text-xl font-semibold">
                    ${proposal.budgetMin.toLocaleString()} - ${proposal.budgetMax.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                  <p className="text-xl font-semibold">
                    {new Date(proposal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="text-xl font-semibold capitalize">
                    {proposal.category.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {proposal.requirements && proposal.requirements.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proposal.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-sm">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {proposal.attachments && proposal.attachments.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    Attachments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proposal.attachments.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm truncate">Resource {idx + 1}</span>
                        <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Submissions ({submissions.length})
              </h2>
              <Button variant="outline" asChild>
                <Link href={`/admin/proposals/${proposalId}/submissions`}>
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {submissions.length === 0 ? (
              <Card className="border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground">No submissions yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {submissions.slice(0, 5).map((submission) => (
                  <Card key={submission._id} className="border-border hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Vendor: {submission.vendorId.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Proposed Amount</p>
                          <p className="font-semibold">${submission.proposedAmount.toLocaleString()}</p>
                        </div>
                        <Badge variant={
                          submission.status === 'ACCEPTED' ? 'success' : 
                          submission.status === 'REJECTED' ? 'danger' : 'info'
                        }>
                          {submission.status}
                        </Badge>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/proposals/${proposalId}/submissions`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {(['OPEN', 'CLOSED', 'AWARDED'] as ProposalStatus[]).map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isProcessing || proposal.status === status}
                    variant={proposal.status === status ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {proposal.status === status && <CheckCircle className="h-4 w-4 mr-2" />}
                    {statusConfig[status].label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className={`text-2xl font-bold ${daysRemaining > 7 ? 'text-green-600' : daysRemaining > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {daysRemaining} days
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Proposal</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-10 px-3 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border rounded-lg resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Budget ($)</label>
                  <input
                    type="number"
                    value={editForm.budgetMin}
                    onChange={(e) => setEditForm({ ...editForm, budgetMin: Number(e.target.value) })}
                    className="w-full h-10 px-3 border rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Budget ($)</label>
                  <input
                    type="number"
                    value={editForm.budgetMax}
                    onChange={(e) => setEditForm({ ...editForm, budgetMax: Number(e.target.value) })}
                    className="w-full h-10 px-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="w-full h-10 px-3 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateProposal} disabled={isProcessing} className="flex-1">
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Delete Proposal?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. All submissions associated with this RFP will also be deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleDeleteProposal} disabled={isProcessing} variant="destructive" className="flex-1">
                  {isProcessing ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
