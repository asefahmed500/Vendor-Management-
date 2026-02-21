'use client';

import { useEffect, useState } from 'react';
import {
  Award,
  Download,
  Calendar,
  ShieldCheck,
  ExternalLink,
  FileCheck,
  Database,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Shield,
  Loader2
} from 'lucide-react';
import { IVendor, VendorStatus } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function CertificatePage() {
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch('/api/vendor/profile');
        if (response.ok) {
          const result = await response.json();
          setVendor(result.data.vendor);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/vendor/certificate');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-cert-${vendor?.certificateNumber || 'authorized'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authenticating Pulse...</p>
      </div>
    );
  }

  if (vendor?.status !== 'APPROVED') {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700 max-w-lg mx-auto px-6">
        <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800 shadow-xl mb-10 relative">
          <Award className="h-10 w-10 text-zinc-300" />
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-950 rounded-xl p-2 border-2 shadow-lg">
            <Activity className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Credentials Quarantined</h2>
        <p className="text-zinc-500 font-medium leading-relaxed">
          The Nexus authority has not yet issued your cryptographic certificate. Approval sequence must reach 100% completion before artifact generation.
        </p>
        <Button variant="outline" className="mt-10 rounded-2xl h-14 px-10 font-black uppercase tracking-tight gap-2 border-2" asChild>
          <a href="/vendor/dashboard">Return to Hub</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto pb-12 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Auth Credential</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Network Verified
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Security Artifact
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Official cryptographic validation of your status as a verified vendor within the Nexus ecosystem. This document represents complete regulatory alignment.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleDownload}
            className="h-14 px-8 rounded-2xl font-black uppercase tracking-tight gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Deploy Download
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Certificate Display */}
        <div className="lg:col-span-2">
          <Card className="rounded-[4rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
            {/* Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Shield className="h-[600px] w-[600px]" />
            </div>

            <div className="relative z-10 border-8 border-zinc-50 dark:border-zinc-900/50 rounded-[3rem] p-10 sm:p-16 flex flex-col items-center text-center space-y-12">
              {/* Top Branding */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  <span className="text-xl font-black uppercase tracking-[0.3em]">Nexus Network</span>
                </div>
                <Separator className="w-24 mx-auto bg-primary h-1" />
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase leading-[0.9]">
                  Authorized <br /> Vendor
                </h2>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Governance & Compliance Protocol</p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic font-serif">This artifact confirms the verified status of</p>
                <p className="text-4xl lg:text-5xl font-black tracking-tight text-primary decoration-2 underline-offset-8 uppercase">{vendor?.companyName}</p>
              </div>

              <div className="grid grid-cols-2 gap-12 w-full max-w-md pt-8">
                <div className="text-left space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Nexus ID</p>
                  <p className="text-sm font-black font-mono tracking-widest uppercase">{vendor?.certificateNumber}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Validation Date</p>
                  <p className="text-sm font-black uppercase tracking-widest">
                    {vendor?.approvalDate ? new Date(vendor.approvalDate).toLocaleDateString() : 'Active'}
                  </p>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="relative pt-10">
                <div className="h-24 w-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center text-emerald-500 relative group/seal">
                  <ShieldCheck className="h-10 w-10 group-hover/seal:scale-110 transition-transform" />
                  <div className="absolute -inset-4 border border-zinc-100 rounded-full animate-spin-slow" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Details Meta */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                <Database className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">System Metadata</h2>
            </div>

            <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  {[
                    { label: 'Artifact Number', value: vendor?.certificateNumber, icon: Database },
                    { label: 'Company Entity', value: vendor?.companyName, icon: Shield },
                    { label: 'Node Authority', value: vendor?.contactPerson, icon: ShieldCheck },
                    { label: 'Verification Sequence', value: vendor?.approvalDate ? new Date(vendor.approvalDate).toLocaleDateString() : 'N/A', icon: Activity },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                        <item.icon className="h-3 w-3" />
                        {item.label}
                      </label>
                      <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="p-4 bg-emerald-500/5 rounded-2xl border-2 border-emerald-500/10">
                  <div className="flex gap-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-tight leading-relaxed">
                      This artifact is cryptographically signed and verified by the Nexus core terminal. Any modification voids legality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support */}
          <Card className="rounded-[2.5rem] bg-zinc-950 text-white p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <ExternalLink className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">Artifact Validation</h3>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed uppercase">
                  Third parties can verify this credential using our public blockchain explorer node.
                </p>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-xl border-zinc-800 text-white hover:bg-white hover:text-black font-black uppercase tracking-tight text-[10px]">
                Verify Status
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          </Card>
        </div>
      </div>
    </div>
  );
}
