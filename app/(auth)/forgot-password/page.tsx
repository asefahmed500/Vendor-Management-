'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, ArrowLeft, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

import { authClient } from '@/lib/auth/auth-client';

function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setEmail(values.email);

    const { data, error } = await (authClient as any).forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message || 'Failed to send reset email');
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      toast.success('Password reset email sent');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <Card className="w-full max-w-md border-zinc-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white p-2 overflow-hidden">
          <div className="bg-zinc-50/50 rounded-[2.2rem] px-8 py-12 flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-[2rem] bg-blue-50 flex items-center justify-center shadow-xl shadow-blue-500/10">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-heading font-bold tracking-tight text-zinc-950 italic">Check your inbox</h1>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                A recovery vector has been dispatched to <span className="font-bold text-zinc-950 italic">{email}</span>.
              </p>
            </div>
            <div className="w-full pt-4">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Login
              </Button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Link expires in 60 minutes.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Link 
        href="/login" 
        className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 mb-12 transition-all group"
      >
        <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
        Gateway Entry
      </Link>

      <Card className="border-zinc-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white p-2 overflow-hidden">
        <div className="bg-zinc-50/50 rounded-[2.2rem] px-8 py-10">
          <CardHeader className="p-0 space-y-3 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-4 shadow-xl shadow-zinc-950/10">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-heading font-bold tracking-tight text-zinc-950">
              Identity Recovery
            </CardTitle>
            <CardDescription className="text-sm font-medium text-zinc-500 leading-relaxed">
              Initiate a security protocol to recover access to your <span className="text-zinc-950 font-bold italic">VMS Core</span> identity.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Registered Mail</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 transition-colors group-focus-within:text-zinc-950" />
                          <Input
                            placeholder="operator@system.io"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            className="h-12 pl-11 pr-4 border-zinc-200/80 rounded-2xl focus-visible:ring-zinc-950 focus-visible:ring-offset-0 bg-white transition-all shadow-sm placeholder:text-zinc-300 text-sm font-medium"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Initializing...
                    </div>
                  ) : (
                    'Request Recovery Vector'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-6 mt-10 p-0">
            <div className="flex items-start gap-3 bg-zinc-100/50 p-4 rounded-2xl border border-zinc-200/50">
              <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                Security Policy: We do not confirm identity existence. If the mail is valid, a recovery link will arrive shortly.
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center w-full">
              Remembered? <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors ml-2">Sign In</Link>
            </p>
          </CardFooter>
        </div>
      </Card>

      <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">
        Recovery Core v1.0.2
      </p>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
