'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { authClient } from '@/lib/auth/auth-client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    await authClient.signIn.email({
      email: values.email,
      password: values.password,
    }, {
      onRequest: () => {
        setIsLoading(true);
      },
      onSuccess: (ctx) => {
        toast.success('Logged in successfully');
        const user = ctx.data.user;
        const userRole = (user as any).role || 'VENDOR';
        const defaultRedirect = userRole === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard';
        router.push(redirect === '/' ? defaultRedirect : redirect);
        setIsLoading(false);
      },
      onError: (ctx) => {
        const errorMessage = ctx.error.message || 'Login failed';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -ml-48 -mb-24 pointer-events-none" />

      <div className="mx-auto w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to homepage
        </Link>

        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-3 text-center mb-10">
          <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-xl mb-2">
            V
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground font-medium">
              Access your enterprise vendor portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold tracking-tight">Sign In</CardTitle>
              <Badge variant="outline" className="font-bold uppercase tracking-widest text-[10px] bg-background">Secure</Badge>
            </div>
            <CardDescription className="font-medium">
              Enter your corporate credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-bold text-foreground/80">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="work@company.com"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-bold text-foreground/80">Password</FormLabel>
                          <Link
                            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                            href="/forgot-password"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-muted" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-background px-4 text-muted-foreground">
                  Partner Access
                </span>
              </div>
            </div>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-bold rounded-xl border-2 hover:bg-muted/50 transition-all" type="button">
                Create New Enterprise Account
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Security Info */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
            <ShieldCheck className="h-4 w-4 text-primary" /> SOC2 COMPLIANT
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
            <Lock className="h-4 w-4 text-primary" /> AES-256 ENCRYPTION
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-[11px] text-muted-foreground font-bold tracking-tight px-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">
            Privacy Policy
          </Link>
          . For security reasons, we log all access attempts.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl animate-pulse shadow-2xl">
          V
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
