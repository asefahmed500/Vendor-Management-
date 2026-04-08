'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, Copy, CheckCircle, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

const COMPANY_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other'] as const;

const createVendorSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  companyName: z.string().min(2, 'Company name required'),
  contactPerson: z.string().min(2, 'Contact person required'),
  phone: z.string().min(1, 'Phone required'),
  companyType: z.string().optional(),
  taxId: z.string().optional(),
});

type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

interface CreatedVendor {
  email: string;
  tempPassword: string;
  companyName: string;
}

export default function CreateVendorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdVendor, setCreatedVendor] = useState<CreatedVendor | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      email: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      companyType: '',
      taxId: '',
    },
  });

  const onSubmit = async (values: CreateVendorFormValues) => {
    setIsLoading(true);
    setSubmitError(null);
    setCreatedVendor(null);

    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          companyName: values.companyName,
          contactPerson: values.contactPerson,
          phone: values.phone,
          companyType: values.companyType,
          taxId: values.taxId,
          generatePassword: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to create vendor');

      if (result.data?.tempPassword) {
        setCreatedVendor({
          email: values.email,
          tempPassword: result.data.tempPassword,
          companyName: values.companyName,
        });
        toast.success('Vendor created successfully');
      } else {
        toast.success('Vendor created successfully');
        router.push('/admin/vendors');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create vendor';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (createdVendor) {
      const text = `Email: ${createdVendor.email}\nTemporary Password: ${createdVendor.tempPassword}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateAnother = () => {
    setCreatedVendor(null);
    form.reset();
  };

  const handleViewVendors = () => {
    router.push('/admin/vendors');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Create Vendor
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new vendor to the system
          </p>
        </div>
      </div>

      {/* Success - Show Generated Credentials */}
      {createdVendor && (
        <Card className="border-green-500/50 bg-green-500/5 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Vendor Created Successfully
            </CardTitle>
            <CardDescription>
              The vendor has been created with auto-generated credentials. Share these credentials with the vendor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{createdVendor.email}</p>
                </div>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temporary Password</p>
                  <p className="font-mono font-medium">{createdVendor.tempPassword}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={copyCredentials}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{createdVendor.companyName}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Important:</strong> The vendor will be prompted to change their password upon first login.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateAnother} variant="outline">
                Create Another
              </Button>
              <Button onClick={handleViewVendors}>
                View Vendors
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {!createdVendor && (
        <Card className="border-border/50 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Vendor Details</CardTitle>
            <CardDescription>
              Enter the vendor&apos;s company information. A secure password will be automatically generated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Email <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" {...field} placeholder="vendor@company.com" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Company Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Company Inc." />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Contact Person <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
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
                        <FormLabel className="text-sm font-medium">Phone <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} placeholder="+1 (555) 000-0000" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Company Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., LLC, Corporation" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XX-XXXXXXX" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> A secure temporary password will be automatically generated for this vendor. 
                    You&apos;ll receive the credentials after submission.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      'Create Vendor'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}