'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';

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
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
        <Card className="w-full max-w-md border-2 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 bg-background/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500 border-2 border-primary/20">
                <Mail className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter">Check your email</h1>
                <p className="text-muted-foreground font-medium leading-relaxed px-4">
                  We&apos;ve sent a secure password reset link to <span className="text-foreground font-bold">{email}</span>.
                </p>
                <div className="p-4 bg-muted/50 rounded-2xl border-2 text-sm text-muted-foreground font-medium">
                  The security link will expire in <span className="font-bold text-foreground">60 minutes</span>.
                </div>
              </div>
              <div className="w-full space-y-4 pt-4 px-6">
                <Button onClick={() => router.push('/login')} className="w-full h-12 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all rounded-xl">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Return to Sign In
                </Button>
                <p className="text-xs text-muted-foreground font-medium">
                  Didn&apos;t receive the email? Check spam folder or{' '}
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset();
                    }}
                    className="text-primary hover:text-primary/80 font-black uppercase tracking-tight transition-colors"
                  >
                    try again
                  </button>
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -ml-48 -mb-24 pointer-events-none" />

      <div className="mx-auto w-full max-w-md relative z-10">
        {/* Back to Login */}
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-3 text-center mb-10">
          <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-xl mb-2">
            V
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Global Reset</h1>
            <p className="text-muted-foreground font-medium">
              Recover access to your vendor identity
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold tracking-tight">Security Verification</CardTitle>
              <Badge variant="outline" className="font-bold uppercase tracking-widest text-[10px] bg-background">Identity Check</Badge>
            </div>
            <CardDescription className="font-medium">
              Enter your corporate email to receive recovery protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold text-foreground/80">Corporate Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="representative@company.com"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            className="h-12 pl-12 rounded-xl border-2 focus-visible:ring-primary/20 transition-all font-medium"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initializing Recovery...
                    </>
                  ) : (
                    <>
                      Request Recovery Link
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Remember your credentials?{' '}
                <Link href="/login" className="font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-tight">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 bg-muted/30 border-t pt-6">
            <div className="flex items-start gap-3 text-xs text-muted-foreground font-medium px-4 leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p>For security reasons, we do not confirm if an account exists. If the email is registered, you will receive instructions shortly.</p>
            </div>
          </CardFooter>
        </Card>

        {/* Footer Text */}
        <p className="mt-10 text-center text-[11px] text-muted-foreground font-bold tracking-tight px-6 leading-relaxed uppercase opacity-60">
          Access is monitored. By requesting a reset link, you confirm your authorization to access this platform.
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl animate-pulse shadow-2xl">
          V
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
