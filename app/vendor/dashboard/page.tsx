'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import {
  FileText,
  Briefcase,
  CheckCircle,
  Upload,
  Search,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Plus,
  Zap,
  Activity,
  ArrowRight,
  Shield,
  FileCheck,
  Globe
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { data: session, isPending: isLoading } = useSession();
  const [data, setData] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/vendor/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsInitialLoading(false);
      }
    }
    if (session) {
      fetchData();
    } else if (!isLoading) {
      setIsInitialLoading(false);
    }
  }, [session, isLoading]);

  if (isLoading || isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-12 animate-fade-in">
        <div className="h-24 w-24 rounded-comfortable bg-warm-white flex items-center justify-center mb-8 border-notion-whisper shadow-notion-card">
          <Shield className="h-10 w-10 text-warm-gray-300" />
        </div>
        <h2 className="text-sub-heading-large text-notion-black mb-3">Access Restricted</h2>
        <p className="text-warm-gray-500 max-w-xs mx-auto text-body mb-10 leading-relaxed">
          Please authenticate your vendor account to access the partner portal.
        </p>
        <Button asChild className="h-14 px-10 rounded-comfortable text-body-medium bg-notion-black text-notion-white hover:bg-warm-dark transition-all shadow-notion-card">
          <Link href="/login">Verify Identity</Link>
        </Button>
      </div>
    );
  }

  const vendorStatus = data?.vendor?.status || 'PENDING';
  const verifiedDocs = data?.documents?.filter((d: any) => d.status === 'APPROVED').length || 0;
  const totalDocs = data?.documents?.length || 0;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-20 px-6 md:px-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b-notion-whisper">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="badge-notion-pill">
              Partner Network
            </Badge>
            <Badge variant="outline" className={`badge-notion-pill border-notion-whisper bg-transparent ${vendorStatus === 'APPROVED' ? 'text-semantic-green' : 'text-semantic-orange'}`}>
              Status: {vendorStatus.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-display-secondary text-notion-black">
            Welcome, <br /> {session.user?.name?.split(' ')[0] || 'Partner'}
          </h1>
          <p className="text-body-large text-warm-gray-500 mt-6 max-w-2xl leading-relaxed">
            Monitor your compliance status, explore new procurement opportunities, and manage your vendor profile from the central partner hub.
          </p>
        </div>

        <div className="flex items-center gap-4 animate-fade-up delay-100">
          <Button variant="outline" size="lg" asChild className="rounded-micro border-notion-whisper h-14 px-8 text-body-medium hover:bg-warm-white transition-all group">
            <Link href="/vendor/profile" className="flex items-center">
              <Plus className="h-4 w-4 mr-3 text-warm-gray-300 group-hover:text-notion-black transition-colors" />
              Update Profile
            </Link>
          </Button>
          <Button size="lg" asChild className="rounded-micro h-14 px-10 text-body-medium bg-notion-blue text-notion-white hover:bg-notion-active-blue shadow-notion-card transition-all hover:-translate-y-1 active:translate-y-0">
            <Link href="/vendor/proposals">
              Explore RFPs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: FileCheck, label: 'Compliance Index', value: `${verifiedDocs}/${totalDocs}`, color: 'text-warm-gray-500', desc: 'Verified documents' },
          { icon: Briefcase, label: 'Active Streams', value: data?.proposalStats?.openProposals || '0', color: 'text-semantic-green', desc: 'Live opportunities' },
          { icon: ShieldCheck, label: 'System Trust', value: vendorStatus === 'APPROVED' ? 'Verified' : 'Pending', color: 'text-notion-black', desc: 'Authority status' },
        ].map((stat, i) => (
          <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <Card className="card-notion hover:shadow-notion-deep transition-all duration-200 group">
              <CardContent className="p-8 flex items-center gap-8">
                <div className={`h-20 w-20 rounded-comfortable bg-warm-white border-notion-whisper flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="space-y-1.5">
                  <div className="text-sub-heading-large text-notion-black">{stat.value}</div>
                  <div className="text-micro uppercase">{stat.label}</div>
                  <p className="text-micro text-warm-gray-300">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Action Hub */}
      <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-12 pt-4">
        {/* Compliance Section */}
        <div className="lg:col-span-7 space-y-12">
          <Card className="card-notion-featured overflow-hidden animate-fade-up delay-400">
            <CardHeader className="p-10 border-b-notion-whisper bg-warm-white/20 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-sub-heading-large text-notion-black">Compliance Gateway</CardTitle>
                <CardDescription className="text-body-medium text-warm-gray-500">Security documentation and verification status</CardDescription>
              </div>
              <div className="h-14 w-14 rounded-comfortable bg-notion-white border-notion-whisper flex items-center justify-center shadow-notion-card">
                <ShieldCheck className="h-6 w-6 text-notion-black" />
              </div>
            </CardHeader>
            <CardContent className="p-12 text-center space-y-10">
              <div className="relative inline-block">
                <div className="h-32 w-32 rounded-large bg-warm-white border-notion-whisper flex items-center justify-center mx-auto shadow-notion-card">
                  <FileText className={`h-12 w-12 ${totalDocs > 0 ? 'text-notion-black' : 'text-warm-gray-300'}`} />
                </div>
                {totalDocs > 0 && verifiedDocs === totalDocs && (
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-semantic-green border-4 border-notion-white flex items-center justify-center text-notion-white shadow-notion-card">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <h3 className="text-sub-heading-large text-notion-black">
                  {totalDocs > 0 ? 'System Compliance' : 'Documentation Required'}
                </h3>
                <p className="text-body text-warm-gray-500 leading-relaxed">
                  {totalDocs > 0
                    ? `You have successfully logged ${verifiedDocs} of ${totalDocs} required security protocols.`
                    : 'Your account is currently limited. Please upload the required compliance documentation to unlock all features.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="rounded-micro h-14 text-body-medium border-notion-whisper text-notion-black hover:bg-warm-white transition-all">
                  <Link href="/vendor/documents">View Records</Link>
                </Button>
                <Button asChild className="rounded-micro h-14 bg-notion-blue text-notion-white hover:bg-notion-active-blue shadow-notion-card transition-all text-body-medium">
                  <Link href="/vendor/documents">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities Sidebar */}
        <div className="lg:col-span-5 space-y-12">
          <Card className="card-notion overflow-hidden animate-fade-up delay-500">
            <CardHeader className="p-10 border-b-notion-whisper bg-warm-white/20 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-card-title text-notion-black">Market Hub</CardTitle>
                <CardDescription className="text-micro text-warm-gray-300 uppercase">Active Procurement</CardDescription>
              </div>
              <Globe className="h-5 w-5 text-warm-gray-300" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-comfortable bg-notion-white hover:bg-warm-white/50 transition-all border-notion-whisper group cursor-pointer">
                  <div className="h-14 w-14 rounded-comfortable bg-warm-white flex items-center justify-center text-warm-gray-300 group-hover:bg-notion-white group-hover:text-notion-black group-hover:shadow-notion-card transition-all border-notion-whisper">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-body-medium text-notion-black group-hover:text-notion-black transition-colors">Infrastructure Project {i}</p>
                      <Badge className="badge-notion-pill">Live</Badge>
                    </div>
                    <p className="text-micro text-warm-gray-300 uppercase">Security Cluster • Closes in 2d</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button asChild variant="ghost" className="w-full h-12 rounded-subtle text-warm-gray-300 hover:text-notion-black hover:bg-warm-white text-body-medium group transition-all">
                  <Link href="/vendor/proposals" className="flex items-center justify-center">
                    View All Opportunities <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support / Quick Help */}
          <Card className="bg-notion-black text-notion-white border-none shadow-notion-deep overflow-hidden rounded-large group relative animate-fade-in delay-700">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Zap className="h-32 w-32 -rotate-12" />
            </div>
            <CardContent className="p-10 relative z-10">
              <h3 className="text-sub-heading-large mb-4 tracking-tight">Need Assistance?</h3>
              <p className="text-warm-gray-300 text-body mb-8 leading-relaxed">
                Our support desk is available 24/7 for technical and compliance guidance.
              </p>
              <Button asChild className="w-full h-14 bg-notion-white text-notion-black hover:bg-warm-white rounded-subtle text-body-medium shadow-notion-card transition-all">
                <Link href="mailto:support@vms.system">Contact Desk</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
