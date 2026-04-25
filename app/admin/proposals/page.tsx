'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Eye, 
  Trash2,
  Briefcase,
  DollarSign,
  Calendar,
  Activity,
  Clock,
  Target,
  Globe,
  MoreHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Zap,
  Cpu,
  Database,
  ShieldCheck,
  ArrowUpRight,
  SearchX,
  Settings2,
  LayoutGrid,
  FileSearch,
  History,
  Fingerprint,
  Box,
  TrendingUp,
  Award,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';

interface ProposalsResponse {
  items: IProposal[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
}

const statusConfig: Record<ProposalStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  DRAFT: { label: 'ENROLLMENT', color: 'text-zinc-400', bgColor: 'bg-zinc-50', icon: History },
  OPEN: { label: 'ACTIVE PROTOCOL', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Activity },
  CLOSED: { label: 'PROTOCOL ENDED', color: 'text-red-600', bgColor: 'bg-red-50', icon: Clock },
  AWARDED: { label: 'SUCCESSFUL TENDER', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: Award },
};

function ProposalsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ProposalsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') as ProposalStatus | null;
  const category = searchParams.get('category');
  const search = searchParams.get('search') || '';

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: '10' });
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/proposals?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to access procurement intelligence');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, category, search]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set('search', searchInput);
    else params.delete('search');
    params.delete('page');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handleStatusFilter = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);
    params.delete('page');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this RFP protocol?')) return;
    try {
      const response = await fetch(`/api/admin/proposals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('RFP protocol terminated');
        fetchProposals();
      }
    } catch (error) {
      toast.error('Termination failed');
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/proposals?${params.toString()}`);
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Database className="h-10 w-10 text-zinc-300" />
          </div>
        </div>
        <div className="space-y-3 text-center">
           <h2 className="text-2xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Synchronizing Ledger</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Scanning Procurement Channels…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-20 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-zinc-950 transition-colors">Admin Core</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">Opportunity Ledger</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Procurement <br /> Registry
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Centralized interface for <span className="text-zinc-950 font-bold italic">RFP Management</span> and <span className="text-zinc-950 font-bold">Bidding Channels</span>. Monitoring <span className="text-blue-600 font-black italic underline decoration-blue-100 underline-offset-8">{data?.pagination?.total || 0} active protocols</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button 
              size="lg" 
              asChild 
              className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
            >
              <Link href="/admin/proposals/create" className="flex items-center">
                <Plus className="h-5 w-5 mr-4 group-hover:rotate-90 transition-transform duration-500" />
                Initialize RFP
              </Link>
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            { label: 'RFP Protocols', value: data?.pagination?.total || 0, sub: 'Total Registry Entries', icon: Database, color: 'zinc' },
            { label: 'Active Streams', value: data?.items.filter(i => i.status === 'OPEN').length || 0, sub: 'Live Bidding Channels', icon: Activity, color: 'blue' },
            { label: 'Draft Manifests', value: data?.items.filter(i => i.status === 'DRAFT').length || 0, sub: 'Awaiting Initiation', icon: History, color: 'zinc' },
            { label: 'Successful Tenders', value: data?.items.filter(i => i.status === 'AWARDED').length || 0, sub: 'Closed & Allocated', icon: Target, color: 'emerald' },
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
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-950'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
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
            <input
              placeholder="QUERY RFP REGISTRY BY TITLE, ENTITY, OR PROTOCOL ID…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-24 w-full pl-16 pr-8 bg-white border-none shadow-2xl shadow-zinc-200/40 focus-visible:ring-2 focus-visible:ring-zinc-950/5 rounded-[2.5rem] font-bold text-lg transition-all placeholder:text-zinc-300 placeholder:italic placeholder:font-medium outline-none"
            />
          </form>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="h-24 w-full sm:w-[320px] bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-950/20 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] px-12 transition-all hover:bg-zinc-800">
                <div className="flex items-center gap-4">
                   <Settings2 className="h-4 w-4 text-zinc-500" />
                   <SelectValue placeholder="Protocol Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[2.5rem] border-none shadow-3xl p-4 bg-white overflow-hidden">
                <SelectItem value="all" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer">All Protocols</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value} className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className={cn("h-2 w-2 rounded-full", config.color.replace('text', 'bg'))} />
                       {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-24 w-24 rounded-[2.5rem] border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 hover:bg-zinc-50 hover:shadow-3xl transition-all">
              <Filter className="h-6 w-6 text-zinc-400" />
            </Button>
          </div>
        </div>

        {/* Registry Table Section */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <Card className="rounded-[4rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50/80 border-b border-zinc-100">
                  <TableRow>
                    <TableHead className="h-28 px-12 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">RFP Identity Manifest</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Classification</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Fiscal Allocation</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Termination</TableHead>
                    <TableHead className="h-28 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Protocol Status</TableHead>
                    <TableHead className="h-28 text-right px-12 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic font-syne">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center gap-10">
                          <div className="h-32 w-32 rounded-[3.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner group relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50" />
                             <SearchX className="h-12 w-12 text-zinc-200 group-hover:scale-110 transition-transform relative z-10" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Zero Protocols Detected</p>
                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-xs mx-auto">Adjust decryption parameters to scan deeper into the procurement registry.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.items.map((proposal, index) => {
                      const config = statusConfig[proposal.status];
                      return (
                        <TableRow 
                          key={proposal._id} 
                          className="group hover:bg-zinc-50/50 transition-all duration-700 border-b border-zinc-50 last:border-0 relative"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="px-12 py-14">
                            <div className="flex items-center gap-10">
                              <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-2xl shadow-zinc-950/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
                                <Box className="h-10 w-10 relative z-10" />
                                <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-blue-500 border-[5px] border-white shadow-xl" />
                              </div>
                              <div className="space-y-3">
                                <p className="text-2xl font-syne font-black text-zinc-950 tracking-tighter uppercase group-hover:translate-x-4 transition-transform duration-700 max-w-[400px] truncate italic">
                                  {proposal.title}
                                </p>
                                <div className="flex items-center gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                                  <span className="text-zinc-950 font-mono">ID: {proposal._id.slice(-8).toUpperCase()}</span>
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                                  <span className="italic truncate max-w-[250px]">{proposal.description}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-zinc-100 text-zinc-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-full px-8 py-3.5 border-none shadow-sm group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500 italic font-syne">
                              {proposal.category.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2 group-hover:scale-110 origin-left transition-transform duration-700">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Max Allocation</p>
                              <div className="flex items-center gap-3 text-3xl font-syne font-black text-zinc-950 tracking-tighter italic">
                                <DollarSign className="h-6 w-6 text-emerald-500" strokeWidth={4} />
                                {proposal.budgetMax.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-6">
                              <div className="h-12 w-12 rounded-[1.25rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-700 text-zinc-300 group-hover:text-blue-500">
                                 <Clock className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Registry End</span>
                                 <span className="text-[13px] font-mono font-black uppercase tracking-widest block text-zinc-950 italic">
                                   {new Date(proposal.deadline).toLocaleDateString(undefined, { 
                                     day: '2-digit', 
                                     month: 'short', 
                                     year: 'numeric' 
                                   })}
                                 </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "rounded-[1.5rem] px-8 py-4 text-[10px] font-black uppercase tracking-widest border-none shadow-2xl transition-all group-hover:scale-110 italic font-syne",
                                config.bgColor, config.color
                              )}
                            >
                              <span className="flex items-center gap-3">
                                 <div className={cn("h-2 w-2 rounded-full animate-pulse", config.color.replace('text', 'bg'))} />
                                 {config.label}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-12">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-16 w-16 text-zinc-300 hover:text-zinc-950 hover:bg-white hover:shadow-2xl hover:border-zinc-100 border border-transparent rounded-[1.5rem] transition-all">
                                  <MoreVertical className="h-7 w-7" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-80 rounded-[3rem] border-none shadow-3xl p-6 bg-white z-50">
                                <DropdownMenuItem asChild className="rounded-[1.75rem] cursor-pointer p-6 focus:bg-zinc-50 transition-colors group">
                                  <Link href={`/admin/proposals/${proposal._id}`} className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-950/20 group-hover:rotate-12 transition-transform">
                                      <Eye className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-black text-zinc-950 uppercase tracking-tight">Access Protocol</span>
                                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 italic font-syne">Deep Intelligence Audit</span>
                                    </div>
                                    <ArrowUpRight className="h-6 w-6 ml-auto text-zinc-200 group-hover:text-zinc-950 transition-colors" />
                                  </Link>
                                </DropdownMenuItem>
                                <Separator className="my-3 bg-zinc-50" />
                                <DropdownMenuItem className="rounded-[1.75rem] cursor-pointer p-6 text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors group" onClick={() => handleDelete(proposal._id)}>
                                  <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 group-hover:bg-white transition-colors">
                                      <Trash2 className="h-6 w-6 text-red-500" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-black uppercase tracking-tight">Terminate RFP</span>
                                      <span className="text-[10px] font-black text-red-400/80 uppercase tracking-widest mt-1 italic font-syne">Purge Channel Data</span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Premium Pagination System */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex flex-col lg:flex-row items-center justify-between px-16 py-16 bg-zinc-50/30 border-t border-zinc-50 gap-12">
                <div className="flex items-center gap-10">
                   <div className="h-20 w-20 rounded-[2.5rem] bg-white border border-zinc-100 flex items-center justify-center shadow-xl">
                      <LayoutGrid className="h-8 w-8 text-zinc-300" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.3em]">Registry Segmentation</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
                        Displaying {((data.pagination.page - 1) * data.pagination.pageSize) + 1} — {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} of {data.pagination.total} Protocols
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white p-3 rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100">
                  <Button
                    variant="ghost"
                    className="h-16 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all disabled:opacity-30 group"
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={!data.pagination.hasPrev}
                  >
                    <ChevronLeft className="h-5 w-5 mr-3 group-hover:-translate-x-2 transition-transform" />
                    Previous
                  </Button>
                  <div className="h-10 w-[1px] bg-zinc-100" />
                  <Button
                    variant="ghost"
                    className="h-16 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all disabled:opacity-30 group"
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={!data.pagination.hasNext}
                  >
                    Next Segment
                    <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Global Compliance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
           <Card className="rounded-[4rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group col-span-1 lg:col-span-2 min-h-[400px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                 <div className="space-y-10">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                          <TrendingUp className="h-8 w-8 text-blue-400" />
                       </div>
                       <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-400">Yield Analytics</h4>
                    </div>
                    <div className="space-y-4">
                       <p className="text-6xl font-syne font-black italic tracking-tighter uppercase leading-[0.85]">Procurement <br /> Efficiency</p>
                       <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] max-w-sm">Optimization rating based on active award metrics and resource allocation.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Registry Velocity</p>
                       <p className="text-5xl font-syne font-black text-white italic tracking-tighter">94.2%</p>
                    </div>
                    <div className="h-20 w-[1px] bg-white/10" />
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Channel Health</p>
                       <p className="text-5xl font-syne font-black text-emerald-400 italic tracking-tighter">SECURE</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[4rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 flex flex-col justify-between group min-h-[400px]">
              <div className="flex items-center justify-between">
                 <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <ShieldCheck className="h-10 w-10 text-zinc-950" />
                 </div>
                 <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-[0.3em] rounded-full px-6 py-3 italic font-syne shadow-sm">Verified Registry</Badge>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                   <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Governance Standard</p>
                   <p className="text-2xl font-syne font-black text-zinc-950 uppercase tracking-tighter leading-[0.95] italic">Ecosystem Compliance Protocol <span className="text-blue-600">v4.0.2</span> Established</p>
                 </div>
                 <div className="h-1.5 w-24 bg-zinc-950 rounded-full group-hover:w-full transition-all duration-1000" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Initializing Procurement Stream…</p>
      </div>
    }>
      <ProposalsPageContent />
    </Suspense>
  );
}