'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Save, Send, FileText, Upload, Settings2, ShieldCheck, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { CreateProposalInput, createProposalSchema, baseProposalSchema } from '@/lib/validation/schemas/proposal';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const initialFormData: CreateProposalInput = {
  title: '',
  description: '',
  category: 'IT_SERVICES',
  budgetMin: 0,
  budgetMax: 0,
  deadline: '',
  requirements: [''],
};

const fieldErrors: Record<keyof CreateProposalInput, string> = {
  title: 'Title',
  description: 'Description',
  category: 'Category',
  budgetMin: 'Minimum Budget',
  budgetMax: 'Maximum Budget',
  deadline: 'Deadline',
  requirements: 'Requirements',
};

export default function CreateProposalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  // React Hook Form with field array for requirements
  type ProposalForm = {
    title: string;
    description: string;
    category: string;
    budgetMin: number;
    budgetMax: number;
    deadline: string;
    requirements: { id: string; value: string }[];
  };

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
      toast.error('Validation failure identifies logic gaps');
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
        throw new Error(data.error || 'Protocol rejection');
      }

      toast.success(
        status === 'DRAFT'
          ? 'Draft node synchronized'
          : 'Proposal stream broadcasted'
      );
      router.push(`/admin/proposals`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'System fault detected');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttachment = () => {
    const url = prompt('Input Attachment Resource URL:');
    if (url) {
      setAttachments((prev) => [...prev, url]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div className="flex items-start gap-5">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 shrink-0" asChild>
            <Link href="/admin/proposals">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Node Creation</Badge>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Encrypted Transmission
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
              Deploy RFP Stream
            </h1>
            <p className="text-zinc-500 max-w-xl font-medium">
              Initialize a new Request for Proposal node in the vendor ecosystem. Define technical parameters and resource allocations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <Form {...form}>
                <div className="space-y-10">
                  {/* Basic Intel */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Technical Intel</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Proposal Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.G., HYPERSCALE CLOUD INFRASTRUCTURE UPGRADE"
                                className="h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-bold text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sector Cluster</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase text-xs">
                                  <SelectValue placeholder="Select Cluster" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl border-2 p-2">
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value} className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="font-bold text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Transmission Deadline</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                                className="h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-bold text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detailed Specification</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide exhaustive technical parameters and operational objectives..."
                              rows={6}
                              className="rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium resize-none p-5"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[10px] font-bold uppercase tracking-tight text-zinc-400 pt-2 flex justify-between">
                            <span>Minimum 50 Characters</span>
                            <span>{field.value.length} / 2000 Units</span>
                          </FormDescription>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Resource Logic */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Resource Allocation</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="budgetMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Minimum Allocation (USD)</FormLabel>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-black">$</span>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-10 h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold text-lg"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="font-bold text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budgetMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Maximum Ceiling (USD)</FormLabel>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-black">$</span>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-10 h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold text-lg"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="font-bold text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Requirements Matrix */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <Plus className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Requirements Matrix</h2>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`requirements.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex gap-3">
                                  <div className="relative flex-1">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-300">{index + 1}</span>
                                    <Input
                                      {...field}
                                      placeholder={`Transmission Requirement ${index + 1}`}
                                      className="pl-12 h-14 rounded-xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium"
                                    />
                                  </div>
                                  {fields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => remove(index)}
                                      className="h-14 w-14 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-2 border-transparent hover:border-rose-500/20"
                                    >
                                      <X className="h-5 w-5" />
                                    </Button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="font-bold text-xs" />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ id: Date.now().toString(), value: '' })}
                        className="w-full h-14 rounded-xl border-2 border-dashed font-black uppercase tracking-tight text-[10px] hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Append Requirement Node
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <Settings2 className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">Control Panel</h2>
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/10 transition-all hover:scale-[1.03] gap-3"
                  onClick={() => handleSubmit('OPEN')}
                  disabled={isSubmitting}
                >
                  <Send className="h-6 w-6" />
                  Broadcast RFP
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-16 rounded-2xl border-2 font-black uppercase tracking-tight gap-3"
                  onClick={() => handleSubmit('DRAFT')}
                  disabled={isSubmitting}
                >
                  <Save className="h-6 w-6" />
                  Stash to Drafts
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-tight border-2"
                >
                  <Link href="/admin/proposals" className="gap-3">
                    Cancel Operation
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t-2 border-zinc-50 dark:border-zinc-900">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Validation Status
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed">
                    Ensure all marked parameters are satisfied before triggering the global broadcast sequence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-zinc-50 dark:border-zinc-900 pb-4">
                <Upload className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">Resource Vault</h2>
              </div>

              <div className="space-y-4">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl group border-2 border-transparent hover:border-zinc-200 transition-all">
                    <FileText className="h-5 w-5 text-zinc-400" />
                    <span className="flex-1 text-[10px] font-bold uppercase truncate">{attachment}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(index)}
                      className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {attachments.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-zinc-300">Vault Empty</p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addAttachment}
                  className="w-full h-14 rounded-xl border-2 border-dashed font-black uppercase tracking-tight text-[10px]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Link Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
