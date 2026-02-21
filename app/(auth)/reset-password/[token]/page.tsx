'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, Check, CheckCircle2, XCircle, ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*&)'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

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

function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(true); // Default to true as Better Auth validates on submission
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = form.watch('password');
  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { label: 'Min 8 characters', check: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', check: (p: string) => /[a-z]/.test(p) },
    { label: 'One number digit', check: (p: string) => /\d/.test(p) },
    { label: 'One special symbol', check: (p: string) => /[@$!%*?&]/.test(p) },
  ];

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);

    const { data, error } = await authClient.resetPassword({
      newPassword: values.password,
      token: token,
    });

    if (error) {
      toast.error(error.message || 'Failed to reset password');
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      toast.success('Password reset successfully!');

      setTimeout(() => {
        router.push('/login');
      }, 4000);
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Security Checksum...</p>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
        <Card className="w-full max-w-md border-2 border-destructive/20 shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center border-2 border-destructive/20">
                <XCircle className="w-12 h-12 text-destructive" />
              </div>
              <div className="space-y-4 px-6">
                <h1 className="text-3xl font-black tracking-tighter">Expired Session</h1>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  This password reset link is invalid or has expired due to security protocols.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full px-10">
                <Link href="/forgot-password">
                  <Button className="w-full h-12 text-base font-bold rounded-xl shadow-lg" variant="default">
                    Request New Key
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="w-full h-12 text-base font-bold rounded-xl" variant="outline">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
        <Card className="w-full max-w-md border-2 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 bg-background/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter">Security Updated</h1>
                <p className="text-muted-foreground font-medium leading-relaxed px-8">
                  Your corporate password has been successfully reset. Redirecting you to the secure portal.
                </p>
              </div>
              <div className="w-full px-10 space-y-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden border">
                  <div className="h-full bg-primary animate-progress-bar" style={{
                    animation: 'progress 3.5s linear forwards',
                    width: '100%',
                    transformOrigin: 'left'
                  }} />
                </div>
                <Button onClick={() => router.push('/login')} variant="outline" className="w-full h-12 rounded-xl border-2 font-bold">
                  Go to Login Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <style jsx>{`
          @keyframes progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-24 pointer-events-none" />

      <div className="mx-auto w-full max-w-lg relative z-10">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-3 text-center mb-10">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-xl mb-2">
            V
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Define New Identity</h1>
            <p className="text-muted-foreground font-medium">
              Establish a new secure access key
            </p>
          </div>
        </div>

        <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-2 pb-8 border-b bg-muted/30 px-10 pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-black tracking-tight">Access Recovery</CardTitle>
              </div>
              <Badge variant="outline" className="font-bold uppercase tracking-widest text-xs bg-background py-1">Secure</Badge>
            </div>
            <CardDescription className="text-base font-medium">
              Establish your new enterprise-grade password credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 py-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-sm font-bold text-foreground/70 uppercase tracking-widest">New Security Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••••••"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 transition-all font-medium text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />

                      {/* Password Requirements */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complexity: {getStrengthLabel(passwordStrength)}</span>
                          <span className="text-[10px] font-black">{Math.round((passwordStrength / 5) * 100)}%</span>
                        </div>
                        <Progress value={(passwordStrength / 5) * 100} className="h-2 rounded-full" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
                          {passwordRequirements.map((req) => {
                            const isValid = req.check(password);
                            return (
                              <div key={req.label} className="flex items-center gap-2.5 text-xs font-bold">
                                <div className={`rounded-md p-1 border ${isValid ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted/50 text-muted-foreground border-border'
                                  }`}>
                                  {isValid ? (
                                    <Check className="h-3 w-3 stroke-[3px]" />
                                  ) : (
                                    <div className="h-3 w-3" />
                                  )}
                                </div>
                                <span className={isValid ? 'text-emerald-700' : 'text-muted-foreground/60'}>
                                  {req.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-sm font-bold text-foreground/70 uppercase tracking-widest">Verify Security Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••••••"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20 transition-all font-medium text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black shadow-2xl hover:shadow-primary/20 hover:scale-[1.01] transition-all rounded-2xl group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      REWRITING IDENTITY...
                    </>
                  ) : (
                    <>
                      INITIALIZE NEW ACCESS
                      <Lock className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-10 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-base font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-tight group"
              >
                <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
                Return to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips Card */}
        <div className="mt-10 flex items-center justify-center gap-10 opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
            <ShieldCheck className="h-4 w-4 text-primary" /> Multi-factor Ready
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
            <Lock className="h-4 w-4 text-primary" /> End-to-end Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const params = useParams();
  const token = (params?.token as string) || '';

  if (!token) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
        <Card className="w-full max-w-md border-2 border-destructive/20 shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center border-2 border-destructive/20">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tighter">Identity Fault</h1>
                <p className="text-muted-foreground font-medium">
                  No security token provided. Access denied.
                </p>
              </div>
              <Link href="/forgot-password" title="Request Reset Link">
                <Button className="rounded-xl px-10 h-12 font-bold">Request Valid Access Link</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl animate-pulse shadow-2xl">
          V
        </div>
      </div>
    }>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
