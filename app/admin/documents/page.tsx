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
  ShieldCheck,
  Filter,
  ArrowUpRight,
  Database,
  Building2,
  Clock,
  ExternalLink,
  MoreVertical,
  ShieldAlert,
  Archive,
  Terminal,
  FileCheck
} from 'lucide-react';
import { IDocument, DocumentStatus } from '@/lib/types/document';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentVerifySchema, documentRejectSchema } from '@/lib/validation/schemas/document';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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

  // React Hook Form for verify
  const verifyForm = useForm<z.infer<typeof documentVerifySchema>>({
    resolver: zodResolver(documentVerifySchema),
    defaultValues: {
      comments: '',
    },
  });

  // React Hook Form for reject
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
        toast.error(data.error || 'System rejection identified');
      }
    } catch (error) {
      console.error('Fetch documents error:', error);
      toast.error('Nexus connection failure');
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
        toast.success('Asset verification sequence complete');
        setShowVerifyModal(false);
        setSelectedDocument(null);
        verifyForm.reset();
        fetchDocuments();
      } else {
        toast.error(data.error || 'Verification failure');
      }
    } catch (error) {
      console.error('Verify document error:', error);
      toast.error('System handshake error');
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
        toast.error('Asset rejected and quarantined');
        setShowRejectModal(false);
        setSelectedDocument(null);
        rejectForm.reset();
        fetchDocuments();
      } else {
        toast.error(data.error || 'Rejection protocol failed');
      }
    } catch (error) {
      console.error('Reject document error:', error);
      toast.error('System handshake error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDocument = (doc: DocumentWithVendor) => {
    window.open(doc.fileUrl, '_blank');
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'VERIFIED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'default';
    }
  };

  const statusCounts = {
    ALL: documents.length,
    PENDING: documents.filter((d) => d.status === 'PENDING').length,
    VERIFIED: documents.filter((d) => d.status === 'VERIFIED').length,
    REJECTED: documents.filter((d) => d.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Asset Verifier</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Database className="h-3 w-3" />
              Immutable Document Vault
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Security Vault
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Comprehensive audit and oversight of all corporate submissions. Execute verification sequences or quarantine non-compliant assets.
          </p>
        </div>

        <div className="flex items-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Assets</span>
            <span className="text-xl font-black uppercase tracking-tighter">{documents.length}</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pending Review</span>
            <span className="text-xl font-black uppercase tracking-tighter text-amber-500">{statusCounts.PENDING}</span>
          </div>
        </div>
      </div>

      {/* Control Center */}
      <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-zinc-50 dark:divide-zinc-900">
          {/* Search */}
          <div className="p-8 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Global Tracer</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search Vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="p-8 space-y-3 lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Logic Filter</label>
            <div className="flex flex-wrap gap-3">
              {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as DocumentStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 flex items-center gap-3 ${statusFilter === status
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-950 text-zinc-400 border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                >
                  {status}
                  <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[8px] font-black bg-white/10 dark:bg-black/10 border-none">
                    {statusCounts[status]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
        <CardHeader className="p-10 flex flex-row items-center justify-between border-b-2 border-zinc-50 dark:border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Archive className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter">Asset Registry</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live document processing stream</CardDescription>
            </div>
          </div>
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && documents.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
              <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center border-2 animate-pulse">
                <Terminal className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Accessing Vault Nodes...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-8 text-center">
              <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800 shadow-xl">
                <FileText className="h-10 w-10 text-zinc-200" />
              </div>
              <div className="max-w-xs space-y-2">
                <p className="text-xl font-black uppercase tracking-tight">Vault Empty</p>
                <p className="text-xs font-bold text-zinc-400 uppercase leading-relaxed tracking-widest">
                  Zero assets identified matching the current query parameters.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b-2 border-zinc-50 dark:border-zinc-900">
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Asset Identity</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Originating Node</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Logic State</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Seal Date</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-50 dark:divide-zinc-900">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-black uppercase tracking-tight line-clamp-1">{doc.originalName}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{(doc.fileSize / 1024).toFixed(1)} KB • {doc.documentType?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-zinc-300" />
                            <span className="text-xs font-black uppercase tracking-tighter">{doc.vendorName}</span>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">{doc.vendorEmail}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <Badge variant={getStatusColor(doc.status)} className="font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-md border-2">
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            onClick={() => handleViewDocument(doc)}
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {doc.status === 'PENDING' && (
                            <>
                              <Button
                                onClick={() => { setSelectedDocument(doc); setShowVerifyModal(true); }}
                                size="icon"
                                variant="outline"
                                className="h-10 w-10 rounded-xl border-2 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => { setSelectedDocument(doc); setShowRejectModal(true); }}
                                size="icon"
                                variant="outline"
                                className="h-10 w-10 rounded-xl border-2 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Modals */}
      <Dialog open={showVerifyModal} onOpenChange={(open) => {
        setShowVerifyModal(open);
        if (!open) { setSelectedDocument(null); verifyForm.reset(); }
      }}>
        <DialogContent className="rounded-[2.5rem] border-2 shadow-2xl p-10 max-w-md">
          <DialogHeader className="gap-6 text-center">
            <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/10">
              <FileCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Seal Asset</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Submit verification hash to seal document into immutable registry.
              </DialogDescription>
            </div>
          </DialogHeader>
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-8 mt-6">
              <FormField
                control={verifyForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Audit Ledger Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Asset meets nexus requirements..."
                        className="rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" onClick={() => setShowVerifyModal(false)} className="h-14 rounded-2xl font-black uppercase tracking-tight border-2">Cancel</Button>
                <Button type="submit" disabled={isProcessing} className="h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Seal'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={(open) => {
        setShowRejectModal(open);
        if (!open) { setSelectedDocument(null); rejectForm.reset(); }
      }}>
        <DialogContent className="rounded-[2.5rem] border-2 shadow-2xl p-10 max-w-md">
          <DialogHeader className="gap-6 text-center">
            <div className="h-16 w-16 rounded-3xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-500/10">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Asset Quarantine</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Quarantine asset due to compliance failure. High level rejection protocol.
              </DialogDescription>
            </div>
          </DialogHeader>
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)} className="space-y-8 mt-6">
              <FormField
                control={rejectForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Integrity Violation Detail</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Asset fails cryptographic parity..."
                        className="rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" onClick={() => setShowRejectModal(false)} className="h-14 rounded-2xl font-black uppercase tracking-tight border-2">Cancel</Button>
                <Button type="submit" disabled={isProcessing} variant="destructive" className="h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-rose-500/20">
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Execute Reject'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
