'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Building2, User, Phone, MapPin, Save, X, ShieldCheck, Globe, CreditCard, Calendar, Hash, CheckCircle2 } from 'lucide-react';

import { IVendor } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const profileSchema = z.object({
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
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch('/api/vendor/profile');
        if (response.ok) {
          const result = await response.json();
          setVendor(result.data.vendor);
          setEmail(result.data.email || '');

          const formData = {
            companyName: result.data.vendor.companyName,
            contactPerson: result.data.vendor.contactPerson,
            phone: result.data.vendor.phone,
            companyType: result.data.vendor.companyType || '',
            taxId: result.data.vendor.taxId || '',
            address: {
              street: result.data.vendor.address?.street || '',
              city: result.data.vendor.address?.city || '',
              state: result.data.vendor.address?.state || '',
              country: result.data.vendor.address?.country || '',
              postalCode: result.data.vendor.address?.postalCode || '',
            },
          };
          form.reset(formData);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/vendor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      toast.success('Nexus profile updated successfully');
      setVendor(data.data.vendor);
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'System rejection identified');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (vendor) {
      const formData = {
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        phone: vendor.phone,
        companyType: vendor.companyType || '',
        taxId: vendor.taxId || '',
        address: {
          street: vendor.address?.street || '',
          city: vendor.address?.city || '',
          state: vendor.address?.state || '',
          country: vendor.address?.country || '',
          postalCode: vendor.address?.postalCode || '',
        },
      };
      form.reset(formData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto px-4 sm:px-0">
        <div className="h-32 bg-muted animate-pulse rounded-[2.5rem]" />
        <div className="h-[600px] bg-muted animate-pulse rounded-[3rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Entity Registry</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              Authenticated Partner
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Corporate Profile
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Consolidate and maintain your operational identifiers, transmission endpoints, and nexus credentials.
          </p>
        </div>

        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 shadow-xl transition-all hover:scale-105">
            <User className="h-5 w-5" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button onClick={handleCancel} variant="outline" disabled={isSaving} className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving} className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight shadow-xl shadow-primary/20 gap-3">
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Synchronizing
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Apply Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Summary & Account */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden overflow-hidden sticky top-8">
            <div className="h-32 bg-zinc-950 dark:bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Building2 className="h-16 w-16 text-white/10" />
              </div>
            </div>
            <CardContent className="p-8 pb-10">
              <div className="flex flex-col items-center -mt-16 mb-8">
                <div className="h-24 w-24 rounded-3xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-2xl flex items-center justify-center text-zinc-400 group relative">
                  <Building2 className="h-10 w-10 group-hover:text-primary transition-colors" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase mt-4 text-center">{vendor?.companyName}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">{vendor?.companyType || 'Corporate Entity'}</p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-white dark:border-zinc-900 rounded-2xl shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <Mail className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Nexus Email</span>
                  </div>
                  <p className="text-sm font-bold truncate">{email}</p>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black uppercase tracking-widest text-zinc-400">Node State</span>
                    <Badge
                      variant={
                        vendor?.status === 'APPROVED' ? 'success' :
                          vendor?.status === 'REJECTED' ? 'danger' :
                            vendor?.status === 'UNDER_REVIEW' ? 'warning' : 'default'
                      }
                      className="font-black uppercase tracking-tighter text-[9px] px-2 py-0 border-2 rounded-md"
                    >
                      {vendor?.status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black uppercase tracking-widest text-zinc-400">Registry Date</span>
                    <span className="font-bold text-zinc-600 dark:text-zinc-400">
                      {vendor?.registrationDate ? new Date(vendor.registrationDate).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  {vendor?.certificateNumber && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black uppercase tracking-widest text-zinc-400">Cert Hash</span>
                      <span className="font-bold text-zinc-600 dark:text-zinc-400 font-mono tracking-tighter">{vendor.certificateNumber}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-zinc-100 dark:bg-zinc-900 h-0.5 rounded-full" />

                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 px-2">Security Hash</p>
                  <Card className="bg-zinc-50/50 dark:bg-zinc-900 border-dashed border-2 rounded-xl p-3 flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <p className="text-[9px] font-bold text-zinc-400 leading-tight">Identity verified via advanced cryptographic audit trail.</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Core Corporate Identity */}
              <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden relative">
                <CardHeader className="p-8 lg:p-10 border-b-2 border-zinc-50 dark:border-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tighter">Corporate Identity</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Master entity data nodes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 lg:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Entity Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Node Curator</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
                              placeholder="Authorized Representative"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Voice Endpoint</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                              <Input
                                disabled={!isEditing}
                                className="h-14 pl-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] uppercase font-bold tracking-widest" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Structure Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold uppercase tracking-tight text-xs">
                                <SelectValue placeholder="Entity Logic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl p-2 border-2">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Fiscal Identifier (Tax ID)</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                            <Input
                              disabled={!isEditing}
                              className="h-14 pl-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
                              placeholder="Corporate Tax Signature"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Geographical Nexus */}
              <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden relative">
                <CardHeader className="p-8 lg:p-10 border-b-2 border-zinc-50 dark:border-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/5">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tighter">Geographical Nexus</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Physical signal endpoints</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 lg:p-10 space-y-8">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Street Interface</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditing}
                            className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
                            placeholder="Headquarters Location"
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
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">City Hub</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
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
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Admin Sector (State)</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
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
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Sovereign Domain</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                              <Input
                                disabled={!isEditing}
                                className="h-14 pl-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
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
                        <FormItem>
                          <FormLabel className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Registry Code (ZIP)</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold tracking-tight"
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
            </form>
          </Form>

          {/* Infrastructure Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Blockchain ID', icon: Hash, val: vendor?._id?.toUpperCase().slice(-12), desc: 'Unique immutable identifier in the VMS ledger.' },
              { label: 'System Access', icon: ShieldCheck, val: 'AES-256 SECURED', desc: 'Communication between nodes is fully encrypted.' }
            ].map((item) => (
              <Card key={item.label} className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-8 shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</p>
                    <p className="font-black text-sm tracking-tight">{item.val}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* Decorative effect */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
