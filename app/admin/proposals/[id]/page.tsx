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
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { IProposalSubmission } from '@/lib/types/proposal';
import Link from 'next/link';

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
        toast.success('Proposal deleted successfully');
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
        toast.success(`Proposal ${newStatus.toLowerCase()}`);
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

  const getStatusVariant = (status: ProposalStatus): 'default' | 'info' | 'warning' | 'success' | 'danger' => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'OPEN': return 'success';
      case 'CLOSED': return 'danger';
      case 'AWARDED': return 'info';
      default: return 'default';
    }
  };

  const statusLabels: Record<ProposalStatus, string> = {
    DRAFT: 'Draft Node',
    OPEN: 'Active Stream',
    CLOSED: 'Terminated',
    AWARDED: 'Nexus Awarded',
  };

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
        <p className="text-gray-600">Proposal not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div className="flex items-start gap-5">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 shrink-0" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getStatusVariant(proposal.status)} className="font-black uppercase tracking-widest text-[10px] px-3">
                {statusLabels[proposal.status]}
              </Badge>
              <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-tighter h-7 border-zinc-200 dark:border-zinc-800">
                NODE: {proposal._id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
              {proposal.title}
            </h1>
            <p className="text-zinc-500 max-w-xl font-medium">
              Comprehensive inspection of proposal parameters, technical tenders, and integrated vendor submissions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900" onClick={() => setShowEditModal(true)}>
            <Edit3 className="h-5 w-5" />
          </Button>
          <Button variant="destructive" size="icon" className="h-14 w-14 rounded-2xl shadow-xl shadow-rose-500/10" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Mission Specification</h2>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-lg lg:text-xl">
                  {proposal.description}
                </p>
              </div>

              <Separator className="bg-zinc-50 dark:bg-zinc-900 h-0.5" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    <DollarSign className="h-3 w-3" /> Budget Range
                  </div>
                  <p className="text-2xl font-black tracking-tighter uppercase">
                    ${proposal.budgetMin.toLocaleString()} <span className="text-zinc-300 font-medium mx-1">—</span> ${proposal.budgetMax.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    <Calendar className="h-3 w-3" /> Deadline
                  </div>
                  <p className="text-2xl font-black tracking-tighter uppercase">
                    {new Date(proposal.deadline).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    <Layers className="h-3 w-3" /> Sector Cluster
                  </div>
                  <p className="text-2xl font-black tracking-tighter uppercase">
                    {proposal.category.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {proposal.requirements && proposal.requirements.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Technical Requirements Matrix</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposal.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-transparent hover:border-zinc-100 transition-all group">
                        <div className="h-6 w-6 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-[10px] font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                          {idx + 1}
                        </div>
                        <p className="font-bold text-sm tracking-tight pt-0.5">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {proposal.attachments && proposal.attachments.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <Layers className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Resource Vault</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {proposal.attachments.map((url, idx) => (
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

          {/* Submissions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Transmission Registry</h2>
              </div>
              <Button variant="outline" asChild className="rounded-xl font-black uppercase tracking-tight text-[10px] h-10 px-4 border-2">
                <Link href={`/admin/proposals/${proposalId}/submissions`}>
                  View All Submissions ({submissions.length})
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {submissions.length === 0 ? (
              <Card className="rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 bg-transparent py-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Registry Vacant</p>
                <p className="text-zinc-500 font-medium mt-2">No vendor transmissions detected for this node.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {submissions.slice(0, 5).map((submission) => (
                  <Card key={submission._id} className="rounded-3xl border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-primary/20 transition-all overflow-hidden">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2">
                          <Briefcase className="h-6 w-6 text-zinc-300" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Entity Signature</p>
                          <p className="font-black uppercase tracking-tight">{submission.vendorId.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Bid Allocation</p>
                          <p className="font-black text-lg">${submission.proposedAmount.toLocaleString()}</p>
                        </div>
                        <Separator orientation="vertical" className="h-10 hidden md:block" />
                        <Badge variant={
                          submission.status === 'ACCEPTED' ? 'success' : submission.status === 'REJECTED' ? 'danger' : 'info'
                        } className="font-black uppercase tracking-widest text-[9px] px-3">
                          {submission.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border-2" asChild>
                        <Link href={`/admin/proposals/${proposalId}/submissions`}>
                          <ArrowUpRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Control Sidebar */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <Settings2 className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">Protocol Override</h2>
              </div>

              <div className="space-y-4">
                {(['OPEN', 'CLOSED', 'AWARDED'] as ProposalStatus[]).map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isProcessing || proposal.status === status}
                    variant={proposal.status === status ? 'default' : 'secondary'}
                    className={`w-full h-16 rounded-2xl font-black uppercase tracking-tight text-xs transition-all ${proposal.status === status ? 'shadow-xl shadow-primary/20 scale-[1.03]' : 'border-2'
                      }`}
                  >
                    {proposal.status === status && <CheckCircle className="h-5 w-5 mr-3" />}
                    {statusLabels[status]}
                  </Button>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-zinc-50 dark:border-zinc-900">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Security Verified
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed">
                    Status transitions are immutable and recorded within the system audit log.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">Node Metrics</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400">Reception Pulse</p>
                    <p className="text-xl font-black tracking-tight">{submissions.length} TRANSMISSIONS</p>
                  </div>
                  <Users className="h-8 w-8 text-zinc-100 dark:text-zinc-800" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400">Temporal Remaining</p>
                    <p className={`text-xl font-black tracking-tight ${new Date(proposal.deadline) > new Date() ? 'text-indigo-600' : 'text-rose-500'
                      }`}>
                      {Math.max(0, Math.ceil((new Date(proposal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} SOLAR CYCLES
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-zinc-100 dark:text-zinc-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal Refactored */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <Card className="max-w-2xl w-full rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="flex items-center justify-between border-b-2 border-zinc-50 dark:border-zinc-900 pb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Configuration</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Edit RFP Node</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)} className="rounded-xl h-12 w-12">
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Title Specification</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-lg"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Operational descriptor</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full p-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-medium resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Allocation Floor ($)</label>
                    <input
                      type="number"
                      value={editForm.budgetMin}
                      onChange={(e) => setEditForm({ ...editForm, budgetMin: Number(e.target.value) })}
                      className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-black text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Allocation Ceiling ($)</label>
                    <input
                      type="number"
                      value={editForm.budgetMax}
                      onChange={(e) => setEditForm({ ...editForm, budgetMax: Number(e.target.value) })}
                      className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-black text-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Final Transmission End</label>
                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="w-full h-16 px-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 border-t-2 border-zinc-50 dark:border-zinc-900 pt-8">
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-tight"
                >
                  Abort Changes
                </Button>
                <Button
                  onClick={handleUpdateProposal}
                  disabled={isProcessing}
                  className="flex-2 h-16 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 flex-[2]"
                >
                  {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Synchronize Node'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <Card className="max-w-md w-full rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <CardContent className="p-10 text-center space-y-8">
              <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-rose-500/10">
                <Trash2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Decommission Node?</h3>
                <p className="text-sm font-bold text-zinc-400 uppercase leading-relaxed px-4">
                  This action triggers an irreversible deletion Protocol. Data recovery is impossible once executed.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-tight text-[10px]"
                >
                  Abort
                </Button>
                <Button
                  onClick={handleDeleteProposal}
                  disabled={isProcessing}
                  variant="destructive"
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-tight text-[10px] shadow-xl shadow-rose-500/20"
                >
                  {isProcessing ? 'Purging...' : 'Execute Purge'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
