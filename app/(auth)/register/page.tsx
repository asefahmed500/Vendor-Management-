'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  User,
  Building2
} from 'lucide-react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { authClient } from '@/lib/auth/auth-client';

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
    .min(1, 'Phone number is required'),
  companyType: z.string().optional(),
  taxId: z.string().optional(),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  terms: z.boolean()
    .refine((checked) => checked, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (password: string): number => {
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

const getStrengthLabel = (strength: number): string => {
  if (strength <= 1) return 'Weak';
  if (strength <= 2) return 'Fair';
  if (strength <= 3) return 'Good';
  if (strength <= 4) return 'Strong';
  return 'Excellent';
};

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredCompany, setRegisteredCompany] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      companyType: '',
      taxId: '',
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

    try {
      await (authClient.signUp.email as any)({
        email: values.email,
        password: values.password,
        name: values.contactPerson,
        companyName: values.companyName,
        phone: values.phone,
        role: 'VENDOR',
      }, {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setShowSuccess(true);
          setRegisteredCompany(values.companyName);
          toast.success('Account created! Check your email to verify.');
          
          setTimeout(() => {
            router.push('/login');
          }, 4000);
        },
        onError: (ctx: any) => {
          const errorMessage = ctx.error.message || 'Registration failed';
          setSubmitError(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setSubmitError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-heading font-bold">Welcome aboard!</h1>
                <p className="text-muted-foreground">
                  Your account for <span className="font-semibold text-foreground">{registeredCompany}</span> has been created.
                </p>
              </div>
              <div className="w-full space-y-4">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-[3000ms]" 
                    style={{ width: '100%' }}
                  />
                </div>
                <p className="text-xs font-medium text-muted-foreground text-center">
                  Redirecting to login…
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-2 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="text-center pb-4 border-b-2 border-zinc-950 bg-zinc-50">
            <div className="mx-auto h-12 w-12 bg-zinc-950 rounded-none flex items-center justify-center text-white font-black text-2xl border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              V
            </div>
            <div className="mt-4">
              <CardTitle className="text-2xl font-heading font-black uppercase tracking-tighter">Initialize Account</CardTitle>
              <CardDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                VMS_OS Registration Protocol
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {submitError && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Company Information
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Company Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Acme Corporation"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Contact Person <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="John Smith"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Email <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="you@company.com"
                                type="email"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Phone <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Company Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMPANY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
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
                          <FormLabel className="text-sm font-medium">Tax ID (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="XX-XXXXXXX"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-border">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Security
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Password <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="••••••••"
                                type="password"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                          {password && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Strength: {getStrengthLabel(passwordStrength)}</span>
                                <span className="font-medium">{Math.round((passwordStrength / 5) * 100)}%</span>
                              </div>
                               <Progress value={(passwordStrength / 5) * 100} className="h-2 rounded-none border-2 border-zinc-950 bg-white" />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium">Confirm Password <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="••••••••"
                                type="password"
                                className="pl-10"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          I agree to the{' '}
                          <Link href="#" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 font-heading font-black uppercase text-lg border-2 border-zinc-950 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initializing…
                    </>
                  ) : (
                    <>
                      Deploy Account
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
