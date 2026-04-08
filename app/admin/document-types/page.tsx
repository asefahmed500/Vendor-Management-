'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Search,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DocumentType {
  _id: string;
  name: string;
  category: string;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  allowedFormats: string[];
  maxSizeMB: number;
}

const documentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['BUSINESS_REGISTRATION', 'TAX', 'BANKING', 'CERTIFICATES_LICENCES', 'INSURANCE', 'CUSTOM']),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  allowedFormats: z.string().default('pdf,doc,docx,jpg,png'),
  maxSizeMB: z.coerce.number().min(1).max(50).default(10),
});

const categoryLabels: Record<string, string> = {
  BUSINESS_REGISTRATION: 'Business Registration',
  TAX: 'Tax Document',
  BANKING: 'Banking',
  CERTIFICATES_LICENCES: 'Certificates & Licenses',
  INSURANCE: 'Insurance',
  CUSTOM: 'Custom',
};

export default function DocumentTypesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof documentTypeSchema>>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: {
      name: '',
      category: 'BUSINESS_REGISTRATION',
      description: '',
      isRequired: false,
      allowedFormats: 'pdf,doc,docx,jpg,png',
      maxSizeMB: 10,
    },
  });

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/document-types');
      const data = await response.json();

      if (data.success) {
        setDocumentTypes(data.data.documentTypes);
      } else {
        toast.error(data.error || 'Failed to fetch document types');
      }
    } catch (error) {
      console.error('Fetch document types error:', error);
      toast.error('Failed to fetch document types');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTypes = documentTypes.filter((dt) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      dt.name.toLowerCase().includes(search) ||
      dt.category.toLowerCase().includes(search)
    );
  });

  const handleOpenModal = (type?: DocumentType) => {
    if (type) {
      setEditingType(type);
      form.reset({
        name: type.name,
        category: type.category as any,
        description: type.description || '',
        isRequired: type.isRequired,
        allowedFormats: type.allowedFormats.join(','),
        maxSizeMB: type.maxSizeMB,
      });
    } else {
      setEditingType(null);
      form.reset({
        name: '',
        category: 'BUSINESS_REGISTRATION',
        description: '',
        isRequired: false,
        allowedFormats: 'pdf,doc,docx,jpg,png',
        maxSizeMB: 10,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (values: z.infer<typeof documentTypeSchema>) => {
    try {
      setIsProcessing(true);
      
      const payload = {
        ...values,
        allowedFormats: values.allowedFormats.split(',').map(f => f.trim()),
      };

      const url = editingType 
        ? `/api/admin/document-types/${editingType._id}`
        : '/api/admin/document-types';
      
      const method = editingType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingType ? 'Document type updated' : 'Document type created');
        setShowModal(false);
        fetchDocumentTypes();
      } else {
        toast.error(data.error || 'Failed to save document type');
      }
    } catch (error) {
      console.error('Save document type error:', error);
      toast.error('Failed to save document type');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document type?')) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/document-types/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document type deleted');
        fetchDocumentTypes();
      } else {
        toast.error(data.error || 'Failed to delete document type');
      }
    } catch (error) {
      console.error('Delete document type error:', error);
      toast.error('Failed to delete document type');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleActive = async (type: DocumentType) => {
    try {
      const response = await fetch(`/api/admin/document-types/${type._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !type.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Document type ${type.isActive ? 'deactivated' : 'activated'}`);
        fetchDocumentTypes();
      } else {
        toast.error(data.error || 'Failed to update document type');
      }
    } catch (error) {
      console.error('Toggle document type error:', error);
      toast.error('Failed to update document type');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Document Types
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage required document types for vendor compliance
          </p>
        </div>

        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Document Type
        </Button>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search document types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Types List */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Document Types</CardTitle>
                <CardDescription className="text-sm">{documentTypes.length} types configured</CardDescription>
              </div>
            </div>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && documentTypes.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center animate-pulse">
                <FileText className="h-5 w-5 text-zinc-500" />
              </div>
              <p className="text-sm text-muted-foreground">Loading document types...</p>
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">No document types found</p>
                <p className="text-sm text-muted-foreground mt-1">Add document types to require from vendors</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredTypes.map((type) => (
                <div key={type._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      type.isRequired 
                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                    }`}>
                      {type.isRequired ? <ShieldCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{type.name}</p>
                        {type.isRequired && (
                          <Badge variant="warning" className="text-xs">Required</Badge>
                        )}
                        {!type.isActive && (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {categoryLabels[type.category]} · Max {type.maxSizeMB}MB · {type.allowedFormats.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleOpenModal(type)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(type._id)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? 'Edit Document Type' : 'Add Document Type'}</DialogTitle>
            <DialogDescription>
              {editingType ? 'Update the document type details' : 'Create a new document type for vendors to upload'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Business Registration Certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what this document should contain..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mb-0">Required</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxSizeMB"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Size (MB)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="allowedFormats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Formats (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="pdf,doc,docx,jpg,png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editingType ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
