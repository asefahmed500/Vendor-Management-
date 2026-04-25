'use client';

import { useState, Suspense } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth/auth-client';

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

function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid] = useState<boolean | null>(true); 
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

    const { error } = await authClient.resetPassword({
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
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 bg-zinc-100 rounded-2xl flex items-center justify-center animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Security Checksum...</p>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <Card className="w-full border-none shadow-none bg-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">Expired Session</h1>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
                This password reset link is invalid or has expired due to security protocols.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Link href="/forgot-password">
                <Button className="w-full h-12 text-sm font-semibold rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all">
                  Request New Key
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full h-12 text-sm font-semibold rounded-2xl border-zinc-200" variant="outline">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-10 h-10 text-blue-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">Security Updated</h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
            Your corporate password has been successfully reset. Redirecting to the secure portal.
          </p>
        </div>
        <div className="w-full space-y-4">
          <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-zinc-950 animate-progress-bar" style={{
              animation: 'progress 3.5s linear forwards',
              width: '100%',
              transformOrigin: 'left'
            }} />
          </div>
          <Button onClick={() => router.push('/login')} variant="outline" className="w-full h-12 rounded-2xl border-zinc-200 font-semibold text-sm">
            Go to Login Now
          </Button>
        </div>
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
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-2 shadow-lg">
          V
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">Define New Identity</h1>
        <p className="text-zinc-500 text-sm font-medium">
          Establish a new secure access key
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Security Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••••••"
                        type="password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-zinc-200 focus:border-zinc-950 focus:ring-0 transition-all font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500" />

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Strength: {getStrengthLabel(passwordStrength)}</span>
                        <span className="text-[10px] font-bold text-zinc-950">{Math.round((passwordStrength / 5) * 100)}%</span>
                      </div>
                      <Progress value={(passwordStrength / 5) * 100} className="h-1 bg-zinc-100" />

                      <div className="grid grid-cols-2 gap-2 px-1">
                        {passwordRequirements.map((req) => {
                          const isValid = req.check(password);
                          return (
                            <div key={req.label} className="flex items-center gap-2 text-[10px] font-bold">
                              <div className={`rounded-full p-0.5 ${isValid ? 'text-blue-500' : 'text-zinc-300'}`}>
                                <Check className="h-2.5 w-2.5 stroke-[4px]" />
                              </div>
                              <span className={isValid ? 'text-zinc-900' : 'text-zinc-400'}>
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
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verify Security Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••••••"
                        type="password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-zinc-200 focus:border-zinc-950 focus:ring-0 transition-all font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold bg-zinc-950 text-white hover:bg-zinc-800 transition-all rounded-2xl group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    REWRITING IDENTITY...
                  </>
                ) : (
                  <>
                    INITIALIZE NEW ACCESS
                    <Lock className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-widest group"
            >
              <ArrowLeft className="h-3 w-3 transform group-hover:-translate-x-1 transition-transform" />
              Back to Portal
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-zinc-500">
          <ShieldCheck className="h-3 w-3 text-zinc-950" /> Secure Encryption
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-zinc-500">
          <Lock className="h-3 w-3 text-zinc-950" /> Vault Protection
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
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 font-heading">Identity Fault</h1>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-[240px]">
            No security token provided. Access denied.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="rounded-2xl px-8 h-10 text-xs font-bold bg-zinc-950 text-white">Request Valid Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-xl animate-pulse shadow-xl">
          V
        </div>
      </div>
    }>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
