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
  Building2,
  Clock,
  ExternalLink,
  MoreVertical,
  AlertTriangle,
  Archive,
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
        toast.success('Document verified successfully');
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
        toast.success('Document rejected');
        setShowRejectModal(false);
        setSelectedDocument(null);
        rejectForm.reset();
        fetchDocuments();
      } else {
        toast.error(data.error || 'Failed to reject document');
      }
    } catch (error) {
      console.error('Reject document error:', error);
      toast.error('Failed to reject document');
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and verify vendor compliance documents
          </p>
        </div>

        <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-600">Total</span>
            <span className="text-lg font-semibold">{documents.length}</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-600">Pending</span>
            <span className="text-lg font-semibold text-amber-600">{statusCounts.PENDING}</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-600">Verified</span>
            <span className="text-lg font-semibold text-emerald-600">{statusCounts.VERIFIED}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-600 dark:hover:bg-zinc-700'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    statusFilter === status
                      ? 'bg-white/20 dark:bg-black/20'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}>
                    {statusCounts[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Archive className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Document Review</CardTitle>
                <CardDescription className="text-sm">Review and verify vendor submissions</CardDescription>
              </div>
            </div>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && documents.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center animate-pulse">
                <FileText className="h-5 w-5 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-600">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">No documents found</p>
                <p className="text-sm text-zinc-600 mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400 transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium line-clamp-1">{doc.originalName}</div>
                            <div className="text-xs text-zinc-600">{(doc.fileSize / 1024).toFixed(1)} KB · {doc.documentType?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-zinc-600" />
                          <div>
                            <div className="text-sm font-medium">{doc.vendorName}</div>
                            <div className="text-xs text-zinc-600">{doc.vendorEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusColor(doc.status)} className="text-xs">
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleViewDocument(doc)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {doc.status === 'PENDING' && (
                            <>
                              <Button
                                onClick={() => { setSelectedDocument(doc); setShowVerifyModal(true); }}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => { setSelectedDocument(doc); setShowRejectModal(true); }}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
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

      {/* Verify Modal */}
      <Dialog open={showVerifyModal} onOpenChange={(open) => {
        setShowVerifyModal(open);
        if (!open) { setSelectedDocument(null); verifyForm.reset(); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center">Verify Document</DialogTitle>
            <DialogDescription className="text-center">
              Approve this document and add verification notes.
            </DialogDescription>
          </DialogHeader>
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4 mt-4">
              <FormField
                control={verifyForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any notes about this verification..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowVerifyModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700">
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify Document
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={(open) => {
        setShowRejectModal(open);
        if (!open) { setSelectedDocument(null); rejectForm.reset(); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center">Reject Document</DialogTitle>
            <DialogDescription className="text-center">
              Provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)} className="space-y-4 mt-4">
              <FormField
                control={rejectForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why this document was rejected..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing} variant="destructive">
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reject Document
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
