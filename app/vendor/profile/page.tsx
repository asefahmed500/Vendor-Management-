'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, X, Building2, Phone, Mail, Globe, MapPin, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

import { IVendor } from '@/lib/types/vendor';
import { Card, CardContent } from '@/components/ui/card';
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

const COMPANY_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other'] as const;

const profileSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must not exceed 200 characters'),
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
      address: { street: '', city: '', state: '', country: '', postalCode: '' },
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
          form.reset({
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
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        toast.error('Failed to load profile');
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
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }
      
      const result = await response.json();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setVendor((prev) => prev ? { ...prev, ...result.data.vendor } : null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (vendor) {
      form.reset({
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
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        <div className="h-40 bg-zinc-50 border border-zinc-100 rounded-[2rem] animate-pulse" />
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 h-96 bg-zinc-50 border border-zinc-100 rounded-[2rem] animate-pulse" />
          <div className="md:col-span-8 h-[600px] bg-zinc-50 border border-zinc-100 rounded-[2rem] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Corporate Identity</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold tracking-tight text-zinc-950">
              Enterprise Profile
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Verified Partner • Asset Management Portal
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving} className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100">
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving} className="bg-zinc-950 text-white rounded-xl px-8 font-bold text-xs uppercase tracking-widest shadow-xl shadow-zinc-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Commit Changes'}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-zinc-950 text-white rounded-xl px-8 font-bold text-xs uppercase tracking-widest shadow-xl shadow-zinc-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Update Identity
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-10 space-y-10">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="h-10 w-10 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-bold text-zinc-950 tracking-tight">{vendor?.companyName}</h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{vendor?.companyType || 'Corporate Entity'}</p>
                </div>
              </div>
              
              <div className="space-y-6 pt-10 border-t border-zinc-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Network Email</p>
                      <p className="text-xs font-bold text-zinc-950">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Verification</p>
                      <div className="flex items-center gap-1.5">
                        {vendor?.status === 'APPROVED' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-tight">Pending Approval</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Entry Registry</span>
                  <span className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight">
                    {vendor?.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Registry ID</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {vendor?._id ? vendor._id.slice(-8) : 'PENDING'}
                    </span>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <div className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">Identity Manifest</h3>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Operational data and authority descriptors.</p>
              </div>
              <Shield className="h-4 w-4 text-zinc-300" />
            </div>
            <CardContent className="p-10">
              <Form {...form}>
                <form className="space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-4 bg-zinc-950 rounded-full" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Basic Information</h4>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Entity Legal Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Primary Representative</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Communication Channel</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                <Input {...field} disabled={!isEditing} className="h-12 pl-11 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Entity Structure</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm">
                                  <SelectValue placeholder="Define type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-zinc-100 shadow-2xl">
                                {COMPANY_TYPES.map((type) => (
                                  <SelectItem key={type} value={type} className="text-xs font-bold uppercase tracking-wide py-3">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-8 pt-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-4 bg-zinc-950 rounded-full" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Legal & Location</h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Tax Identification Number</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="XX-XXXXXXX" className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">City Node</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">State / Province / Region</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="h-12 rounded-xl bg-zinc-50/30 border-zinc-200 focus:border-zinc-950 transition-all font-bold text-sm" />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}