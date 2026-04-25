'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Save, 
  Send, 
  FileText, 
  Upload, 
  ShieldCheck, 
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  Fingerprint,
  Activity,
  Cpu,
  Search,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'IT_SERVICES', label: 'IT Services' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'SUPPLY_CHAIN', label: 'Supply Chain' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Professional Services' },
  { value: 'OTHER', label: 'Other' },
];

const baseProposalSchema = z.object({
  title: z.string().min(5, 'Protocol title must be at least 5 characters'),
  description: z.string().min(50, 'Strategic intent must be at least 50 characters'),
  category: z.string(),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  deadline: z.string().min(1, 'Expiration deadline is required'),
  requirements: z.array(z.object({
    id: z.string(),
    value: z.string(),
  })),
});

type ProposalForm = {
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  requirements: { id: string; value: string }[];
};

export default function CreateProposalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ProposalForm>({
    resolver: zodResolver(baseProposalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'IT_SERVICES',
      budgetMin: 0,
      budgetMax: 0,
      deadline: '',
      requirements: [{ id: '1', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'requirements',
  });

  const handleSubmit = async (status: 'DRAFT' | 'OPEN') => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Manifest validation failed. Check required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const values = form.getValues();
      const submissionData = {
        ...values,
        requirements: values.requirements.map(r => r.value).filter(r => r.trim() !== ''),
        status,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      const response = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to initialize protocol');
      }

      toast.success(
        status === 'DRAFT' ? 'Protocol archived as Draft' : 'Protocol Broadcast Active'
      );
      router.push('/admin/proposals');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'System synchronization error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttachment = () => {
    const url = prompt('Enter document URL:');
    if (url) {
      setAttachments((prev) => [...prev, url]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-zinc-100 border-t-zinc-950 animate-spin" />
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 animate-pulse">Initializing Provision Engine…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-8 space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Principal Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
        <div className="space-y-6">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/admin/proposals" className="hover:text-zinc-900 transition-colors">Registry</Link>
            <ChevronLeft className="h-3 w-3 rotate-180" />
            <span className="text-zinc-900">Provisioning</span>
          </nav>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 font-syne italic uppercase">
              Provision Protocol
            </h1>
            <p className="text-lg text-zinc-500 max-w-xl font-dm leading-relaxed">
              Initialize a new strategic procurement request to solicit verified vendor contributions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('DRAFT')} 
            disabled={isSubmitting}
            className="h-14 px-8 rounded-2xl border-zinc-200 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Save className="h-4 w-4 mr-2 opacity-60" />
            Archive Draft
          </Button>
          <Button 
            onClick={() => handleSubmit('OPEN')} 
            disabled={isSubmitting}
            className="h-14 px-10 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest shadow-2xl shadow-zinc-200 transition-all group"
          >
            <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Broadcast RFP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <Form {...form}>
            <form className="space-y-16">
              {/* Core Manifest Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                    <FileText className="h-5 w-5 text-zinc-900" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Section 01</h2>
                    <p className="text-sm font-bold text-zinc-950 font-syne">Core Manifest</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-10 p-10 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Fingerprint className="h-32 w-32" />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Formal Protocol Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. INFRA-2026-CLOUD-SYNC" 
                            className="h-16 bg-zinc-50/50 border-zinc-100 rounded-2xl px-6 focus:bg-white transition-all font-syne text-xl font-bold italic placeholder:font-normal placeholder:not-italic" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Industry Protocol</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl px-6 font-bold uppercase tracking-widest text-[10px] text-zinc-950 focus:ring-zinc-950">
                                <SelectValue placeholder="Select vertical" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest">
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Expiration Timestamp</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                              <Input 
                                type="datetime-local" 
                                className="h-14 pl-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:bg-white transition-all font-mono text-sm" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Strategic Intent</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detail the technical parameters, business goals, and operational boundaries..." 
                            className="min-h-[200px] bg-zinc-50/50 border-zinc-100 rounded-[2rem] p-8 focus:bg-white transition-all font-dm text-sm leading-relaxed resize-none shadow-inner" 
                            {...field} 
                          />
                        </FormControl>
                        <div className="flex justify-between items-center px-2">
                          <FormDescription className="text-[10px] font-medium text-zinc-400">Minimum 50 character strategic summary required.</FormDescription>
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full",
                            field.value.length >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-300'
                          )}>
                            {field.value.length} / 2000
                          </span>
                        </div>
                        <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Financial Constraints Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                    <DollarSign className="h-5 w-5 text-zinc-900" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Section 02</h2>
                    <p className="text-sm font-bold text-zinc-950 font-syne">Financial Envelope</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Activity className="h-32 w-32 text-emerald-600" />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Lower Bound Allocation ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                            <Input 
                              type="number" 
                              className="h-16 pl-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:bg-white transition-all font-mono text-2xl font-bold tracking-tight text-zinc-950" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upper Bound Allocation ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                            <Input 
                              type="number" 
                              className="h-16 pl-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:bg-white transition-all font-mono text-2xl font-bold tracking-tight text-zinc-950" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Technical Clauses Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                      <ShieldCheck className="h-5 w-5 text-zinc-900" />
                    </div>
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Section 03</h2>
                      <p className="text-sm font-bold text-zinc-950 font-syne">Success Parameters</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => append({ id: Date.now().toString(), value: '' })}
                    className="h-10 rounded-xl border-zinc-200 text-[10px] font-bold uppercase tracking-widest px-6 hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 group animate-in slide-in-from-right-2 duration-300">
                      <div className="flex-1 relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-xl bg-zinc-950 text-[10px] font-bold text-white border border-zinc-800 shadow-lg font-syne">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>
                        <Input 
                          {...form.register(`requirements.${index}.value` as const)} 
                          placeholder="e.g. Technical infrastructure must support 99.99% uptime protocols..." 
                          className="h-16 pl-20 bg-white border-zinc-100 rounded-2xl focus:bg-zinc-50 transition-all font-dm text-sm shadow-sm hover:border-zinc-300" 
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => remove(index)}
                          className="h-16 w-16 rounded-2xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Action & Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Artifact Repository */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                <Upload className="h-4 w-4 text-zinc-400" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-950">Linked Artifacts</h2>
            </div>
            
            <div className="bg-zinc-50/50 border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-3">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl group transition-all hover:border-zinc-950 hover:shadow-lg hover:shadow-zinc-100">
                    <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 transition-colors">Ref Artifact {index + 1}</p>
                      <p className="text-xs font-bold text-zinc-950 truncate font-syne uppercase tracking-tight">RFP_EXT_{index + 1}</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeAttachment(index)}
                      className="h-10 w-10 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {attachments.length === 0 && (
                  <div className="py-16 text-center border-2 border-dashed border-zinc-100 rounded-[2rem] bg-white/50">
                    <div className="h-12 w-12 rounded-full bg-white mx-auto flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
                      <Upload className="h-5 w-5 text-zinc-200" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Repository Empty</p>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                onClick={addAttachment} 
                className="w-full h-14 rounded-2xl border-zinc-200 text-[10px] font-bold uppercase tracking-widest gap-3 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Attach External Source
              </Button>
            </div>
          </div>

          {/* Provisioning Intelligence Panel */}
          <div className="bg-zinc-950 rounded-[2.5rem] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
              <Zap className="h-32 w-32" />
            </div>
            
            <div className="space-y-2 relative">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Launch Protocol</h3>
              <p className="text-xs text-zinc-500 font-dm leading-relaxed">System-wide verification of RFP data integrity before global broadcast.</p>
            </div>
            
            <div className="space-y-6 relative">
              {[
                { label: 'Strategic Intent >= 50 Chars', check: form.watch('description').length >= 50 },
                { label: 'Expiration Timestamp Active', check: !!form.watch('deadline') },
                { label: 'Financial Allocation Set', check: form.watch('budgetMax') > 0 },
                { label: 'Success Parameters Defined', check: fields.some(f => f.value.trim() !== '') }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center border transition-all",
                    item.check ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-700'
                  )}>
                    {item.check ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1 w-1 rounded-full bg-zinc-800" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    item.check ? 'text-zinc-200' : 'text-zinc-600'
                  )}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-4 relative">
              <div className="flex items-center gap-2 text-zinc-500">
                <Info className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Strategy Note</span>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                <p className="text-xs text-zinc-400 font-dm leading-relaxed italic opacity-80">
                  "Broadcasting activates the protocol across all verified vendor terminals in the industry registry. This sequence is logged for audit compliance."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
