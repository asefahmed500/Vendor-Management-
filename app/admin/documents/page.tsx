'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Loader2,
  Building2,
  Clock,
  Archive,
  MoreHorizontal,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Database,
  Shield,
  Zap,
  Info,
  SearchX,
  FileSearch,
  History,
  Check,
  MoreVertical,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Filter,
  RefreshCw,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { IDocument } from '@/lib/types/document';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentVerifySchema, documentRejectSchema } from '@/lib/validation/schemas/document';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DocumentWithVendor extends IDocument {
  vendorName: string;
  vendorEmail: string;
  documentType: {
    name: string;
  };
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithVendor | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyForm = useForm<z.infer<typeof documentVerifySchema>>({
    resolver: zodResolver(documentVerifySchema),
    defaultValues: {
      comments: '',
    },
  });

  const rejectForm = useForm<z.infer<typeof documentRejectSchema>>({
    resolver: zodResolver(documentRejectSchema),
    defaultValues: {
      comments: '',
    },
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/documents');
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data.documents);
      } else {
        toast.error(data.error || 'Failed to fetch documents');
      }
    } catch (error) {
      console.error('Fetch documents error:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.vendorEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVerify = async (values: z.infer<typeof documentVerifySchema>) => {
    if (!selectedDocument) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/documents/${selectedDocument._id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: true,
          comment: values.comments,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document integrity verified');
        setShowVerifyModal(false);
        setSelectedDocument(null);
        verifyForm.reset();
        fetchDocuments();
      } else {
        toast.error(data.error || 'Failed to verify document');
      }
    } catch (error) {
      console.error('Verify document error:', error);
      toast.error('Failed to verify document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (values: z.infer<typeof documentRejectSchema>) => {
    if (!selectedDocument) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/documents/${selectedDocument._id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: false,
          comment: values.comments,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document rejected from registry');
        setShowRejectModal(false);
        setSelectedDocument(null);
        rejectForm.reset();
        fetchDocuments();
      } else {
        toast.error(data.error || 'Failed to reject document');
      }
    } catch (error) {
      console.error('Reject document error:', error);
      toast.error('Failed to verify document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDocument = (doc: DocumentWithVendor) => {
    window.open(doc.fileUrl, '_blank');
  };

  const statusCounts = {
    ALL: documents.length,
    PENDING: documents.filter((d) => d.status === 'PENDING').length,
    VERIFIED: documents.filter((d) => d.status === 'VERIFIED').length,
    REJECTED: documents.filter((d) => d.status === 'REJECTED').length,
  };

  const stats = [
    { label: 'Artifacts', value: statusCounts.ALL, icon: Database, color: 'zinc' },
    { label: 'Pending Audit', value: statusCounts.PENDING, icon: Clock, color: 'blue' },
    { label: 'Verified Integrity', value: statusCounts.VERIFIED, icon: ShieldCheck, color: 'emerald' },
    { label: 'Security Failures', value: statusCounts.REJECTED, icon: AlertCircle, color: 'red' },
  ];

  if (isLoading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <FileSearch className="h-10 w-10 text-zinc-300" />
          </div>
        </div>
        <div className="space-y-3 text-center">
           <h2 className="text-2xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Accessing Archive</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Scanning Compliance Shards…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-20 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-zinc-950 transition-colors">Admin Core</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">Compliance Shards</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Document <br /> Ledger
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Systematic audit and verification of <span className="text-zinc-950 font-bold italic">Compliance Artifacts</span>. Monitoring <span className="text-blue-600 font-black italic underline decoration-blue-100 underline-offset-8">{documents.length} security assets</span> across the network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button 
              variant="outline" 
              className="h-20 px-10 rounded-[2.5rem] border-zinc-200 text-zinc-950 hover:bg-white hover:shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.3em] group shadow-sm bg-white/50 backdrop-blur-md"
            >
              <History className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              Audit History
            </Button>
            <Button 
              onClick={fetchDocuments}
              className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
            >
              <RefreshCw className="h-5 w-5 mr-4 transition-transform duration-1000 group-hover:rotate-180" />
              Sync Archive
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="rounded-[3rem] p-10 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-150">
                  <Icon className="w-full h-full" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-950'
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className={cn(
                    "h-2 w-2 rounded-full animate-pulse shadow-lg",
                    stat.color === 'red' ? 'bg-red-500' : 'bg-emerald-500'
                  )} />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-5xl font-syne font-black tracking-tighter uppercase text-zinc-950">
                    {stat.value}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Global Shard Segment</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Operational Controls */}
        <div className="flex flex-col xl:flex-row items-center gap-8">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
            <input
              placeholder="QUERY ARCHIVE BY ASSET IDENTITY, VENDOR, OR TYPE…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-24 w-full pl-16 pr-8 bg-white border-none shadow-2xl shadow-zinc-200/40 focus-visible:ring-2 focus-visible:ring-zinc-950/5 rounded-[2.5rem] font-bold text-lg transition-all placeholder:text-zinc-300 placeholder:italic placeholder:font-medium outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-3 rounded-[3rem] border border-zinc-100 shadow-2xl shadow-zinc-200/40">
            {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-10 h-16 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500",
                  statusFilter === status
                    ? 'bg-zinc-950 text-white shadow-2xl shadow-zinc-950/30'
                    : 'text-zinc-400 hover:text-zinc-950'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Registry Table Section */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <Card className="rounded-[4rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50/80 border-b border-zinc-100">
                  <TableRow>
                    <TableHead className="h-28 px-12 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Artifact Specification</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Origin Entity</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Audit Status</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Logged On</TableHead>
                    <TableHead className="h-28 text-right px-12 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center gap-10">
                          <div className="h-32 w-32 rounded-[3.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner group relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50" />
                             <SearchX className="h-12 w-12 text-zinc-200 group-hover:scale-110 transition-transform relative z-10" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Archive Segment Empty</p>
                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-xs mx-auto">Adjust decryption parameters to scan deeper into the compliance registry.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc, index) => (
                      <TableRow 
                        key={doc._id} 
                        className="group hover:bg-zinc-50/50 transition-all duration-700 border-b border-zinc-50 last:border-0 relative"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="px-12 py-14">
                          <div className="flex items-center gap-10">
                            <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-2xl shadow-zinc-950/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
                              <FileText className="h-10 w-10 relative z-10" />
                              {doc.status === 'VERIFIED' && <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-[5px] border-white shadow-xl" />}
                            </div>
                            <div className="space-y-3">
                              <p className="text-2xl font-syne font-black text-zinc-950 tracking-tighter uppercase group-hover:translate-x-4 transition-transform duration-700 max-w-[400px] truncate italic">
                                {doc.originalName}
                              </p>
                              <div className="flex items-center gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                                <span className="text-zinc-950 font-mono bg-zinc-100 px-3 py-1 rounded-md">{doc.documentType?.name.toUpperCase() || 'GENERIC'}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                                <span className="italic">{(doc.fileSize / 1024).toFixed(0)} KB · {doc.fileName.split('.').pop()?.toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2 group-hover:scale-110 origin-left transition-transform duration-700">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Submitter Entity</p>
                             <p className="text-xl font-bold text-zinc-950 uppercase tracking-tighter italic">{doc.vendorName}</p>
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-50 truncate max-w-[200px]">{doc.vendorEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "rounded-[1.5rem] px-8 py-4 text-[10px] font-black uppercase tracking-widest border-none shadow-2xl transition-all group-hover:scale-110 italic font-syne",
                              doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                              doc.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                              'bg-blue-50 text-blue-600'
                            )}
                          >
                            <span className="flex items-center gap-3">
                               <div className={cn(
                                 "h-2 w-2 rounded-full animate-pulse",
                                 doc.status === 'VERIFIED' ? 'bg-emerald-500' :
                                 doc.status === 'REJECTED' ? 'bg-red-500' : 'bg-blue-500'
                               )} />
                               {doc.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-[1.25rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-700 text-zinc-300 group-hover:text-blue-500">
                               <Clock className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Logged On</span>
                               <span className="text-[13px] font-mono font-black uppercase tracking-widest block text-zinc-950 italic">
                                 {new Date(doc.createdAt).toLocaleDateString(undefined, { 
                                   day: '2-digit', 
                                   month: 'short', 
                                   year: 'numeric' 
                                 })}
                               </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-12">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-16 w-16 text-zinc-300 hover:text-zinc-950 hover:bg-white hover:shadow-2xl hover:border-zinc-100 border border-transparent rounded-[1.5rem] transition-all">
                                <MoreVertical className="h-7 w-7" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 rounded-[3rem] border-none shadow-3xl p-6 bg-white z-50">
                              <DropdownMenuItem onClick={() => handleViewDocument(doc)} className="rounded-[1.75rem] cursor-pointer p-6 focus:bg-zinc-50 transition-all group/item flex items-center gap-6">
                                 <div className="h-14 w-14 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20 group-hover/item:rotate-12 transition-transform">
                                   <Eye className="h-6 w-6 text-white" />
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-[13px] font-black text-zinc-950 uppercase tracking-tight">Review Artifact</span>
                                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 italic font-syne">Secure Audit Viewer</span>
                                 </div>
                                 <ArrowUpRight className="h-6 w-6 ml-auto text-zinc-200 group-hover/item:text-zinc-950 transition-colors" />
                              </DropdownMenuItem>
                              {doc.status === 'PENDING' && (
                                <>
                                  <Separator className="my-3 bg-zinc-50" />
                                  <DropdownMenuItem className="rounded-[1.75rem] cursor-pointer p-6 text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 transition-all group/item flex items-center gap-6" onClick={() => { setSelectedDocument(doc); setShowVerifyModal(true); }}>
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 shadow-sm group-hover/item:bg-white transition-colors">
                                      <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-black uppercase tracking-tight">Approve Integrity</span>
                                      <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest mt-1 italic font-syne">Final Validation</span>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-[1.75rem] cursor-pointer p-6 text-red-600 focus:bg-red-50 focus:text-red-600 transition-all group/item flex items-center gap-6" onClick={() => { setSelectedDocument(doc); setShowRejectModal(true); }}>
                                    <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100/50 shadow-sm group-hover/item:bg-white transition-colors">
                                      <AlertCircle className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-black uppercase tracking-tight">Reject Artifact</span>
                                      <span className="text-[10px] font-black text-red-400/80 uppercase tracking-widest mt-1 italic font-syne">Compliance Failure</span>
                                    </div>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Global Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
           <Card className="rounded-[4rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group col-span-1 lg:col-span-2 min-h-[400px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                 <div className="space-y-10">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                          <Cpu className="h-8 w-8 text-blue-400" />
                       </div>
                       <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-400">Security Flux</h4>
                    </div>
                    <div className="space-y-4">
                       <p className="text-6xl font-syne font-black italic tracking-tighter uppercase leading-[0.85]">Audit <br /> Integrity</p>
                       <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] max-w-sm">Global verification velocity and security shard health metrics.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Audit Yield</p>
                       <p className="text-5xl font-syne font-black text-white italic tracking-tighter">98.4%</p>
                    </div>
                    <div className="h-20 w-[1px] bg-white/10" />
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Shard Status</p>
                       <p className="text-5xl font-syne font-black text-emerald-400 italic tracking-tighter">OPTIMAL</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[4rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 flex flex-col justify-between group min-h-[400px]">
              <div className="flex items-center justify-between">
                 <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <Fingerprint className="h-10 w-10 text-zinc-950" />
                 </div>
                 <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-[0.3em] rounded-full px-6 py-3 italic font-syne shadow-sm">Identity Verified</Badge>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                   <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Registry Protocol</p>
                   <p className="text-2xl font-syne font-black text-zinc-950 uppercase tracking-tighter leading-[0.95] italic">Artifact Compliance Standards <span className="text-blue-600">v7.1.0</span> Active</p>
                 </div>
                 <div className="h-1.5 w-24 bg-zinc-950 rounded-full group-hover:w-full transition-all duration-1000" />
              </div>
           </Card>
        </div>
      </div>

      {/* Verify Modal */}
      <Dialog open={showVerifyModal} onOpenChange={(open) => {
        setShowVerifyModal(open);
        if (!open) { setSelectedDocument(null); verifyForm.reset(); }
      }}>
        <DialogContent className="max-w-xl border-none shadow-3xl rounded-[3rem] p-0 overflow-hidden bg-white">
          <div className="bg-zinc-950 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-xl">
                <ShieldCheck className="h-12 w-12 text-emerald-400" />
              </div>
              <DialogTitle className="text-4xl font-syne font-black italic text-white uppercase tracking-tighter">
                Integrity <span className="text-zinc-500">Validation</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-4 max-w-[360px] leading-relaxed">
                Confirming compliance protocols for <span className="text-white underline decoration-white/20 underline-offset-4">{selectedDocument?.vendorName}</span>. Immutable log entry will be generated.
              </DialogDescription>
            </div>
          </div>
          
          <div className="p-12">
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-10">
                <FormField
                  control={verifyForm.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Audit Notes & Justification</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="INITIALIZE VALIDATION COMMENTS FOR THE SECURE ARCHIVE…"
                          className="min-h-[180px] bg-zinc-50 border-none focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all resize-none rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] p-8 shadow-inner leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  <Button type="submit" disabled={isProcessing} className="w-full h-20 rounded-[2.5rem] bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-zinc-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                    Execute Verification Protocol
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowVerifyModal(false)} className="h-14 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 hover:text-zinc-950 transition-colors">
                    Abort Audit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={(open) => {
        setShowRejectModal(open);
        if (!open) { setSelectedDocument(null); rejectForm.reset(); }
      }}>
        <DialogContent className="max-w-xl border-none shadow-3xl rounded-[3rem] p-0 overflow-hidden bg-white">
          <div className="bg-red-950 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-xl">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <DialogTitle className="text-4xl font-syne font-black italic text-white uppercase tracking-tighter">
                Failure <span className="text-red-400">Protocol</span>
              </DialogTitle>
              <DialogDescription className="text-red-300/50 font-bold text-[11px] uppercase tracking-[0.2em] mt-4 max-w-[360px] leading-relaxed">
                Mandatory failure justification required for rejecting artifacts from <span className="text-white underline decoration-white/20 underline-offset-4">{selectedDocument?.vendorName}</span>.
              </DialogDescription>
            </div>
          </div>
          <div className="p-12">
            <Form {...rejectForm}>
              <form onSubmit={rejectForm.handleSubmit(handleReject)} className="space-y-10">
                <FormField
                  control={rejectForm.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 ml-2">Compliance Failure Logic</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="DESCRIBE SPECIFIC COMPLIANCE FAILURES DETECTED DURING AUDIT…"
                          className="min-h-[180px] bg-red-50/20 border-none focus:bg-white focus:ring-2 focus:ring-red-100 transition-all resize-none rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] p-8 shadow-inner leading-relaxed text-red-900 placeholder:text-red-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  <Button type="submit" disabled={isProcessing} variant="destructive" className="w-full h-20 rounded-[2.5rem] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <XCircle className="h-5 w-5 mr-3" />}
                    Finalize Rejection Protocol
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowRejectModal(false)} className="h-14 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 hover:text-zinc-950 transition-colors">
                    Abort Operation
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
