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
  Building2,
  ShieldPlus
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
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <Card className="w-full max-w-[480px] border-none shadow-4xl shadow-zinc-200/50 rounded-[4rem] bg-white p-2 overflow-hidden">
          <div className="bg-zinc-50/30 rounded-[3.8rem] px-12 py-16 flex flex-col items-center text-center space-y-10">
            <div className="h-24 w-24 rounded-[2rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20 group-hover:rotate-12 transition-all">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-none">
                PROTOCOL <br /> INITIALIZED
              </h1>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
                Entity <span className="text-zinc-950 italic">{registeredCompany}</span> has been synchronized with the core registry.
              </p>
            </div>
            <div className="w-full space-y-6 pt-4">
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-[4000ms] ease-linear shadow-[0_0_12px_rgba(37,99,235,0.5)]" 
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne italic">
                Rerouting to Security Gateway…
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Link 
        href="/" 
        className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 mb-12 transition-all group"
      >
        <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
        Gateway Exit
      </Link>

      <Card className="border-none shadow-4xl shadow-zinc-200/50 rounded-[3.5rem] bg-white p-2 overflow-hidden">
        <div className="bg-zinc-50/30 rounded-[3.2rem] px-10 py-14">
          <CardHeader className="p-0 space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20">
                <ShieldPlus className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white text-zinc-400 border border-zinc-100 font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-full shadow-sm italic font-syne">Entity_Registration_v2</Badge>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl md:text-5xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-none">
                Entity <br /> Enrollment
              </CardTitle>
              <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
                Register your organization to join the <span className="text-zinc-950 italic">Global Vendor Network</span>.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                  <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-600 animate-in shake duration-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-bold uppercase tracking-wider">{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      Organizational Profile
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Entity Name</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="Acme Corp"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Primary Liaison</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="John Wick"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">System Mail</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="hq@acme.com"
                                  type="email"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Direct Vector</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="+1 555-0000"
                                  type="tel"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Structure Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-zinc-200/80 rounded-2xl focus:ring-zinc-950 focus:ring-offset-0 bg-white shadow-sm text-sm font-medium">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl border-zinc-200 shadow-xl">
                                {COMPANY_TYPES.map((type) => (
                                  <SelectItem key={type} value={type} className="rounded-xl my-1 focus:bg-zinc-50">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Registry Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="XX-XXXXXXX"
                                className="h-12 px-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      Security Protocol
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Master Key</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                            {password && (
                              <div className="space-y-2 px-1 pt-1">
                                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                                  <span className="text-zinc-400">Entropy: {getStrengthLabel(passwordStrength)}</span>
                                  <span className="text-zinc-950">{Math.round((passwordStrength / 5) * 100)}%</span>
                                </div>
                                <Progress value={(passwordStrength / 5) * 100} className="h-1 bg-zinc-100 [&>div]:bg-zinc-950 transition-all" />
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Confirm Key</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-4 space-y-0 ml-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="mt-1 border-zinc-200 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950 rounded-lg transition-all"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-tight">
                        <label
                          htmlFor="terms"
                          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer select-none"
                        >
                          I acknowledge the{' '}
                          <Link href="#" className="text-zinc-950 underline underline-offset-4 decoration-zinc-200">
                            Service Protocols
                          </Link>{' '}
                          &{' '}
                          <Link href="#" className="text-zinc-950 underline underline-offset-4 decoration-zinc-200">
                            Data Privacy
                          </Link>.
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-20 bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.3em] text-[12px] rounded-[1.5rem] shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.01] active:scale-[0.98] mt-8 font-syne italic"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Synchronizing...
                    </div>
                  ) : (
                    'Initialize Registration'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="justify-center mt-10 p-0 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Active Member?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors ml-2">
                Authorize Here
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>

      <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">
        Registration Core v1.2.4
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
