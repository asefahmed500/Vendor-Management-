'use client';

import { useEffect, useState, useCallback } from 'react';
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
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  ExternalLink,
  Target,
  Search,
  History,
  Activity,
  Zap,
  Globe,
  Lock,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { IProposalSubmission } from '@/lib/types/proposal';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusConfig: Record<ProposalStatus, { label: string; color: string; bg: string; icon: any }> = {
  DRAFT: { label: 'Protocol Draft', color: 'text-zinc-500', bg: 'bg-zinc-100', icon: FileText },
  OPEN: { label: 'Live Protocol', color: 'text-blue-500', bg: 'bg-blue-50', icon: Globe },
  CLOSED: { label: 'Protocol Sealed', color: 'text-zinc-900', bg: 'bg-zinc-200', icon: Lock },
  AWARDED: { label: 'Protocol Awarded', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: ShieldCheck },
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
  const [activeTab, setActiveTab] = useState('manifest');
  
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    budgetMin: 0,
    budgetMax: 0,
    deadline: '',
    status: 'DRAFT' as ProposalStatus,
  });

  const fetchProposalData = useCallback(async () => {
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
      toast.error('Failed to fetch protocol data');
    } finally {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchProposalData();
  }, [fetchProposalData]);

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
        toast.success('Protocol parameters updated');
        setShowEditModal(false);
        fetchProposalData();
      } else {
        toast.error(data.error || 'Failed to synchronize parameters');
      }
    } catch (error) {
      console.error('Update proposal error:', error);
      toast.error('System synchronization failure');
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
        toast.success('Protocol terminated');
        router.push('/admin/proposals');
      } else {
        toast.error(data.error || 'Termination sequence failed');
      }
    } catch (error) {
      console.error('Delete proposal error:', error);
      toast.error('Critical termination error');
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
        toast.success(`Protocol state shifted to ${newStatus}`);
        fetchProposalData();
      } else {
        toast.error(data.error || 'State transition failed');
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('State logic error');
    } finally {
      setIsProcessing(false);
    }
  };

  const daysRemaining = proposal 
    ? Math.max(0, Math.ceil((new Date(proposal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-zinc-100 border-t-zinc-950 animate-spin" />
          <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 animate-pulse">Initializing Protocol Control…</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="h-16 w-16 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100">
          <AlertCircle className="h-6 w-6 text-zinc-300" />
        </div>
        <p className="text-sm font-medium text-zinc-500">Protocol sequence not found</p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/admin/proposals')}
          className="rounded-full px-6 text-xs h-9"
        >
          Return to Registry
        </Button>
      </div>
    );
  }

  const activeStatus = statusConfig[proposal.status] || statusConfig.DRAFT;
  const StatusIcon = activeStatus.icon;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <Link href="/admin/proposals" className="hover:text-zinc-900 transition-colors">Registry</Link>
        <ChevronLeft className="h-3 w-3 rotate-180" />
        <span className="text-zinc-900">Protocol Control</span>
      </nav>

      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-100 pb-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl border", activeStatus.bg, activeStatus.color.replace('text-', 'border-').replace('500', '200'))}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="rounded-full border-zinc-200 text-zinc-500 font-mono text-[10px] px-3">
              ID: RFP-{proposal._id.slice(-6).toUpperCase()}
            </Badge>
            <div className="h-1 w-1 rounded-full bg-zinc-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Revision {(proposal as any).__v || 0}.0
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 font-syne italic">
              {proposal.title}
            </h1>
            <p className="text-lg text-zinc-500 max-w-2xl font-dm leading-relaxed">
              Managing high-priority vendor procurement protocols for {proposal.category.toLowerCase().replace(/_/g, ' ')} initiatives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button 
            onClick={() => setShowEditModal(true)}
            className="h-12 px-6 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all hover:shadow-xl hover:shadow-zinc-200 group"
          >
            <Settings2 className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
            Reconfigure Protocol
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="h-12 w-12 p-0 rounded-2xl border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Strategic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Strategic Budget', value: `$${proposal.budgetMax.toLocaleString()}`, sub: `From $${proposal.budgetMin.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Bidders', value: submissions.length, sub: 'Verified Entities', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Time Remaining', value: `${daysRemaining} Days`, sub: `Expires ${new Date(proposal.deadline).toLocaleDateString()}`, icon: Clock, color: daysRemaining < 7 ? 'text-red-600' : 'text-amber-600', bg: daysRemaining < 7 ? 'bg-red-50' : 'bg-amber-50' },
          { label: 'System State', value: activeStatus.label, sub: 'Lifecycle Phase', icon: Activity, color: 'text-zinc-600', bg: 'bg-zinc-100' }
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border-zinc-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", stat.color)}>
              <stat.icon className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-4">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-zinc-900 font-syne">{stat.value}</h3>
                </div>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter mt-1">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Central Protocol Content */}
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="manifest" onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl h-auto gap-1">
              {[
                { id: 'manifest', label: 'Manifest', icon: Layers },
                { id: 'bidders', label: 'Bidders', icon: Briefcase },
                { id: 'technical', label: 'Protocol Meta', icon: Cpu }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="rounded-xl px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm transition-all"
                >
                  <tab.icon className="h-3.5 w-3.5 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="manifest" className="mt-8 space-y-10 focus-visible:outline-none">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  Strategic Context
                </h3>
                <div className="p-8 bg-white border border-zinc-100 rounded-[2rem] shadow-sm italic text-zinc-600 font-dm leading-[1.8]">
                  {proposal.description}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-emerald-500" />
                  Core Protocol Requirements
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {proposal.requirements && proposal.requirements.length > 0 ? (
                    proposal.requirements.map((req, idx) => (
                      <div key={idx} className="group relative">
                        <div className="absolute inset-0 bg-zinc-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-50 flex items-center justify-center font-syne font-bold text-zinc-950 border border-zinc-100">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Parameter {idx + 1}</p>
                            <p className="text-sm text-zinc-600 leading-relaxed font-dm">{req}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-20 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
                      <Target className="h-8 w-8 text-zinc-200 mx-auto mb-4" />
                      <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">No requirements defined in manifest</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bidders" className="mt-8 focus-visible:outline-none">
              <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-50 hover:bg-transparent">
                      <TableHead className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bidder Entity</TableHead>
                      <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Proposed Quote</TableHead>
                      <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Timestamp</TableHead>
                      <TableHead className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 opacity-30">
                            <Briefcase className="h-8 w-8" />
                            <p className="text-xs font-mono uppercase tracking-widest">Awaiting Entity Submissions</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((submission) => (
                        <TableRow key={submission._id} className="group hover:bg-zinc-50/50 transition-all border-zinc-50">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:border-zinc-950 group-hover:text-zinc-950 transition-all overflow-hidden relative">
                                <Briefcase className="h-5 w-5 relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Entity Signature</p>
                                <p className="text-sm font-bold text-zinc-950 font-syne italic">Vendor {submission.vendorId.slice(-6).toUpperCase()}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="font-mono text-sm font-bold tracking-tight text-zinc-900 bg-zinc-50 px-3 py-1 rounded-lg inline-block border border-zinc-100">
                              ${submission.proposedAmount.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                              {new Date(submission.submittedAt || new Date()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                            </span>
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                            <Badge 
                              className={cn(
                                "rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                submission.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                submission.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-blue-50 text-blue-700 border-blue-100'
                              )}
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="mt-8 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Protocol ID', value: proposal._id, icon: Fingerprint },
                  { label: 'Category Protocol', value: proposal.category, icon: Layers },
                  { label: 'Initialization Time', value: new Date(proposal.createdAt).toLocaleString(), icon: History },
                  { label: 'Last State Sync', value: new Date(proposal.updatedAt).toLocaleString(), icon: Activity },
                ].map((meta, i) => (
                  <div key={i} className="p-8 bg-white border border-zinc-100 rounded-[2rem] space-y-4 shadow-sm hover:border-zinc-200 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all">
                      <meta.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{meta.label}</p>
                      <p className="text-xs font-mono font-bold text-zinc-900 break-all">{meta.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Protocol Activation Panel */}
          <Card className="rounded-[2.5rem] bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-200 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Zap className="h-32 w-32" />
            </div>
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Protocol Control</CardTitle>
              <CardDescription className="text-zinc-500 font-dm text-xs">Execute state transitions for this RFP instance.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-3">
              {(['OPEN', 'CLOSED', 'AWARDED'] as ProposalStatus[]).map((status) => (
                <button
                  key={status}
                  disabled={isProcessing || proposal.status === status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "w-full h-14 rounded-2xl flex items-center justify-between px-6 transition-all border font-syne",
                    proposal.status === status 
                      ? "bg-white text-zinc-950 border-white shadow-xl shadow-white/5" 
                      : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {proposal.status === status && <div className="h-1.5 w-1.5 rounded-full bg-zinc-950 animate-pulse" />}
                    <span className="text-xs font-bold uppercase tracking-widest">{status}</span>
                  </div>
                  {proposal.status === status ? (
                    <div className="h-8 w-8 rounded-full bg-zinc-950 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Secure Artifacts */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-zinc-50">
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Secure Artifacts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 bg-zinc-50/50">
              {proposal.attachments && proposal.attachments.length > 0 ? (
                proposal.attachments.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-[1.5rem] group transition-all hover:border-zinc-950 hover:shadow-lg hover:shadow-zinc-100"
                  >
                    <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 transition-colors">Manifest Ref {idx + 1}</p>
                      <p className="text-xs font-bold text-zinc-900 truncate font-syne">RFP_DOC_{idx + 1}.pdf</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-zinc-300 group-hover:text-zinc-950 transition-colors" />
                  </a>
                ))
              ) : (
                <div className="py-12 text-center border border-dashed border-zinc-200 rounded-[2rem] bg-white">
                  <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-5 w-5 text-zinc-200" />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">No artifacts attached</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Support / Intelligence */}
          <div className="p-8 rounded-[2.5rem] border border-zinc-100 space-y-4 bg-zinc-50/30">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Note</h4>
            <p className="text-xs text-zinc-500 font-dm leading-relaxed">
              All state transitions and protocol reconfigurations are logged in the immutable audit registry for compliance verification.
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">VMS Protocol Shield Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Refactored */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-8 bg-zinc-950 text-white space-y-1">
            <DialogTitle className="text-2xl font-syne italic font-bold">Protocol Reconfiguration</DialogTitle>
            <DialogDescription className="text-zinc-400 font-dm">Update technical parameters and strategic alignment.</DialogDescription>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 md:col-span-2">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Protocol Title</p>
                  <Input 
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl px-6 font-syne text-lg font-bold focus-visible:ring-zinc-950"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Strategic Intent</p>
                  <Textarea 
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="bg-zinc-50 border-zinc-100 min-h-[150px] rounded-[2rem] p-6 text-sm font-dm focus-visible:ring-zinc-950 leading-relaxed"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Min Budget Allocation</p>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input 
                    type="number"
                    value={editForm.budgetMin}
                    onChange={(e) => setEditForm({ ...editForm, budgetMin: Number(e.target.value) })}
                    className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl pl-12 pr-6 font-mono text-sm focus-visible:ring-zinc-950"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Max Budget Allocation</p>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input 
                    type="number"
                    value={editForm.budgetMax}
                    onChange={(e) => setEditForm({ ...editForm, budgetMax: Number(e.target.value) })}
                    className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl pl-12 pr-6 font-mono text-sm focus-visible:ring-zinc-950"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Expiration Deadline</p>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input 
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl pl-12 pr-6 font-mono text-sm focus-visible:ring-zinc-950"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current State</p>
                <Select 
                  value={editForm.status} 
                  onValueChange={(val) => setEditForm({ ...editForm, status: val as ProposalStatus })}
                >
                  <SelectTrigger className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl px-6 font-syne font-bold focus:ring-zinc-950">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                    <SelectItem value="DRAFT" className="rounded-xl py-3 text-xs font-bold uppercase tracking-widest">Protocol Draft</SelectItem>
                    <SelectItem value="OPEN" className="rounded-xl py-3 text-xs font-bold uppercase tracking-widest">Live Protocol</SelectItem>
                    <SelectItem value="CLOSED" className="rounded-xl py-3 text-xs font-bold uppercase tracking-widest">Protocol Sealed</SelectItem>
                    <SelectItem value="AWARDED" className="rounded-xl py-3 text-xs font-bold uppercase tracking-widest">Protocol Awarded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button 
                onClick={handleUpdateProposal} 
                disabled={isProcessing}
                className="flex-1 h-14 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest transition-all"
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Synchronize System
              </Button>
              <Button variant="ghost" onClick={() => setShowEditModal(false)} className="h-14 px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950">
                Abort
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal Refactored */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-8 bg-red-600 text-white space-y-1">
            <DialogTitle className="text-2xl font-syne italic font-bold">Terminate Protocol</DialogTitle>
            <DialogDescription className="text-red-200 font-dm">Irreversible system deletion sequence.</DialogDescription>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-sm text-zinc-600 font-dm leading-relaxed">
              Are you certain you wish to terminate <span className="font-bold text-zinc-950">"{proposal.title}"</span>? This action will purge all associated bidder registries and manifest data.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="destructive"
                onClick={handleDeleteProposal}
                disabled={isProcessing}
                className="h-14 rounded-2xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold uppercase tracking-widest shadow-xl shadow-red-100 transition-all"
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Confirm Termination
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
