'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Loader2,
  ArrowLeft,
  Copy,
  CheckCircle,
  Mail,
  ShieldCheck,
  UserPlus,
  Info,
  Building2,
  Phone,
  User,
  Hash,
  Shield,
  Zap,
  Check,
  ChevronRight,
  ArrowRight,
  ChevronLeft,
  Key,
  Globe,
  Briefcase,
  Cpu,
  Lock,
  ExternalLink,
  QrCode,
  Fingerprint,
  Activity,
  ShieldAlert
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const createVendorSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  companyName: z.string().min(2, 'Company name required'),
  contactPerson: z.string().min(2, 'Contact person required'),
  phone: z.string().min(1, 'Phone required'),
  companyType: z.string().optional(),
  taxId: z.string().optional(),
});

type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

interface CreatedVendor {
  email: string;
  tempPassword: string;
  companyName: string;
}

export default function CreateVendorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdVendor, setCreatedVendor] = useState<CreatedVendor | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      email: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      companyType: '',
      taxId: '',
    },
  });

  const onSubmit = async (values: CreateVendorFormValues) => {
    setIsLoading(true);
    setSubmitError(null);
    setCreatedVendor(null);

    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          generatePassword: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to create vendor');

      if (result.data?.tempPassword) {
        setCreatedVendor({
          email: values.email,
          tempPassword: result.data.tempPassword,
          companyName: values.companyName,
        });
        toast.success('Vendor registered successfully');
      } else {
        toast.success('Vendor registered successfully');
        router.push('/admin/vendors');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create vendor';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (createdVendor) {
      const text = `Email: ${createdVendor.email}\nTemporary Password: ${createdVendor.tempPassword}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Credentials copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1200px] mx-auto space-y-20 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/vendors" className="hover:text-zinc-950 transition-colors">Registry Repository</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">Entity Onboarding</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Entity <br /> Onboarding
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Register a new strategic entity and generate encrypted access credentials. Enrollment initiates a <span className="text-zinc-950 font-bold italic text-blue-600 underline decoration-blue-100 underline-offset-8">Mandatory Security Protocol</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
             <div className="flex items-center gap-4 bg-white p-4 pr-10 rounded-[2rem] border border-zinc-100 shadow-2xl shadow-zinc-200/40">
                <div className="h-14 w-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-900/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">Registry Access</span>
                   <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic font-syne italic">Control_Point_Alpha</span>
                </div>
             </div>
          </div>
        </div>

        {/* Success View */}
        {createdVendor ? (
          <div className="max-w-4xl mx-auto space-y-10 animate-slide-up">
            <Card className="border-none shadow-4xl shadow-zinc-200/60 rounded-[4rem] overflow-hidden bg-white">
              <div className="bg-zinc-950 p-20 relative overflow-hidden">
                {/* Visual Architecture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:48px_48px]" />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                  <div className="h-24 w-24 rounded-[2.5rem] bg-white text-zinc-950 flex items-center justify-center shadow-4xl transition-transform duration-1000 hover:rotate-12 scale-110">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-5xl font-syne font-black italic text-white uppercase tracking-tighter">Access Provisioned</h3>
                    <p className="text-zinc-500 font-black text-[11px] uppercase tracking-[0.4em] max-w-sm mx-auto">Credentials successfully injected into global registry shard.</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md rounded-full px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] font-syne italic">STATUS: ARCHIVE_ACTIVE</Badge>
                </div>
              </div>
              
              <CardContent className="p-20 space-y-16">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="group relative p-12 bg-zinc-50 border border-zinc-100 rounded-[3rem] transition-all duration-700 hover:bg-white hover:shadow-4xl hover:shadow-zinc-200/50 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 font-syne">Identity Token</span>
                      <Mail className="h-6 w-6 text-zinc-300 group-hover:text-zinc-950 transition-colors" />
                    </div>
                    <p className="text-3xl text-zinc-950 font-syne font-black tracking-tighter uppercase italic">{createdVendor.email}</p>
                    <div className="h-1.5 w-16 bg-blue-500 mt-8 rounded-full group-hover:w-full transition-all duration-1000" />
                  </div>

                  <div className="group relative p-12 bg-zinc-50 border border-zinc-100 rounded-[3rem] transition-all duration-700 hover:bg-white hover:shadow-4xl hover:shadow-zinc-200/50 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 font-syne">Temporary Access Key</span>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm" onClick={copyCredentials}>
                        {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6" />}
                      </Button>
                    </div>
                    <p className="text-4xl text-zinc-950 font-mono font-black tracking-tighter group-hover:text-blue-600 transition-colors">{createdVendor.tempPassword}</p>
                    <div className="h-1.5 w-16 bg-emerald-500 mt-8 rounded-full group-hover:w-full transition-all duration-1000" />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 p-12 bg-blue-50/50 border border-blue-100/50 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full" />
                  <div className="h-20 w-20 rounded-[1.75rem] bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-2xl shadow-blue-100/50 border border-blue-50 group-hover:rotate-12 transition-transform duration-700">
                    <Lock className="h-10 w-10" />
                  </div>
                  <div className="space-y-4 text-center lg:text-left flex-1">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-600 font-syne italic">Protocol Directive #04</h4>
                    <p className="text-lg text-blue-900 leading-relaxed font-medium">
                      Relay these credentials to <span className="font-black italic underline decoration-blue-200 underline-offset-8 tracking-tight">{createdVendor.companyName}</span>. 
                      Security architecture enforces a <span className="text-blue-600 font-bold">Mandatory Key Rotation</span> upon initial system authentication.
                    </p>
                  </div>
                  <QrCode className="h-16 w-16 text-blue-200 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10">
                  <Button onClick={() => { setCreatedVendor(null); form.reset(); }} variant="outline" className="flex-1 rounded-[2.5rem] h-24 border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50 transition-all font-black uppercase tracking-[0.4em] text-[12px] group">
                    <UserPlus className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-transform" />
                    Enroll New Partner
                  </Button>
                  <Button onClick={() => router.push('/admin/vendors')} className="flex-1 rounded-[2.5rem] h-24 bg-zinc-950 text-white hover:bg-zinc-800 shadow-3xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black uppercase tracking-[0.4em] text-[12px] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      Access Repository
                      <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-3" />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Form View */
          <div className="max-w-5xl mx-auto space-y-12 animate-slide-up">
            <Card className="border-none shadow-4xl shadow-zinc-200/60 rounded-[4rem] overflow-hidden bg-white">
              <div className="px-16 py-12 border-b border-zinc-50 flex flex-col md:flex-row items-center justify-between bg-zinc-50/20 gap-10">
                <div className="flex items-center gap-10">
                  <div className="h-20 w-20 rounded-[2rem] bg-zinc-950 flex items-center justify-center shadow-4xl shadow-zinc-900/30 group-hover:rotate-12 transition-transform duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
                    <UserPlus className="h-9 w-9 text-white relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Entity Profile</h2>
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-syne">Awaiting_Registry_Injection</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <Badge className="bg-white text-zinc-400 border border-zinc-100 font-black uppercase tracking-[0.3em] text-[10px] px-8 py-3 rounded-2xl shadow-sm italic font-syne">PHASE: 01 / 01</Badge>
                   <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                      <Activity className="h-5 w-5 text-zinc-300" />
                   </div>
                </div>
              </div>
              
              <CardContent className="p-16">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
                    {submitError && (
                      <div className="p-10 bg-red-50/50 border border-red-100 rounded-[2.5rem] flex items-center gap-8 animate-in slide-in-from-top-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                           <ShieldAlert className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] font-syne italic">Registration_Fault_Detected</p>
                           <p className="text-sm font-black text-red-700 uppercase tracking-tight">{submitError}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-12">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Legal Entity Identification</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <Building2 className="h-5 w-5" />
                                </div>
                                <Input {...field} placeholder="E.G. STRATEGIC DYNAMICS INC." className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Corporate Signal Link (Email)</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <Mail className="h-5 w-5" />
                                </div>
                                <Input type="email" {...field} placeholder="E.G. OPS@STRATEGIC.COM" className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Lead Representative Shard</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <User className="h-5 w-5" />
                                </div>
                                <Input {...field} placeholder="E.G. ELIAS VANCE" className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Secure Voice Transmission Line</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <Phone className="h-5 w-5" />
                                </div>
                                <Input type="tel" {...field} placeholder="+1 555-0199" className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="h-[1px] bg-zinc-50 w-full relative">
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-white">
                          <Cpu className="h-5 w-5 text-zinc-100" />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Legal Architecture Shard</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <Briefcase className="h-5 w-5" />
                                </div>
                                <Input {...field} placeholder="E.G. GLOBAL_CORP" className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 font-syne">Federal Registry Identifier (Tax ID)</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-focus-within:bg-zinc-950 group-focus-within:text-white transition-all duration-500">
                                   <Fingerprint className="h-5 w-5" />
                                </div>
                                <Input {...field} placeholder="ID-000-X" className="h-24 pl-24 pr-8 rounded-[2rem] border-none bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 text-[11px] font-black uppercase tracking-[0.3em] placeholder:text-zinc-200 placeholder:italic transition-all outline-none shadow-inner" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-4" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 pt-12 border-t border-zinc-50">
                      <div className="flex items-center gap-8 text-blue-500 bg-blue-50/50 p-8 rounded-[3rem] border border-blue-100/50 flex-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-2000" />
                        <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-xl shadow-blue-200/50 border border-blue-50 shrink-0">
                           <Zap className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[12px] font-black uppercase tracking-[0.4em] font-syne italic">Automated_Provisioning_Link</p>
                           <p className="text-sm font-black text-blue-900/60 uppercase tracking-tight leading-relaxed max-w-sm">
                             Secure credentials will be automatically generated and encrypted upon successful registry injection.
                           </p>
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="h-24 px-16 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-4xl shadow-zinc-950/30 transition-all hover:scale-[1.05] active:scale-[0.95] min-w-[340px] font-black uppercase tracking-[0.4em] text-[12px] group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        {isLoading ? (
                          <div className="flex items-center gap-4 relative z-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            INITIALIZING...
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 relative z-10">
                            AUTHORIZE REGISTRATION
                            <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-3" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic font-syne">
               <Shield className="h-3 w-3" />
               SECURED_BY_VMS_ENCRYPTION_CORE_V2
            </div>
          </div>
        )}
      </div>
    </div>
  );
}