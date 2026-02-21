'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertCircle,
  File as FileIcon,
  Info,
  FileCheck,
  Loader2,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Plus,
  Monitor,
  Eye,
  CheckCircle2,
  Hash
} from 'lucide-react';
import { IVendor } from '@/lib/types/vendor';
import { IDocument, DocumentStatus } from '@/lib/types/document';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentUploadSchema } from '@/lib/validation/schemas/document';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';

const statusConfig: Record<
  DocumentStatus,
  { label: string; variant: 'default' | 'success' | 'danger' | 'warning'; className: string; icon: React.ElementType; description: string }
> = {
  PENDING: {
    label: 'In Review',
    variant: 'warning',
    className: 'border-2 border-amber-500/20 bg-amber-500/10 text-amber-600',
    icon: Clock,
    description: 'Awaiting admin review'
  },
  VERIFIED: {
    label: 'Verified',
    variant: 'success',
    className: 'border-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    icon: CheckCircle,
    description: 'Document verified'
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
    className: 'border-2 border-rose-500/20 bg-rose-500/10 text-rose-600',
    icon: XCircle,
    description: 'Document rejected'
  },
};

const requiredDocumentTypes = [
  { id: '1', name: 'Certificate of Incorporation', category: 'BUSINESS_REGISTRATION', description: 'Official registration document' },
  { id: '2', name: 'Business Registration Certificate', category: 'BUSINESS_REGISTRATION', description: 'Business license' },
  { id: '3', name: 'Tax Identification Number (TIN)', category: 'TAX', description: 'Tax registration document' },
  { id: '4', name: 'Bank Account Details', category: 'BANKING', description: 'Bank verification letter or cancelled cheque' },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form for document upload
  const uploadForm = useForm<z.infer<typeof documentUploadSchema>>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentTypeId: '',
      file: undefined,
    },
  });

  // Track selected file for UI display
  const [selectedFileDisplay, setSelectedFileDisplay] = useState<File | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const [vendorRes, docsRes] = await Promise.all([
        fetch('/api/vendor/profile'),
        fetch('/api/vendor/documents'),
      ]);

      if (vendorRes.ok) {
        const vendorData = await vendorRes.json();
        setVendor(vendorData.data.vendor);
      }

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.data.documents);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileDisplay(file);
      uploadForm.setValue('file', file);
    }
  };

  const handleUpload = async (values: z.infer<typeof documentUploadSchema>) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', values.file as File);
      formData.append('documentTypeId', values.documentTypeId);

      const response = await fetch('/api/vendor/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Nexus transmission successful');
      uploadForm.reset();
      setSelectedFileDisplay(null);
      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchDocuments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Purge this document node from the vault?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vendor/documents/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success('Document purged');
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to purge document');
    }
  };

  const handleSubmitDocuments = async () => {
    const pendingDocs = documents.filter((d) => d.status === 'PENDING');
    if (pendingDocs.length === 0 && documents.length === 0) {
      toast.error('No document nodes identified for transmission');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vendor/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentIds: documents.map((d) => d._id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      toast.success('Documents submitted for audit');
      router.push('/vendor/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transition failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-0">
        <div className="h-32 bg-muted animate-pulse rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-muted animate-pulse rounded-[3rem]" />
            <div className="h-[400px] bg-muted animate-pulse rounded-[3rem]" />
          </div>
          <div className="h-[500px] bg-muted animate-pulse rounded-[3rem]" />
        </div>
      </div>
    );
  }

  const canUpload = vendor?.status === 'APPROVED_LOGIN';
  const canSubmit = documents.length > 0 && vendor?.status === 'APPROVED_LOGIN';

  // Calculate document progress
  const uploadedDocs = requiredDocumentTypes.filter(doc =>
    documents.some(d => d.documentTypeId === doc.id)
  ).length;
  const progress = (uploadedDocs / requiredDocumentTypes.length) * 100;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-6xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Secure Document Vault</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              End-to-End Encrypted
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Verification Assets
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Submit and manage your corporate verification documents. Automated audit loops verify identity and compliance across the network.
          </p>
        </div>

        {vendor?.rejectionReason && (
          <Badge variant="danger" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 animate-pulse">
            Audit Failure Identified
          </Badge>
        )}
      </div>

      {/* Progress & Alert Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden p-8 flex items-center gap-8">
          <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border-4 border-white dark:border-zinc-900 shadow-xl shrink-0">
            <FileCheck className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase tracking-tighter text-lg">Transmission Level</h3>
              <span className="text-xs font-black text-primary">{Math.round(progress)}% Verified</span>
            </div>
            <div className="relative h-3 bg-zinc-50 dark:bg-zinc-900 rounded-full overflow-hidden border shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {uploadedDocs} of {requiredDocumentTypes.length} required assets uploaded to node
            </p>
          </div>
        </Card>

        {vendor?.rejectionReason ? (
          <Card className="rounded-[2.5rem] border-2 border-rose-500/20 bg-rose-50 dark:bg-rose-950/20 shadow-xl p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-black uppercase tracking-tighter">Correction Required</span>
            </div>
            <p className="text-[11px] font-bold text-rose-700/80 dark:text-rose-400 uppercase leading-relaxed">
              Reason: {vendor.rejectionReason}
            </p>
          </Card>
        ) : (
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900 shadow-xl p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 text-indigo-500">
              <Monitor className="h-5 w-5" />
              <span className="font-black uppercase tracking-tighter">System Health</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed">
              All systems operational. Vault encryption active.
            </p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Upload Console */}
          {canUpload && (
            <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
              <CardHeader className="p-10 border-b-2 border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black uppercase tracking-tighter">Upload Console</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest">Transmit new asset to nexus</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-black text-[10px] items-center gap-2 px-3 py-1 rounded-lg border-2">
                  MAX 10MB / NODE
                </Badge>
              </CardHeader>
              <CardContent className="p-10">
                <Form {...uploadForm}>
                  <form onSubmit={uploadForm.handleSubmit(handleUpload)} className="space-y-8">
                    <FormField
                      control={uploadForm.control}
                      name="documentTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400 px-1">Target Asset Type</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isUploading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs flex items-center px-6">
                                <SelectValue placeholder="System Classification" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl p-2 border-2">
                              {requiredDocumentTypes.map((type) => {
                                const isUploaded = documents.some(d => d.documentTypeId === type.id);
                                return (
                                  <SelectItem
                                    key={type.id}
                                    value={type.id}
                                    disabled={isUploaded}
                                    className="rounded-xl h-12 mb-1"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-xs uppercase tracking-tight">{type.name}</span>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{type.description}</span>
                                      </div>
                                      {isUploaded && <CheckCircle className="h-4 w-4 text-emerald-500 ml-4" />}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={uploadForm.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400 px-1">Data Packet (File)</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type="file"
                                  id="file"
                                  onChange={(e) => {
                                    handleFileSelect(e);
                                    field.onChange(e.target.files?.[0]);
                                  }}
                                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                                  disabled={isUploading}
                                  className="h-20 cursor-pointer border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl file:hidden flex items-center justify-center text-center p-0 hover:border-primary/50 transition-colors"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-3 text-zinc-400 group-hover:text-primary transition-colors">
                                  <Zap className="h-5 w-5" />
                                  <span className="font-black uppercase tracking-widest text-[11px]">SELECT PACKET TO TRANSMIT</span>
                                </div>
                              </div>
                            </FormControl>
                          </div>

                          {selectedFileDisplay && (
                            <div className="mt-4 flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border-2 border-white dark:border-zinc-800 rounded-2xl shadow-inner animate-in slide-in-from-top-2 duration-300">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <FileIcon className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black uppercase tracking-tight truncate">{selectedFileDisplay.name}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{(selectedFileDisplay.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedFileDisplay(null);
                                  field.onChange(undefined);
                                  (document.getElementById('file') as HTMLInputElement).value = '';
                                }}
                                className="h-10 w-10 p-0 rounded-xl hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <FormMessage className="text-[10px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isUploading || !selectedFileDisplay}
                      className="w-full h-16 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 gap-3 group/btn hover:scale-[1.01] transition-transform"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          UPLOADING PACKET
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5" />
                          EXECUTE TRANSMISSION
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Asset Management Table */}
          <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
            <CardHeader className="p-10 flex flex-row items-center justify-between border-b-2 border-zinc-50 dark:border-zinc-900">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter">Vault Repository</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest">Authorized data assets</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-widest px-4 h-8 rounded-lg flex items-center gap-2">
                <Hash className="h-3 w-3" />
                {documents.length} ENTITIES
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800 mb-6">
                    <FileIcon className="h-10 w-10 text-zinc-300" />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <p className="text-xl font-black uppercase tracking-tight">Vault Empty</p>
                    <p className="text-xs font-bold text-zinc-400 uppercase leading-relaxed tracking-widest">
                      Initialize first transmission to populate the node directory.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y-2 divide-zinc-50 dark:divide-zinc-900">
                  {documents.map((doc) => {
                    const config = statusConfig[doc.status];
                    const StatusIcon = config.icon;
                    const docTypeInfo = requiredDocumentTypes.find(t => t.id === doc.documentTypeId);

                    return (
                      <div
                        key={doc._id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-xl transition-transform group-hover:scale-110 ${doc.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-600' :
                            doc.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-600' :
                              'bg-primary/10 text-primary'
                            }`}>
                            <FileText className="h-7 w-7" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-black text-sm uppercase tracking-tight truncate max-w-[200px]">{doc.originalName}</p>
                              {docTypeInfo && (
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 border-zinc-200 dark:border-zinc-800">
                                  {docTypeInfo.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                              <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB DATA</span>
                              <span className="opacity-30">•</span>
                              <span>SYNC: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            {doc.verification && (doc.verification as { comments?: string }).comments && (
                              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-900/80 rounded-2xl border-2 border-white dark:border-zinc-950 shadow-inner text-[11px] font-bold text-zinc-500 uppercase flex items-start gap-3">
                                <Info className="h-4 w-4 text-primary shrink-0 opacity-70" />
                                <span><span className="text-zinc-400 font-black">AUDIT LOG:</span> {(doc.verification as { comments?: string }).comments}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:self-center shrink-0">
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={config.variant} className={`font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-lg ${config.className}`}>
                              <StatusIcon className="mr-1.5 h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>

                          <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-900 mx-2" />

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary border-transparent hover:border-primary/20 border transition-all"
                              asChild
                            >
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Inspect Packet"
                              >
                                <Eye className="h-5 w-5" />
                              </a>
                            </Button>

                            {canUpload && doc.status === 'PENDING' && (
                              <Button
                                variant="ghost"
                                onClick={() => handleDelete(doc._id)}
                                className="h-12 w-12 rounded-xl text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all"
                                title="Purge Node"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            {canSubmit && (
              <CardFooter className="p-10 border-t-2 border-zinc-50 dark:border-zinc-900 bg-zinc-50/10 flex-col items-center gap-4">
                <Button
                  onClick={handleSubmitDocuments}
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-tight shadow-2xl shadow-primary/20 gap-3 group/submit"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      TRANSITIONING PACKETS
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 group-hover/submit:scale-110 transition-transform" />
                      SUBMIT ALL ASSETS FOR AUDIT
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <ShieldCheck className="h-3 w-3" />
                  Submission locks packets for secure audit sequence.
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Audit Status Matrix */}
        <div className="space-y-10">
          <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden p-8">
            <CardHeader className="p-0 pb-6 border-b-2 border-zinc-50 dark:border-zinc-900 mb-6">
              <CardTitle className="text-lg font-black uppercase tracking-tighter">Audit Matrix</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Compliance verification loop</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {requiredDocumentTypes.map((doc) => {
                  const uploadedDoc = documents.find(d => d.documentTypeId === doc.id);
                  const isVerified = uploadedDoc?.status === 'VERIFIED';
                  const isPending = uploadedDoc?.status === 'PENDING';
                  const isRejected = uploadedDoc?.status === 'REJECTED';

                  return (
                    <div key={doc.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all ${isVerified ? 'border-emerald-500/10 bg-emerald-50/50 dark:bg-emerald-950/10' :
                      isPending ? 'border-amber-500/10 bg-amber-50/50 dark:bg-amber-950/10' :
                        isRejected ? 'border-rose-500/10 bg-rose-50/50 dark:bg-rose-950/10' :
                          'border-zinc-50 dark:border-zinc-900 bg-transparent'
                      }`}>
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${isVerified ? 'bg-emerald-500 text-white border-emerald-400' :
                        isPending ? 'bg-amber-500 text-white border-amber-400' :
                          isRejected ? 'bg-rose-500 text-white border-rose-400' :
                            'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        }`}>
                        {isVerified ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isPending ? (
                          <Clock className="h-4 w-4" />
                        ) : isRejected ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-current opacity-30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className={`text-[11px] font-black uppercase tracking-tight ${isVerified ? 'text-emerald-700 dark:text-emerald-400' :
                          isPending ? 'text-amber-700 dark:text-amber-400' :
                            isRejected ? 'text-rose-700 dark:text-rose-400' :
                              'text-zinc-600 dark:text-zinc-400'
                          }`}>
                          {doc.name}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{doc.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Secure Transmission Card */}
          <Card className="rounded-[3rem] border-2 border-primary/20 bg-primary/5 p-8 transition-all hover:scale-[1.02]">
            <CardContent className="p-0 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center text-primary shadow-sm border-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="font-black uppercase tracking-tighter text-sm text-primary">Protocol Guidance</p>
              </div>
              <div className="space-y-4">
                {[
                  'CLEAR DATA SCAN RENDERS',
                  'PDF / JPG / PNG CHANNELS',
                  'MAX 10MB PER DATA PACKET',
                  'ACTIVE & VALID CREDENTIALS'
                ].map(tip => (
                  <div key={tip} className="flex items-center gap-3">
                    <ArrowRight className="h-3 w-3 text-primary opacity-50" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
