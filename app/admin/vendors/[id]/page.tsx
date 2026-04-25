'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Loader2,
  Clock,
  User,
  ChevronLeft,
  ExternalLink,
  Target,
  Briefcase,
  Settings2,
  Globe,
  ShieldCheck,
  ArrowUpRight,
  Database,
  Search,
  MoreHorizontal,
  Activity,
  Calendar,
  ArrowLeft,
  Shield,
  Zap,
  Download,
  Link as LinkIcon,
  SearchX,
  FileSearch,
  History,
  Fingerprint,
  Cpu,
  Verified,
  AlertTriangle
} from 'lucide-react';
import { IVendor } from '@/lib/types/vendor';
import { IDocument } from '@/lib/types/document';
import { IProposalSubmission } from '@/lib/types/proposal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

interface IActivityLog {
  _id: string;
  vendorId: string;
  performedBy: string;
  activityType: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; variant: string; color: string }> = {
  PENDING: { label: 'ENROLLMENT PENDING', variant: 'outline', color: 'zinc' },
  APPROVED_LOGIN: { label: 'ACCESS GRANTED', variant: 'info', color: 'blue' },
  DOCUMENTS_SUBMITTED: { label: 'REVIEW IN PROGRESS', variant: 'warning', color: 'amber' },
  UNDER_REVIEW: { label: 'PROTOCOL REVIEW', variant: 'secondary', color: 'zinc' },
  APPROVED: { label: 'VERIFIED PARTNER', variant: 'success', color: 'emerald' },
  VERIFIED: { label: 'VERIFIED PARTNER', variant: 'success', color: 'emerald' },
  REJECTED: { label: 'ACCESS DENIED', variant: 'destructive', color: 'red' },
};

export default function AdminVendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [submissions, setSubmissions] = useState<IProposalSubmission[]>([]);
  const [activities, setActivities] = useState<IActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchVendorData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [vendorRes, docsRes, submissionsRes, activityRes] = await Promise.all([
        fetch(`/api/admin/vendors/${vendorId}`),
        fetch(`/api/admin/vendors/${vendorId}/documents`),
        fetch(`/api/admin/vendors/${vendorId}/submissions`),
        fetch(`/api/admin/vendors/${vendorId}/activity`),
      ]);

      const vendorData = await vendorRes.json();
      const docsData = await docsRes.json();
      const submissionsData = await submissionsRes.json();
      const activityData = await activityRes.json();

      if (vendorData.success) {
        setVendor(vendorData.data.vendor);
      }
      if (docsData.success) {
        setDocuments(docsData.data.documents || []);
      }
      if (submissionsData.success) {
        setSubmissions(submissionsData.data.submissions || []);
      }
      if (activityData.success) {
        setActivities(activityData.data.activities || []);
      }
    } catch (error) {
      console.error('Fetch vendor error:', error);
      toast.error('Failed to fetch vendor intelligence');
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const handleApproveRegistration = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/approve-registration`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Access protocols initialized');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to initialize access');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/final-approve`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Identity verified and certificate issued');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Final approve error:', error);
      toast.error('Verification protocol error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestRevisions = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection logic required');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/request-revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Revision protocols transmitted');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Transmission failed');
      }
    } catch (error) {
      console.error('Request revisions error:', error);
      toast.error('Network protocol error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRegistration = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Justification logic required');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/reject-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Identity rejected from registry');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Protocol execution error');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { key: 'PENDING', label: 'Enrollment' },
    { key: 'APPROVED_LOGIN', label: 'Identity' },
    { key: 'DOCUMENTS_SUBMITTED', label: 'Artifacts' },
    { key: 'UNDER_REVIEW', label: 'Audit' },
    { key: 'APPROVED', label: 'Manifest' },
  ];

  const currentStepIndex = vendor ? steps.findIndex((s) => s.key === vendor.status) : -1;

  if (isLoading) {
    return (
      <div className="space-y-12 pb-24 animate-fade-in font-dm-sans bg-zinc-50/50 min-h-screen p-8 lg:p-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-20 w-[500px] rounded-3xl" />
            <Skeleton className="h-4 w-64 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-16 w-48 rounded-[2rem]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-56 rounded-[3rem]" />
            <Skeleton className="h-[500px] rounded-[3rem]" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-96 rounded-[3rem]" />
            <Skeleton className="h-72 rounded-[3rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-60 space-y-8 animate-fade-in bg-zinc-50/50 min-h-screen">
        <div className="h-32 w-32 rounded-[3.5rem] bg-white flex items-center justify-center border border-zinc-100 shadow-2xl shadow-zinc-200/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white group-hover:scale-110 transition-transform duration-700" />
          <SearchX className="h-12 w-12 text-zinc-200 relative z-10" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Entity Null</h2>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">The requested partner identity was not found in the central registry.</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/vendors')}
          variant="ghost"
          className="rounded-[2rem] h-14 px-10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-zinc-950 hover:bg-white border border-transparent hover:border-zinc-100 transition-all shadow-sm hover:shadow-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-3" />
          Return to Registry
        </Button>
      </div>
    );
  }

  const activeStatus = statusConfig[vendor.status] || statusConfig.PENDING;

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-16 animate-fade-in">
        
        {/* Navigation & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <Button 
            onClick={() => router.push('/admin/vendors')}
            variant="ghost"
            className="h-14 px-8 rounded-[2rem] border border-zinc-200/50 bg-white/80 backdrop-blur-md hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 group w-fit"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Registry Overview
          </Button>
          
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-zinc-200/30">
            <div className="h-10 px-6 rounded-full bg-zinc-950 flex items-center gap-3 shadow-xl">
              <Fingerprint className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[10px] font-mono font-black text-white tracking-widest uppercase">
                ID: {vendor._id.slice(-12).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <div className={`h-3 w-3 rounded-full ${
                vendor.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                vendor.status === 'REJECTED' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
                'bg-blue-500 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.4)]'
              }`} />
              <span className="text-[11px] text-zinc-400 uppercase tracking-[0.4em] font-black">Partner Entity Dossier</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
              {vendor.companyName}
            </h1>
            
            <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
              Identity established <span className="text-zinc-950 font-bold">{new Date(vendor.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>. Currently operating under <span className="text-zinc-950 font-black italic underline decoration-zinc-200 underline-offset-8">{activeStatus.label}</span> protocols.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:pb-4">
            {vendor.status === 'PENDING' && (
              <>
                <Button 
                  onClick={handleApproveRegistration}
                  disabled={isProcessing}
                  className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
                >
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-4" /> : <Shield className="h-5 w-5 mr-4 group-hover:rotate-12 transition-transform" />}
                  Authorize Entity
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectModal(true)}
                  className="h-20 px-12 rounded-[2.5rem] border-zinc-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-100 transition-all text-[12px] font-black uppercase tracking-[0.25em]"
                >
                  Decline
                </Button>
              </>
            )}

            {vendor.status === 'UNDER_REVIEW' && (
              <Button 
                onClick={handleFinalApprove}
                disabled={isProcessing}
                className="h-20 px-12 rounded-[2.5rem] bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl shadow-emerald-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-4" /> : <Verified className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform" />}
                Issue Certificate
              </Button>
            )}

            {(vendor.status === 'DOCUMENTS_SUBMITTED' || vendor.status === 'UNDER_REVIEW') && (
              <Button 
                variant="outline"
                onClick={() => setShowRejectModal(true)}
                className="h-20 px-12 rounded-[2.5rem] border-zinc-200 bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all text-[12px] font-black uppercase tracking-[0.25em]"
              >
                Request Revisions
              </Button>
            )}
          </div>
        </div>

        {/* Strategic Intelligence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            { 
              label: 'Artifact Integrity', 
              value: `${documents.filter(d => d.status === 'VERIFIED').length}/${documents.length}`, 
              sub: 'Verified Documents',
              icon: FileSearch, 
              color: 'blue' 
            },
            { 
              label: 'RFP Engagement', 
              value: submissions.length, 
              sub: 'Protocol Submissions',
              icon: Database, 
              color: 'zinc' 
            },
            { 
              label: 'Conversion Yield', 
              value: `${submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'ACCEPTED').length / submissions.length) * 100) : 0}%`, 
              sub: 'Proposal Acceptance Rate',
              icon: Target, 
              color: 'emerald' 
            },
            { 
              label: 'Identity Protocol', 
              value: vendor.certificateNumber || 'AWAITING', 
              sub: 'Certificate Auth Token',
              icon: Cpu, 
              color: vendor.certificateNumber ? 'emerald' : 'amber' 
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="rounded-[3rem] p-10 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-150`}>
                  <Icon className="w-full h-full" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-950'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <Badge className="bg-zinc-50 text-zinc-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">Protocol: Active</Badge>
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className={`text-4xl font-syne font-black tracking-tighter uppercase ${stat.color === 'amber' && !vendor.certificateNumber ? 'text-zinc-200 text-2xl' : 'text-zinc-950'}`}>
                    {stat.value}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.sub}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Intelligence Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Compliance Protocol Stepper */}
            <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
                <ShieldCheck className="h-56 w-56 text-zinc-950" />
              </div>
              
              <div className="flex items-center gap-5 mb-16 relative z-10">
                <div className="h-16 w-16 rounded-[1.75rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/40 group-hover:scale-105 transition-transform">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-syne font-black italic text-zinc-950 uppercase tracking-tighter">Compliance Protocol</h2>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Ecosystem Integration Lifecycle</p>
                </div>
              </div>

              <div className="relative flex justify-between px-6">
                <div className="absolute top-6 left-12 right-12 h-[2px] bg-zinc-50 -z-0" />
                {steps.map((step, index) => {
                  const isComplete = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-6 group/step">
                      <div className={`h-12 w-12 rounded-[1.5rem] flex items-center justify-center text-sm font-black transition-all duration-700 ${
                        isComplete 
                          ? 'bg-zinc-950 text-white shadow-2xl shadow-zinc-950/30' 
                          : 'bg-white border-2 border-zinc-100 text-zinc-200 shadow-sm'
                      } ${isCurrent ? 'ring-[8px] ring-blue-50/50 border-blue-500 scale-125' : ''}`}>
                        {isComplete ? <CheckCircle className="h-6 w-6" /> : index + 1}
                      </div>
                      <div className="text-center space-y-1">
                        <span className={`text-[11px] font-black uppercase tracking-widest block transition-colors duration-500 ${isCurrent ? 'text-blue-600' : isComplete ? 'text-zinc-950' : 'text-zinc-300'}`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter opacity-0 group-hover/step:opacity-100 transition-opacity">Phase 0{index + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4">
                <TabsList className="bg-white/80 backdrop-blur-md p-2 rounded-[2.5rem] border border-zinc-200/50 shadow-xl shadow-zinc-200/30 flex h-auto shrink-0">
                  {[
                    { id: 'overview', label: 'Identity Manifest', icon: User },
                    { id: 'documents', label: 'Artifact Vault', icon: FileText },
                    { id: 'submissions', label: 'RFP Ledger', icon: Database },
                    { id: 'activity', label: 'Protocol Log', icon: History }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="rounded-full px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-zinc-950 data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all duration-500 flex items-center gap-3"
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 animate-slide-up outline-none">
                <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-12 overflow-hidden relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-12">
                      <section className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-950 border border-zinc-100">
                             <Fingerprint className="h-5 w-5" />
                          </div>
                          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-950 italic font-syne">Core Personnel Registry</h4>
                        </div>
                        <div className="space-y-10 pl-14 relative">
                          <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-zinc-100" />
                          {[
                            { label: 'Principal Representative', val: vendor.contactPerson },
                            { label: 'Verified Communication', val: vendor.email, isEmail: true },
                            { label: 'Direct Access Line', val: vendor.phone }
                          ].map((item, idx) => (
                            <div key={idx} className="group relative">
                              <div className="absolute -left-[37px] top-3 h-2.5 w-2.5 rounded-full bg-white border-2 border-zinc-200 group-hover:border-zinc-950 transition-colors z-10" />
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2 group-hover:text-zinc-950 transition-colors">{item.label}</p>
                              <p className={`text-2xl font-bold text-zinc-950 tracking-tighter ${item.isEmail ? 'lowercase' : 'uppercase'}`}>{item.val}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-12">
                      <section className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-950 border border-zinc-100">
                             <Globe className="h-5 w-5" />
                          </div>
                          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-950 italic font-syne">Operational Geography</h4>
                        </div>
                        <div className="space-y-10 pl-14 relative">
                          <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-zinc-100" />
                          <div className="group relative">
                            <div className="absolute -left-[37px] top-3 h-2.5 w-2.5 rounded-full bg-white border-2 border-zinc-200 group-hover:border-zinc-950 transition-colors z-10" />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2 group-hover:text-zinc-950 transition-colors">Physical Headquarters</p>
                            <p className="text-xl font-bold text-zinc-950 leading-snug uppercase tracking-tight italic">
                              {vendor.address?.street}, {vendor.address?.city}<br />
                              <span className="text-zinc-400 font-medium">{vendor.address?.state} {vendor.address?.zipCode}, {vendor.address?.country}</span>
                            </p>
                          </div>
                          {vendor.website && (
                            <div className="group relative">
                              <div className="absolute -left-[37px] top-3 h-2.5 w-2.5 rounded-full bg-white border-2 border-zinc-200 group-hover:border-zinc-950 transition-colors z-10" />
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2 group-hover:text-zinc-950 transition-colors">Secure Digital Domain</p>
                              <a 
                                href={vendor.website} 
                                target="_blank" 
                                className="text-2xl font-black text-blue-600 hover:text-blue-700 flex items-center gap-4 group-hover:translate-x-2 transition-all italic tracking-tighter"
                              >
                                {vendor.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                <ArrowUpRight className="h-6 w-6" />
                              </a>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 animate-slide-up outline-none">
                <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-zinc-50/80 border-b border-zinc-100">
                        <TableRow>
                          <TableHead className="h-24 px-12 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Artifact Identity</TableHead>
                          <TableHead className="h-24 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Technical Spec</TableHead>
                          <TableHead className="h-24 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Protocol Status</TableHead>
                          <TableHead className="h-24 text-right px-12 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Command</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-72 text-center">
                              <div className="flex flex-col items-center gap-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center group">
                                   <FileSearch className="h-10 w-10 text-zinc-200 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Zero artifacts detected in identity vault.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          documents.map((doc) => (
                            <TableRow key={doc._id} className="hover:bg-zinc-50/50 transition-all duration-700 group border-b border-zinc-50 last:border-0">
                              <TableCell className="px-12 py-10">
                                <div className="flex items-center gap-8">
                                  <div className="h-16 w-16 rounded-[1.75rem] bg-white flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white group-hover:shadow-2xl group-hover:-rotate-3 transition-all duration-700 border border-zinc-100 group-hover:border-zinc-950">
                                    <FileText className="h-7 w-7" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <span className="text-base font-bold text-zinc-950 uppercase tracking-tight group-hover:translate-x-2 transition-transform block">{doc.originalName}</span>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] block">{doc.documentType?.name || 'GENERIC ARTIFACT'}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-[12px] font-mono font-black text-zinc-500 uppercase tracking-tight">
                                <span className="bg-zinc-100 px-3 py-1 rounded-full text-[10px]">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                <span className="ml-3 italic">{doc.fileName.split('.').pop()?.toUpperCase()}</span>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${
                                    doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                                    doc.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                    'bg-blue-50 text-blue-600 animate-pulse'
                                  }`}
                                >
                                  {doc.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right px-12">
                                <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl text-zinc-300 hover:text-zinc-950 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-zinc-100 active:scale-95">
                                  <a href={doc.fileUrl} target="_blank"><ExternalLink className="h-6 w-6" /></a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="submissions" className="mt-0 animate-slide-up outline-none">
                <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-zinc-50/80 border-b border-zinc-100">
                        <TableRow>
                          <TableHead className="h-24 px-12 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">RFP Transaction</TableHead>
                          <TableHead className="h-24 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Fiscal Allocation</TableHead>
                          <TableHead className="h-24 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Execution Date</TableHead>
                          <TableHead className="h-24 text-right px-12 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 italic font-syne">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-72 text-center">
                               <div className="flex flex-col items-center gap-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center group">
                                   <Briefcase className="h-10 w-10 text-zinc-200 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Zero RFP transactions detected in ledger.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          submissions.map((submission) => (
                            <TableRow key={submission._id} className="hover:bg-zinc-50/50 transition-all duration-700 group border-b border-zinc-50 last:border-0">
                              <TableCell className="px-12 py-10">
                                <div className="flex items-center gap-8">
                                  <div className="h-16 w-16 rounded-[1.75rem] bg-zinc-950 flex items-center justify-center text-white shadow-2xl shadow-zinc-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                    <Database className="h-6 w-6" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <span className="text-base font-bold text-zinc-950 uppercase tracking-tight group-hover:translate-x-2 transition-transform block">RFP-ID-{submission.proposalId.slice(-8).toUpperCase()}</span>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] block">Operation Code: {submission._id.slice(-6).toUpperCase()}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-2xl font-syne font-black text-zinc-950 tracking-tighter italic">
                                ${submission.proposedAmount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-[12px] font-mono font-black text-zinc-500 uppercase tracking-widest italic">
                                {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right px-12">
                                <Badge 
                                  className={`rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm transition-all group-hover:scale-110 ${
                                    submission.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' :
                                    submission.status === 'REJECTED' ? 'bg-red-50 text-red-600 shadow-red-100' :
                                    'bg-zinc-100 text-zinc-600'
                                  }`}
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
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-0 animate-slide-up outline-none">
                <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-16">
                  <div className="space-y-16">
                    {activities.length === 0 ? (
                      <div className="text-center py-32">
                         <div className="flex flex-col items-center gap-8">
                          <div className="h-24 w-24 rounded-[3rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner group">
                             <History className="h-10 w-10 text-zinc-100 group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-300">No operational history detected.</p>
                        </div>
                      </div>
                    ) : (
                      activities.map((activity, i) => (
                        <div key={activity._id} className="flex gap-12 relative group">
                          {i !== activities.length - 1 && (
                            <div className="absolute top-16 left-8 bottom-0 w-[2px] bg-zinc-50 group-hover:bg-zinc-100 transition-colors" />
                          )}
                          <div className="h-16 w-16 rounded-[2rem] bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xl shadow-zinc-950/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative z-10">
                            <Zap className="h-7 w-7" />
                          </div>
                          <div className="space-y-4 pb-16 flex-1">
                            <h4 className="text-2xl font-bold text-zinc-950 leading-tight group-hover:translate-x-4 transition-transform duration-700 max-w-2xl">{activity.description}</h4>
                            <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                                 <Calendar className="h-4 w-4 text-blue-500" />
                                 {new Date(activity.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                                 <Settings2 className="h-4 w-4 text-emerald-500" />
                                 PROTOCOL: {activity.activityType.replace(/_/g, ' ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Business Verification Card - PREMIUM DARK MODE */}
            <Card className={`rounded-[3.5rem] border-none overflow-hidden relative transition-all duration-1000 p-12 min-h-[500px] flex flex-col justify-between group ${
              vendor.certificateNumber ? 'bg-zinc-950 text-white shadow-3xl shadow-zinc-950/50' : 'bg-zinc-100 border-2 border-dashed border-zinc-200 text-zinc-400 shadow-inner'
            }`}>
              {vendor.certificateNumber && (
                <>
                  <div className="absolute -top-20 -right-20 opacity-10 pointer-events-none group-hover:rotate-45 group-hover:scale-125 transition-transform duration-1000">
                    <ShieldCheck className="h-96 w-96" />
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
                </>
              )}
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-3">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-500">Business Integrity</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${vendor.certificateNumber ? 'text-zinc-600' : 'text-zinc-400'}`}>Official Verification Manifest</p>
                </div>

                {vendor.certificateNumber ? (
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="space-y-3 group/item">
                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.25em] group-hover/item:text-emerald-500 transition-colors">Certificate Auth Token</p>
                        <p className="text-3xl font-mono font-black tracking-tighter text-white group-hover/item:translate-x-2 transition-transform">{vendor.certificateNumber}</p>
                      </div>
                      <div className="space-y-3 group/item">
                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.25em] group-hover/item:text-emerald-500 transition-colors">Protocol Approval Date</p>
                        <p className="text-xl font-black text-white italic group-hover/item:translate-x-2 transition-transform flex items-center gap-3">
                          <Verified className="h-5 w-5 text-emerald-500" />
                          {vendor.approvalDate ? new Date(vendor.approvalDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'PROTOCOL_COMPLETE'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 space-y-10 text-center flex-1 flex flex-col justify-center">
                    <div className="h-32 w-32 rounded-[3rem] bg-white/50 backdrop-blur-md flex items-center justify-center mx-auto shadow-2xl border border-white/20 animate-pulse relative">
                       <ShieldCheck className="h-12 w-12 text-zinc-200" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.4em]">Audit Pending</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">Identity is currently undergoing secure protocol analysis.</p>
                    </div>
                  </div>
                )}
              </div>

              {vendor.certificateNumber && (
                <Button className="relative z-10 w-full h-20 rounded-[2rem] bg-white text-zinc-950 hover:bg-zinc-100 font-black uppercase tracking-[0.3em] text-[11px] shadow-3xl transition-all hover:scale-[1.03] active:scale-[0.97] group">
                  <Download className="h-5 w-5 mr-4 group-hover:-translate-y-1 transition-transform" />
                  Download Manifest
                </Button>
              )}
            </Card>

            {/* Performance Matrix */}
            <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 p-12 space-y-10 group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-950 italic font-syne">Strategic Matrix</h3>
              </div>
              
              <div className="space-y-4">
                 {[
                  { label: 'Artifact Accuracy', value: `${Math.round((documents.filter(d => d.status === 'VERIFIED').length / Math.max(documents.length, 1)) * 100)}%`, status: 'OPTIMIZED' },
                  { label: 'Network Density', value: `${submissions.length} TRANSACTIONS`, status: 'SECURE' },
                  { label: 'Risk Architecture', value: 'LOW RISK', status: 'VERIFIED', isEmerald: true },
                ].map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-6 rounded-[1.75rem] bg-zinc-50/50 group/row hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-zinc-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] group-hover/row:text-zinc-950 transition-colors">{insight.label}</span>
                      <p className="text-base font-black text-zinc-950 tracking-tighter uppercase">{insight.value}</p>
                    </div>
                    <Badge className={`border-none font-black uppercase tracking-widest text-[9px] px-4 py-2 rounded-full group-hover/row:scale-110 transition-transform ${insight.isEmerald ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-zinc-400 shadow-sm'}`}>
                      {insight.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions / Controls */}
            <Card className="rounded-[3.5rem] border-none bg-zinc-950 p-12 space-y-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_70%)]" />
               <div className="relative z-10 flex items-center gap-4 text-white">
                  <Settings2 className="h-6 w-6 text-zinc-500" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] italic font-syne">Identity Control</h3>
               </div>
               <div className="relative z-10 space-y-4">
                  <Button variant="ghost" className="w-full h-16 rounded-[1.5rem] bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] transition-all flex justify-between px-8">
                    Sync Credentials
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="w-full h-16 rounded-[1.5rem] bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] transition-all flex justify-between px-8">
                    Terminate Protocol
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Control Dialogs */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-2xl border-none shadow-3xl rounded-[4rem] p-0 overflow-hidden bg-white selection:bg-red-500 selection:text-white">
          <div className={`${vendor.status === 'PENDING' ? 'bg-red-950' : 'bg-amber-950'} p-16 relative overflow-hidden`}>
             <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:32px_32px]" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                   <AlertCircle className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-syne font-black italic text-white uppercase tracking-tighter">
                    {vendor.status === 'PENDING' ? 'Decline Entity' : 'Revision Required'}
                  </h2>
                  <p className="text-[12px] font-bold text-white/50 uppercase tracking-[0.4em]">
                    Command: Initialize Termination Protocol
                  </p>
                </div>
             </div>
          </div>
          
          <div className="p-16 space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Justification Narrative</label>
              <Textarea 
                placeholder="Specify precise logic for this operational decision..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[200px] rounded-[2.5rem] border-zinc-100 bg-zinc-50 p-8 text-zinc-950 font-bold placeholder:text-zinc-300 focus:ring-4 focus:ring-zinc-950/5 transition-all text-lg leading-relaxed resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={vendor.status === 'PENDING' ? handleRejectRegistration : handleRequestRevisions}
                disabled={isProcessing}
                className={`flex-1 h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  vendor.status === 'PENDING' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                }`}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-4" /> : <Zap className="h-5 w-5 mr-4" />}
                Confirm Execution
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowRejectModal(false)}
                className="h-20 px-12 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all"
              >
                Abort
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
