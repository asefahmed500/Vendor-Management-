'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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
import { Card, CardContent } from '@/components/ui/card';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function VendorChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/vendor/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to change password');

      toast.success('Password changed successfully');
      
      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-2 shadow-lg">
          V
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">Security Update</h1>
        <p className="text-zinc-500 text-sm font-medium">
          Set a new access key for your account
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs font-bold text-red-500">{submitError}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Access Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          type="password"
                          className="pl-11 h-12 rounded-2xl border-zinc-200 focus:border-zinc-950 focus:ring-0 transition-all font-medium"
                          placeholder="Temporary password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Security Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          type="password"
                          className="pl-11 h-12 rounded-2xl border-zinc-200 focus:border-zinc-950 focus:ring-0 transition-all font-medium"
                          placeholder="Create strong password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verify New Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          type="password"
                          className="pl-11 h-12 rounded-2xl border-zinc-200 focus:border-zinc-950 focus:ring-0 transition-all font-medium"
                          placeholder="Confirm security key"
                          {...field}
                        />
                      </div>
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
                    REWRITING SECURITY...
                  </>
                ) : (
                  <>
                    CONFIRM NEW IDENTITY
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 opacity-40">
          <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-zinc-500">
            <ShieldCheck className="h-3 w-3 text-zinc-950" /> Secure Protocol
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-zinc-500">
            <Lock className="h-3 w-3 text-zinc-950" /> Vault Protection
          </div>
        </div>
        
        <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest pt-4">
          Having trouble? <Link href="/login" className="text-zinc-950 hover:underline">Contact System Admin</Link>
        </p>
      </div>
    </div>
  );
}

}