'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, Building2, User, Phone, MapPin, Save, X, ShieldCheck, Zap, Globe, Fingerprint, KeyRound, CheckCircle2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const COMPANY_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other'] as const;

const createVendorSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*&)'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  contactPerson: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(50, 'Contact person name must not exceed 50 characters'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
  companyType: z.string().optional(),
  taxId: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

export default function CreateVendorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      companyType: '',
      taxId: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: CreateVendorFormValues) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = values;

      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identity initialization failed');
      }

      toast.success('New entity node initialized');
      router.push('/admin/vendors');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'System rejection identified';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-12 px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Onboarding Nexus</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Plus className="h-3 w-3" />
              Initialize New Record
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Initialize Entity
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Deploy a new corporate node to the VMS ecosystem. Automated credential generation and system handshake protocols will follow.
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline" disabled={isLoading} className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight shadow-xl shadow-primary/20 gap-3 group">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Deploy Entity
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Credential Matrix */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-tighter">Credential Matrix</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Master Auth Keys</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nexus Identifier (Email)</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                            <Input
                              placeholder="entity@transmission.net"
                              disabled={isLoading}
                              className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Access Signature</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                            <Input
                              type="password"
                              disabled={isLoading}
                              className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Validate Signature</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                            <Input
                              type="password"
                              disabled={isLoading}
                              className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Card className="rounded-[2.5rem] border-2 border-primary/20 bg-primary/5 p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Fingerprint className="h-5 w-5" />
                  <span className="font-black uppercase tracking-tighter">Security Protocol</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">
                  Passwords must contain at least 8 characters, one uppercase, one number, and one special identifier for nexus compliance.
                </p>
              </Card>
            </div>

            {/* Right: Data Hub */}
            <div className="lg:col-span-2 space-y-10">
              {/* Corporate Identity */}
              <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
                <CardHeader className="p-10 border-b-2 border-zinc-50 dark:divide-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tighter">Entity Definition</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Master corporate signal data</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Legal Designation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Corporate Identifier"
                            disabled={isLoading}
                            className="h-16 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black tracking-tight uppercase"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Authorized Representative</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                              <Input
                                placeholder="Node Curator"
                                disabled={isLoading}
                                className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Voice Termination</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                              <Input
                                placeholder="+X (XXX) XXX-XXXX"
                                type="tel"
                                disabled={isLoading}
                                className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Entity Logic</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs">
                                <SelectValue placeholder="System Class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-2 p-2">
                              {COMPANY_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Fiscal Hash (Tax ID)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Corporate Signature"
                              disabled={isLoading}
                              className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tighter font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Physical Signal */}
              <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
                <CardHeader className="p-10 border-b-2 border-zinc-50 dark:border-zinc-900 divide-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tighter">Geographical Signal</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Physical hub coordinates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Street Interface</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Headquarters Routing"
                            disabled={isLoading}
                            className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Metropolitan Node</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Sovereign Domain (State)</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Global Sector</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                              <Input
                                disabled={isLoading}
                                className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Registry Code</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-800 flex items-center gap-6">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center text-primary shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-tighter">Identity Confirmation</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              All new entities are subjected to a multi-point cryptographic verification loop.
            </p>
          </div>
        </div>
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-800 flex items-center gap-6">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center text-emerald-500 shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-tighter">Automated Notification</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Welcome transmissions will be executed to the target email hub upon successful deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
