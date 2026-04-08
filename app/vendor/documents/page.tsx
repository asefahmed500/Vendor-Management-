'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2,
  AlertCircle,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';
import { IDocument, DocumentStatus } from '@/lib/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface DocumentType {
  _id: string;
  name: string;
  category: string;
  isRequired: boolean;
}

const statusConfig: Record<DocumentStatus, { label: string; variant: 'default' | 'success' | 'danger' | 'warning' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  VERIFIED: { label: 'Verified', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadForm = useForm({
    defaultValues: { documentTypeId: '' },
  });

  useEffect(() => {
    Promise.all([fetchDocuments(), fetchDocumentTypes()]);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/vendor/documents');
      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch('/api/admin/document-types');
      if (response.ok) {
        const result = await response.json();
        setDocumentTypes(result.data.documentTypes || []);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const onUpload = async (data: { documentTypeId: string }) => {
    const fileInput = document.getElementById('document-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentTypeId', data.documentTypeId);

      const response = await fetch('/api/vendor/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('Document uploaded successfully');
      uploadForm.reset();
      fileInput.value = '';
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`/api/vendor/documents/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Document deleted');
        fetchDocuments();
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const verifiedCount = documents.filter(d => d.status === 'VERIFIED').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Documents</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Document Vault
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your compliance documents
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{verifiedCount}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{rejectedCount}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Form */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(onUpload)} className="flex flex-col md:flex-row gap-4">
              <FormField
                control={uploadForm.control}
                name="documentTypeId"
                render={({ field }) => (
                  <FormItem className="md:w-64">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex-1">
                <Input 
                  id="document-file" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="cursor-pointer"
                />
              </div>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </form>
          </Form>
          {isUploading && <Progress value={uploadProgress} className="mt-4" />}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.originalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusConfig[doc.status].variant}>
                      {statusConfig[doc.status].label}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}