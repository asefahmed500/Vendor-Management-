'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, Mail, Building2, User, Phone, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COMPANY_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other'] as const;

const registerSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  contactPerson: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(50, 'Contact person name must not exceed 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
  companyType: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*&)'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  terms: z.boolean()
    .refine((checked) => checked, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (password: string) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  return Math.min(5, strength);
};

const getStrengthLabel = (strength: number) => {
  if (strength <= 1) return 'Weak';
  if (strength <= 2) return 'Fair';
  if (strength <= 3) return 'Good';
  if (strength <= 4) return 'Strong';
  return 'Excellent';
};

import { authClient } from '@/lib/auth/auth-client';

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredCompany, setRegisteredCompany] = useState('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      companyType: '',
      taxId: '',
      address: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: 'onChange',
  });

  const password = form.watch('password');
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    await (authClient.signUp.email as any)({
      email: values.email,
      password: values.password,
      name: values.contactPerson,
      // Additional fields configured in auth.ts
      companyName: values.companyName,
      contactPerson: values.contactPerson,
      phone: values.phone,
      role: 'VENDOR',
    }, {
      onRequest: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        setShowSuccess(true);
        setRegisteredCompany(values.companyName);
        toast.success('Registration submitted successfully!');

        // For security vendors, we wait for approval, but Better Auth might have logged them in. 
        // We'll redirect to login after a delay as per original logic.
        setTimeout(() => {
          router.push('/login');
        }, 4000);
        setIsLoading(false);
      },
      onError: (ctx: any) => {
        const errorMessage = ctx.error.message || 'Registration failed';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    });
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
        <Card className="w-full max-w-md border-2 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 bg-background/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500 border-2 border-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter">Registration Submitted!</h1>
                <p className="text-muted-foreground font-medium px-6 leading-relaxed">
                  Thank you for registering <span className="font-bold text-foreground">{registeredCompany}</span>. Your application is now in our secure review queue.
                </p>
                <div className="p-4 bg-muted/50 rounded-2xl border-2 text-sm text-muted-foreground">
                  Expect an approval email within 24-48 business hours.
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden border">
                  <div className="h-full bg-primary animate-progress-bar" style={{
                    animation: 'progress 3.5s linear forwards',
                    width: '100%',
                    transformOrigin: 'left'
                  }} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Finalizing redirection...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-24 pointer-events-none" />

      <div className="mx-auto w-full max-w-2xl relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to homepage
        </Link>

        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-3 text-center mb-10">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-xl mb-2">
            V
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Vendor Registration</h1>
            <p className="text-muted-foreground font-medium text-lg">
              Join our global enterprise ecosystem
            </p>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-2 pb-8 border-b bg-muted/30 px-10 pt-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black tracking-tight">Create Enterprise Account</CardTitle>
              <Badge variant="outline" className="font-bold uppercase tracking-widest text-xs bg-background py-1">Official</Badge>
            </div>
            <CardDescription className="text-base font-medium">
              Complete the corporate onboarding to start managing your vendor profile
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 py-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {submitError && (
                  <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="font-bold">{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* Company Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight uppercase">Corporate Identity</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Legal Entity Name <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Corporation"
                              disabled={isLoading}
                              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Authorized Representative <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Smith"
                              disabled={isLoading}
                              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Corporate Email <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                placeholder="representative@company.com"
                                type="email"
                                disabled={isLoading}
                                className="h-12 pl-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Direct Phone <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                                disabled={isLoading}
                                className="h-12 pl-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">Legal Structure</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 font-medium">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {COMPANY_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="rounded-lg">
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
                        <FormItem className="space-y-2 md:col-span-2">
                          <FormLabel className="text-sm font-bold text-foreground/70">Tax ID / Registration Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Optional: Federal tax identification"
                              disabled={isLoading}
                              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6 pt-4 border-t-2">
                  <div className="flex items-center gap-3 pb-3 border-b-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight uppercase">Security Setup</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Establish Password <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••••••"
                              type="password"
                              disabled={isLoading}
                              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                          {password && (
                            <div className="space-y-2.5 px-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level: {getStrengthLabel(passwordStrength)}</span>
                                <span className="text-[10px] font-black">{Math.round((passwordStrength / 5) * 100)}%</span>
                              </div>
                              <Progress value={(passwordStrength / 5) * 100} className="h-1.5 rounded-full" />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-foreground/70">
                            Confirm Password <span className="text-destructive font-black">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••••••"
                              type="password"
                              disabled={isLoading}
                              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 space-y-0 pt-4 px-6 py-4 bg-muted/30 rounded-2xl border-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="h-5 w-5 rounded-md"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-bold text-muted-foreground cursor-pointer select-none"
                        >
                          I certify that I am an authorized representative of my company and agree to the{' '}
                          <Link href="#" className="text-primary hover:text-primary/80 underline font-black">
                            MSA
                          </Link>{' '}
                          and{' '}
                          <Link href="#" className="text-primary hover:text-primary/80 underline font-black">
                            Security Policy
                          </Link>
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black shadow-2xl hover:shadow-primary/20 hover:scale-[1.01] transition-all group rounded-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      JOIN ECOSYSTEM
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-10 text-center">
              <p className="text-base font-medium text-muted-foreground">
                Corporate partner already?{' '}
                <Link href="/login" className="font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-tight">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="mt-10 text-center text-[11px] text-muted-foreground font-bold tracking-tight px-10 leading-relaxed uppercase opacity-60">
          This system is restricted to authorized vendors only. All registration attempts are audited for compliance with global KYC regulations.
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-progress-bar {
          animation: progress 3.5s linear forwards;
        }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl animate-pulse shadow-2xl">
          V
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
