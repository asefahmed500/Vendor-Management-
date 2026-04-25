'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Search,
  Loader2,
  ShieldCheck,
  Edit,
  Trash2,
  Settings2,
  Lock,
  Database,
  Hash,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  ChevronLeft,
  RefreshCw,
  Clock,
  Zap,
  Info,
  SearchX,
  FileCode,
  Shield,
  MoreVertical,
  ArrowUpRight,
  LayoutGrid,
  Check,
  Layers,
  Cpu,
  Network,
  Activity
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
        toast.success(editingType ? 'Schema updated successfully' : 'New schema initialized');
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
    if (!confirm('Are you sure you want to delete this schema definition? This action is permanent.')) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/document-types/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Schema deleted from registry');
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
        toast.success(`Protocol ${type.isActive ? 'suspended' : 'activated'}`);
        fetchDocumentTypes();
      } else {
        toast.error(data.error || 'Failed to update document type');
      }
    } catch (error) {
      console.error('Toggle document type error:', error);
      toast.error('Failed to update document type');
    }
  };

  const stats = [
    { label: 'Active Protocols', value: documentTypes.filter(t => t.isActive).length, icon: Database, color: 'blue' },
    { label: 'Mandatory Gates', value: documentTypes.filter(t => t.isRequired).length, icon: Lock, color: 'emerald' },
    { label: 'Registry Classes', value: new Set(documentTypes.map(t => t.category)).size, icon: Layers, color: 'zinc' },
    { label: 'Ingestion Flux', value: documentTypes.length, icon: Activity, color: 'red' },
  ];

  if (isLoading && documentTypes.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <FileCode className="h-10 w-10 text-zinc-300" />
          </div>
        </div>
        <div className="space-y-3 text-center">
           <h2 className="text-2xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Decrypting Schema</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Scanning Architecture Segments…</p>
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
              <span className="text-zinc-950 italic">Registry Architecture</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Registry <br /> Schema
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Configure compliance protocols, validation logic, and ingestion parameters for the <span className="text-zinc-950 font-bold italic text-blue-600 underline decoration-blue-100 underline-offset-8">Global Vendor Network</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button 
              onClick={() => handleOpenModal()}
              className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
            >
              <Plus className="h-5 w-5 mr-4 transition-transform duration-500 group-hover:rotate-90" />
              Initialize Protocol
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
                  <Badge className="bg-zinc-50 text-zinc-400 border-none px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-full italic font-syne">LIVE_SEGMENT</Badge>
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-5xl font-syne font-black tracking-tighter uppercase text-zinc-950">
                    {stat.value}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">System Architecture Core</p>
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
              placeholder="FILTER ARCHIVE BY PROTOCOL IDENTITY OR CLASS TYPE…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-24 w-full pl-16 pr-8 bg-white border-none shadow-2xl shadow-zinc-200/40 focus-visible:ring-2 focus-visible:ring-zinc-950/5 rounded-[2.5rem] font-bold text-lg transition-all placeholder:text-zinc-300 placeholder:italic placeholder:font-medium outline-none"
            />
          </div>
          
          <Button 
            onClick={fetchDocumentTypes}
            variant="outline"
            className="h-24 px-10 rounded-[2.5rem] border-zinc-200 text-zinc-950 hover:bg-white hover:shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.3em] group shadow-sm bg-white/50 backdrop-blur-md"
          >
            <RefreshCw className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-transform duration-1000 group-hover:rotate-180" />
            Re-Index
          </Button>
        </div>

        {/* Protocol Registry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTypes.length === 0 ? (
            <Card className="col-span-full rounded-[4rem] border-2 border-dashed border-zinc-200 bg-white/50 p-32 text-center">
              <div className="flex flex-col items-center justify-center gap-10">
                <div className="h-32 w-32 rounded-[3.5rem] bg-white flex items-center justify-center border border-zinc-100 shadow-inner group relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-50" />
                   <SearchX className="h-12 w-12 text-zinc-200 group-hover:scale-110 transition-transform relative z-10" />
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Empty Registry Shard</p>
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-xs mx-auto">Initialize new compliance protocols to secure the ingestion network.</p>
                </div>
              </div>
            </Card>
          ) : (
            filteredTypes.map((type, index) => (
              <Card 
                key={type._id} 
                className={cn(
                  "rounded-[4rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden border border-white/20",
                  !type.isActive && "opacity-60 grayscale-[0.5]"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01),transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex items-start justify-between mb-12 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 relative overflow-hidden",
                      type.isActive ? "bg-zinc-950 text-white shadow-zinc-950/20" : "bg-zinc-100 text-zinc-400 shadow-zinc-200/20"
                    )}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
                      {type.isRequired ? <ShieldAlert className="h-9 w-9 relative z-10" /> : <Fingerprint className="h-9 w-9 relative z-10" />}
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-syne italic italic">Protocol Code: {type._id.slice(-6).toUpperCase()}</p>
                       <h3 className="text-3xl font-syne font-black text-zinc-950 italic tracking-tighter uppercase group-hover:translate-x-2 transition-transform duration-700">{type.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Badge 
                      variant="secondary" 
                      className={cn(
                        "rounded-full px-6 py-2 text-[9px] font-black uppercase tracking-widest border-none transition-all duration-500 italic font-syne",
                        type.isActive ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                      )}
                    >
                      {type.isActive ? 'OPERATIONAL' : 'SUSPENDED'}
                    </Badge>
                    {type.isRequired && (
                      <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest rounded-full px-6 py-2 italic font-syne">MANDATORY_GATE</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-10 relative z-10">
                  <p className="text-zinc-500 font-medium leading-relaxed min-h-[60px]">{type.description || 'Global operational scope parameters pending definition.'}</p>
                  
                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-zinc-50">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ingestion Class</p>
                      <p className="text-lg font-bold text-zinc-950 uppercase tracking-tight italic font-syne">{categoryLabels[type.category]}</p>
                    </div>
                    <div className="space-y-3 text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Max Artifact Size</p>
                      <p className="text-lg font-bold text-zinc-950 uppercase tracking-tight italic font-syne">{type.maxSizeMB} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {type.allowedFormats.map(f => (
                        <span key={f} className="h-10 px-4 rounded-xl bg-zinc-950 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center shadow-lg shadow-zinc-950/10 hover:scale-110 transition-transform cursor-default italic font-syne">{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleToggleActive(type)}
                        variant="outline"
                        className={cn(
                          "h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                          type.isActive ? "text-zinc-400 border-zinc-200 hover:text-zinc-950 hover:bg-zinc-50" : "text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                        )}
                      >
                        {type.isActive ? 'SUSPEND' : 'ACTIVATE'}
                      </Button>
                      <Button
                        onClick={() => handleOpenModal(type)}
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-2xl text-zinc-300 hover:text-zinc-950 hover:bg-white shadow-sm transition-all"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(type._id)}
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-2xl text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Global Architecture Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
           <Card className="rounded-[4rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group col-span-1 lg:col-span-2 min-h-[400px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                 <div className="space-y-10">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                          <Network className="h-8 w-8 text-blue-400" />
                       </div>
                       <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-400">Network Topology</h4>
                    </div>
                    <div className="space-y-4">
                       <p className="text-6xl font-syne font-black italic tracking-tighter uppercase leading-[0.85]">Schema <br /> Infrastructure</p>
                       <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] max-w-sm">Managing the global compliance ingestion engine and artifact validation standards.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Health</p>
                       <p className="text-5xl font-syne font-black text-white italic tracking-tighter">100%</p>
                    </div>
                    <div className="h-20 w-[1px] bg-white/10" />
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Registry Sync</p>
                       <p className="text-5xl font-syne font-black text-blue-400 italic tracking-tighter">NOMINAL</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[4rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 flex flex-col justify-between group min-h-[400px]">
              <div className="flex items-center justify-between">
                 <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <Cpu className="h-10 w-10 text-zinc-950" />
                 </div>
                 <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-[0.3em] rounded-full px-6 py-3 italic font-syne shadow-sm">AI_VALIDATION_ACTIVE</Badge>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                   <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Validation Engine</p>
                   <p className="text-2xl font-syne font-black text-zinc-950 uppercase tracking-tighter leading-[0.95] italic text-blue-600 underline decoration-blue-100 underline-offset-4">Automated Registry Filtering Shard</p>
                 </div>
                 <div className="h-1.5 w-24 bg-zinc-950 rounded-full group-hover:w-full transition-all duration-1000" />
              </div>
           </Card>
        </div>
      </div>

      {/* Protocol Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl border-none shadow-3xl rounded-[4rem] p-0 overflow-hidden bg-white">
          <div className="bg-zinc-950 p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2.5rem] bg-white text-zinc-950 flex items-center justify-center mb-10 shadow-2xl transition-transform duration-700 hover:rotate-6">
                <Settings2 className="h-12 w-12" />
              </div>
              <DialogTitle className="text-5xl font-syne font-black italic text-white uppercase tracking-tighter">
                {editingType ? 'Update ' : 'Initialize '} <span className="text-zinc-500">Protocol</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-6 max-w-[360px] leading-relaxed">
                Defining global compliance architecture for <span className="text-white underline decoration-white/20 underline-offset-4">Vendor Ingestion</span> and legal validation.
              </DialogDescription>
            </div>
          </div>
          
          <div className="p-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Protocol Identity</FormLabel>
                        <FormControl>
                          <Input placeholder="E.G., TAX RESIDENCY SHARD…" className="h-20 bg-zinc-50 border-none focus:bg-white focus:ring-2 focus:ring-zinc-100 text-[11px] font-black uppercase tracking-[0.2em] px-8 rounded-[1.5rem] transition-all shadow-inner" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Registry Class</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <select {...field} className="appearance-none flex h-20 w-full rounded-[1.5rem] border-none bg-zinc-50 px-8 py-2 text-[11px] font-black uppercase tracking-[0.2em] focus:bg-white focus:ring-2 focus:ring-zinc-100 outline-none transition-all shadow-inner cursor-pointer font-syne italic">
                              {Object.entries(categoryLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300 pointer-events-none rotate-90" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Operational Scope & Compliance Logic</FormLabel>
                      <FormControl>
                        <Textarea placeholder="DEFINE THE PURPOSE AND LEGAL REQUIREMENT FOR THIS ARCHITECTURE SHARD…" className="min-h-[160px] bg-zinc-50 border-none focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all resize-none rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] p-10 shadow-inner leading-relaxed" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField
                    control={form.control}
                    name="isRequired"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 shadow-inner group transition-all hover:bg-white hover:ring-2 hover:ring-zinc-100">
                        <div className="space-y-2">
                          <FormLabel className="!mb-0 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950 font-syne italic italic">Mandatory Gate</FormLabel>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">BLOCK_INGESTION_IF_NULL</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Ingestion Threshold</FormLabel>
                    <FormField
                      control={form.control}
                      name="maxSizeMB"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Input type="number" className="h-20 pl-8 pr-20 bg-zinc-50 border-none focus:bg-white focus:ring-2 focus:ring-zinc-100 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-inner transition-all font-syne italic" {...field} />
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-950 uppercase tracking-widest italic font-syne">MB_LIMIT</div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="allowedFormats"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Permitted Artifact Extensions</FormLabel>
                      <FormControl>
                        <Input placeholder="PDF, DOC, JPG, PNG…" className="h-20 bg-zinc-50 border-none focus:bg-white focus:ring-2 focus:ring-zinc-100 text-[11px] font-black uppercase tracking-[0.2em] px-8 rounded-[1.5rem] transition-all shadow-inner font-mono" {...field} />
                      </FormControl>
                      <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest ml-2 italic font-syne underline decoration-zinc-100 underline-offset-4">DELIMIT_BY_COMMA_CHARACTER</p>
                      <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest" />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-6 pt-10">
                  <Button type="submit" disabled={isProcessing} className="w-full h-24 rounded-[2.5rem] bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.4em] text-[12px] shadow-3xl shadow-zinc-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin mr-4" /> : <ShieldCheck className="h-6 w-6 mr-4" />}
                    {editingType ? 'Commit Schema Updates' : 'Initialize Protocol Shard'}
                  </Button>
                  <Button type="button" variant="ghost" className="h-16 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 hover:text-zinc-950 transition-colors" onClick={() => setShowModal(false)}>
                    Terminate Protocol
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
