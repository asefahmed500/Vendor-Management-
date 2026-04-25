'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { authClient } from '@/lib/auth/auth-client';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
      }, {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          toast.success('Welcome back!');
          const user = ctx.data.user;
          const userRole = (user as unknown as { role?: string }).role || 'VENDOR';
          
          if (userRole === 'VENDOR') {
            try {
              const res = await fetch('/api/auth/password-status');
              const json = await res.json();
              if (json.success && json.data?.mustChangePassword) {
                router.push('/vendor-change-password');
                return;
              }
            } catch (e) {
              console.log('Password status check failed, proceeding to dashboard');
            }
          }
          
          const defaultRedirect = userRole === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard';
          router.push(redirect === '/' ? defaultRedirect : redirect);
        },
        onError: (ctx) => {
          const errorMessage = ctx.error.message || 'Invalid credentials';
          setSubmitError(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setSubmitError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

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
                <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20 group-hover:rotate-12 transition-all">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white text-zinc-400 border border-zinc-100 font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-full shadow-sm italic font-syne">Auth_Protocol_v4</Badge>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-4xl md:text-5xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-none">
                  Identity <br /> Validation
                </CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
                  Authentication required for <span className="text-zinc-950 italic">Secure Shard</span> access.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {submitError && (
                    <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-600 animate-in shake duration-500">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs font-bold uppercase tracking-wider">{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Identity Vector</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="operator@system.io"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className="h-12 px-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center justify-between ml-1">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Security Key</FormLabel>
                            <Link
                              className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                              href="/forgot-password"
                            >
                              Reset
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="••••••••••••"
                              type="password"
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="h-12 px-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-20 bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.3em] text-[12px] rounded-[1.5rem] shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8 font-syne italic"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-4">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      'Establish Connection'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="p-0 mt-10 space-y-6">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Link href="/forgot-password" className="hover:text-zinc-950 transition-colors underline underline-offset-4">
                  Forgot password?
                </Link>
                {process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== 'false' && (
                  <Link href="/register" className="hover:text-zinc-950 transition-colors underline underline-offset-4">
                    Create account
                  </Link>
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 leading-loose text-center w-full">
                By entering, you acknowledge the <Link href="#" className="text-zinc-950 underline underline-offset-4">Terms</Link> & <Link href="#" className="text-zinc-950 underline underline-offset-4">Protocols</Link>.
              </p>
            </CardFooter>
          </div>
        </Card>

        <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">
          Secure Environment v2.4.0
        </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}