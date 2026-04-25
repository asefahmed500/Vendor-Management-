'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Building2, 
  Mail, 
  Calendar, 
  MoreHorizontal, 
  Eye, 
  Globe, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock,
  Cpu,
  Fingerprint,
  ShieldCheck,
  Zap,
  Box,
  Database,
  LayoutGrid,
  Settings2,
  TrendingUp,
  Activity,
  FileSearch,
  ExternalLink,
  Lock
} from 'lucide-react';
import { IVendor, VendorStatus } from '@/lib/types/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface VendorsResponse {
  items: IVendor[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const statusConfig: Record<VendorStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'AWAITING AUDIT', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  APPROVED_LOGIN: { label: 'CHANNEL ACTIVE', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  DOCUMENTS_SUBMITTED: { label: 'MANIFEST SUBMITTED', color: 'text-zinc-600', bgColor: 'bg-zinc-50' },
  UNDER_REVIEW: { label: 'CORE REVIEW', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  APPROVED: { label: 'ENTITY VERIFIED', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  REJECTED: { label: 'ACCESS REVOKED', color: 'text-red-600', bgColor: 'bg-red-50' },
};

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<VendorsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') as VendorStatus | null;
  const search = searchParams.get('search') || '';

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      });

      if (status) params.set('status', status);
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/vendors?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/admin/vendors?${params.toString()}`);
  };

  const handleStatusFilter = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    params.delete('page');
    router.push(`/admin/vendors?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/vendors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 lg:p-10 font-body selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-zinc-100 pb-12">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <Badge className="bg-zinc-950 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic font-syne">Matrix_Protocol_01</Badge>
              <span className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-black font-syne italic">Vendor_Management_Core</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.85] drop-shadow-sm">
              Entity <br className="sm:hidden" /> Registry
            </h1>
            
            <p className="text-zinc-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Real-time monitoring of the <span className="text-zinc-950 font-bold">Global Corporate Ecosystem</span>. Overseeing <span className="text-blue-600 font-black italic underline decoration-blue-100 underline-offset-8 font-syne tracking-tight">{data?.pagination?.total || 0} registered entities</span>.
            </p>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button size="lg" asChild className="h-20 px-10 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group">
              <Link href="/admin/create-vendor" className="flex items-center">
                <Plus className="h-5 w-5 mr-4 group-hover:rotate-90 transition-transform duration-500" />
                Enroll New Entity
              </Link>
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            { label: 'Corporate Manifest', value: data?.pagination?.total || 0, sub: 'Total Registry Entries', icon: Building2, color: 'zinc' },
            { label: 'Verified Integrity', value: data?.items.filter(v => v.status === 'APPROVED').length || 0, sub: 'Governance Approved', icon: ShieldCheck, color: 'emerald' },
            { label: 'Pending Audits', value: data?.items.filter(v => v.status === 'PENDING' || v.status === 'UNDER_REVIEW').length || 0, sub: 'Awaiting Verification', icon: Clock, color: 'amber' },
            { label: 'Active Channels', value: data?.items.filter(v => v.status === 'APPROVED_LOGIN').length || 0, sub: 'Portal Access Enabled', icon: Zap, color: 'blue' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="rounded-[3rem] p-10 border-none bg-white shadow-2xl shadow-zinc-200/40 group hover:shadow-3xl hover:shadow-zinc-300/50 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-150">
                  <Icon className="w-full h-full" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-950'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <Badge className="bg-zinc-50 text-zinc-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">Zone: {stat.color.toUpperCase()}</Badge>
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-5xl font-syne font-black tracking-tighter uppercase text-zinc-950">
                    {stat.value}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.sub}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Operational Controls */}
        <div className="flex flex-col xl:flex-row items-center gap-8">
          <form onSubmit={handleSearch} className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
            <Input
              placeholder="Query Corporate Registry..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-24 pl-16 pr-8 bg-white border-none shadow-2xl shadow-zinc-200/40 focus-visible:ring-2 focus-visible:ring-zinc-950/5 rounded-[2.5rem] font-bold text-lg transition-all placeholder:text-zinc-300 placeholder:italic placeholder:font-medium"
            />
          </form>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <div className="hidden sm:flex items-center gap-4 bg-white/50 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-zinc-100 shadow-xl">
              <Filter className="h-4 w-4 text-zinc-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Governance Filter</span>
            </div>
            
            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="h-24 w-full sm:w-[320px] bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-950/20 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] px-12 transition-all hover:bg-zinc-800">
                <div className="flex items-center gap-4">
                   <Settings2 className="h-4 w-4 text-zinc-500" />
                   <SelectValue placeholder="Protocol Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[2.5rem] border-none shadow-3xl p-4 bg-white overflow-hidden">
                <SelectItem value="all" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value} className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className={`h-2 w-2 rounded-full ${config.color.replace('text', 'bg')}`} />
                       {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Registry Table Section */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white border-b border-zinc-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="h-24 px-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne border-r border-zinc-50">Entity Manifest</TableHead>
                    <TableHead className="h-24 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne border-r border-zinc-50">Governance Lead</TableHead>
                    <TableHead className="h-24 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne border-r border-zinc-50">Verification</TableHead>
                    <TableHead className="h-24 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne border-r border-zinc-50">Registry Date</TableHead>
                    <TableHead className="h-24 text-right px-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && !data ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-b border-zinc-50">
                        <TableCell colSpan={5} className="h-32 px-12">
                          <div className="flex items-center gap-8">
                             <Skeleton className="h-20 w-20 rounded-[1.75rem]" />
                             <div className="space-y-4">
                               <Skeleton className="h-6 w-64 rounded-full" />
                               <Skeleton className="h-4 w-40 rounded-full opacity-50" />
                             </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center gap-10">
                          <div className="h-32 w-32 rounded-[3.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner group relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50" />
                             <FileSearch className="h-12 w-12 text-zinc-200 group-hover:scale-110 transition-transform relative z-10" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Zero Entities Detected</p>
                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-xs mx-auto">No corporate records currently match the filtered criteria.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.items.map((vendor) => (
                      <TableRow key={vendor._id} className="group hover:bg-zinc-50/50 transition-all duration-700 border-b border-zinc-50 last:border-0 relative">
                        <TableCell className="px-12 py-12">
                          <div className="flex items-center gap-8">
                            <div className="h-20 w-20 rounded-[2rem] bg-zinc-950 flex items-center justify-center text-white shadow-2xl shadow-zinc-950/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative">
                              <Building2 className="h-8 w-8" />
                              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-500 border-4 border-white shadow-xl" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-bold text-zinc-950 tracking-tighter uppercase group-hover:translate-x-3 transition-transform duration-700 max-w-[300px] truncate">
                                {vendor.companyName}
                              </p>
                              <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <span className="text-zinc-950">ID: {vendor.taxId || 'UNASSIGNED'}</span>
                                <span className="h-1 w-1 rounded-full bg-zinc-200" />
                                <span className="italic truncate max-w-[200px]">{vendor.businessType || 'CORPORATION'}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5 group-hover:translate-x-2 transition-transform duration-700">
                            <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{vendor.contactPerson}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                               <Mail className="h-3 w-3" />
                               <span className="truncate max-w-[150px]">{(vendor as any).userId?.email || 'N/A'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm transition-all group-hover:scale-110 ${statusConfig[vendor.status].bgColor} ${statusConfig[vendor.status].color}`}
                          >
                            <span className="flex items-center gap-2">
                               <div className={`h-1.5 w-1.5 rounded-full ${statusConfig[vendor.status].color.replace('text', 'bg')} animate-pulse`} />
                               {statusConfig[vendor.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 text-zinc-400">
                            <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                               <Clock className="h-5 w-5 text-zinc-300 group-hover:text-blue-500" />
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Entry Date</span>
                               <span className="text-[12px] font-mono font-black uppercase tracking-widest block text-zinc-950 italic">{new Date(vendor.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-12">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-16 w-16 text-zinc-300 hover:text-zinc-950 hover:bg-white hover:shadow-2xl hover:border-zinc-100 border border-transparent rounded-[1.5rem] transition-all">
                                <MoreHorizontal className="h-7 w-7" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72 rounded-[2.5rem] border-none shadow-3xl p-4 bg-white z-50">
                              <DropdownMenuItem asChild className="rounded-2xl cursor-pointer p-5 focus:bg-zinc-50 transition-colors group">
                                <Link href={`/admin/vendors/${vendor._id}`} className="flex items-center gap-5">
                                  <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20 group-hover:rotate-12 transition-transform">
                                    <Eye className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-zinc-950 uppercase tracking-tight">Access Dossier</span>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Corporate Analysis</span>
                                  </div>
                                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-zinc-400" />
                                </Link>
                              </DropdownMenuItem>
                              <Separator className="my-2 bg-zinc-50" />
                              <DropdownMenuItem className="rounded-2xl cursor-pointer p-5 focus:bg-zinc-50 transition-colors group">
                                <div className="flex items-center gap-5 text-zinc-400">
                                  <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                    <ExternalLink className="h-5 w-5" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-black uppercase tracking-tight">Export Artifacts</span>
                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mt-0.5">Manifest Generation</span>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination System */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-12 py-12 bg-zinc-50/50 border-t border-zinc-100 gap-8">
                <div className="flex items-center gap-6">
                   <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                      <LayoutGrid className="h-5 w-5 text-zinc-400" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">Registry Segmentation</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Displaying {((data.pagination.page - 1) * data.pagination.pageSize) + 1} — {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} of {data.pagination.total} Entities
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100">
                  <Button
                    variant="ghost"
                    className="h-16 px-8 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all disabled:opacity-30 group"
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={!data.pagination.hasPrev}
                  >
                    <ChevronLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </Button>
                  <div className="h-10 w-[1px] bg-zinc-100" />
                  <Button
                    variant="ghost"
                    className="h-16 px-8 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all disabled:opacity-30 group"
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={!data.pagination.hasNext}
                  >
                    Next Segment
                    <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Global Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
           <Card className="rounded-[3rem] p-10 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group col-span-1 lg:col-span-2">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                          <Activity className="h-6 w-6 text-blue-400" />
                       </div>
                       <h4 className="text-[12px] font-black uppercase tracking-[0.3em] italic font-syne text-zinc-400">Ecosystem Health</h4>
                    </div>
                    <div className="space-y-2">
                       <p className="text-5xl font-syne font-black italic tracking-tighter uppercase leading-[0.9]">Registry Performance</p>
                       <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Audit efficiency and verification throughput ratings.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-10">
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Verification Yield</p>
                       <p className="text-4xl font-syne font-black text-white italic tracking-tighter">98.4%</p>
                    </div>
                    <div className="h-16 w-[1px] bg-white/10" />
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Audit</p>
                       <p className="text-4xl font-syne font-black text-emerald-400 italic tracking-tighter">OPTIMIZED</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[3rem] p-10 border-none bg-white shadow-2xl shadow-zinc-200/40 flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                 <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Lock className="h-7 w-7 text-zinc-950" />
                 </div>
                 <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest rounded-full px-4 py-2">System Guard</Badge>
              </div>
              <div className="space-y-4">
                 <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Security Framework</p>
                 <p className="text-xl font-bold text-zinc-950 uppercase tracking-tighter leading-tight italic">Corporate Intelligence Shield <span className="text-emerald-500">v1.2</span> Verified</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans">
        <div className="max-w-[1600px] mx-auto space-y-16">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-24 w-1/2 rounded-[2rem]" />
            <Skeleton className="h-6 w-2/3 rounded-full opacity-50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-[3rem]" />)}
          </div>
          <Skeleton className="h-[600px] w-full rounded-[4rem]" />
        </div>
      </div>
    }>
      <VendorsPageContent />
    </Suspense>
  );
}