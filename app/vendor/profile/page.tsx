'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, X, Building2, Phone, Mail } from 'lucide-react';

import { IVendor } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    .min(1, 'Phone number is required'),
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
      
      if (!response.ok) throw new Error('Failed to update');
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setVendor((prev) => prev ? { ...prev, ...values } : null);
    } catch (error) {
      toast.error('Failed to update profile');
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
      <div className="space-y-12 pb-24 p-8">
        <div className="h-32 bg-zinc-50 border-2 border-zinc-950 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 h-64 bg-zinc-50 border-2 border-zinc-950 animate-pulse" />
          <div className="md:col-span-2 h-96 bg-zinc-50 border-2 border-zinc-950 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-4 border-zinc-950">
        <div>
          <Badge variant="outline" className="mb-4 border-zinc-950 text-zinc-950">System: Identity</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-zinc-950 uppercase">
            Enterprise Profile
          </h1>
          <p className="text-zinc-600 mt-2 font-medium uppercase tracking-widest text-xs">
            Manage operational indices and authority data.
          </p>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="border-2 border-zinc-950">
                DISCARD
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving} className="border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-indigo-600">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SYNCING…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    COMMIT CHANGES
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              AUTHORIZE EDIT
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="border-2 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-10 pb-10 border-b-2 border-zinc-100">
                <div className="h-24 w-24 border-2 border-zinc-950 bg-zinc-50 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Building2 className="h-10 w-10 text-zinc-950" />
                </div>
                <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-zinc-950">{vendor?.companyName}</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-2">{vendor?.companyType || 'Asset Entity'}</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-950 underline underline-offset-4 decoration-zinc-200">{email}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verification Status</span>
                  <Badge className={`border-2 font-black ${vendor?.status === 'APPROVED' ? 'border-emerald-600 text-emerald-600 bg-white' : 'border-amber-600 text-amber-600 bg-white'}`}>
                    {vendor?.status?.replace(/_/g, ' ') || 'ID_UNKNOWN'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Entry Date</span>
                  <span className="text-xs font-black text-zinc-950 uppercase">
                    {vendor?.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          <Card className="border-2 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <CardHeader className="border-b-2 border-zinc-950 bg-zinc-50 p-8">
              <CardTitle className="text-2xl font-heading font-black uppercase tracking-tight text-zinc-950">Entity Index</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Contact Person</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} disabled={!isEditing} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Company Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMPANY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} placeholder="XX-XXXXXXX" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Address</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} placeholder="Street address" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">City</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
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