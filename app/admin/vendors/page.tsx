'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Plus, Building2, User, Mail, Calendar, ExternalLink, MoreVertical, ShieldCheck } from 'lucide-react';
import { IVendor, VendorStatus } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const statusVariants: Record<VendorStatus, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED_LOGIN: 'info',
  DOCUMENTS_SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

const statusLabels: Record<VendorStatus, string> = {
  PENDING: 'Registration Pending',
  APPROVED_LOGIN: 'Access Enabled',
  DOCUMENTS_SUBMITTED: 'Docs Verified',
  UNDER_REVIEW: 'Audit in Progress',
  APPROVED: 'Verified Partner',
  REJECTED: 'Access Denied',
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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Ecosystem Management</Badge>
            {data?.pagination && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{data.pagination.total} Active Nodes</span>}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            Vendor Registry
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            Comprehensive directory of authenticated partners and onboarding entities within the VMS network.
          </p>
        </div>
        <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 shadow-xl transition-all hover:scale-105" asChild>
          <Link href="/admin/create-vendor">
            <Plus className="h-5 w-5" />
            Initialize Vendor
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <form onSubmit={handleSearch} className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Query company name, tax ID or contact..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-primary/20 bg-zinc-50/50 dark:bg-zinc-900/50 font-medium"
              />
            </form>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select
                value={status || 'all'}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="h-14 w-full md:w-[240px] rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 opacity-50" />
                    <SelectValue placeholder="Stream Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-2 border-2">
                  <SelectItem value="all" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">All Entities</SelectItem>
                  <SelectItem value="PENDING" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Pending Approval</SelectItem>
                  <SelectItem value="APPROVED_LOGIN" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Access Enabled</SelectItem>
                  <SelectItem value="DOCUMENTS_SUBMITTED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Docs Verified</SelectItem>
                  <SelectItem value="UNDER_REVIEW" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Audit Phase</SelectItem>
                  <SelectItem value="APPROVED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Verified Partner</SelectItem>
                  <SelectItem value="REJECTED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Access Denied</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 group hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <MoreVertical className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] h-20 w-full" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-32 flex flex-col items-center gap-6">
              <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                <Search className="h-10 w-10 text-zinc-300" />
              </div>
              <div>
                <p className="text-2xl font-black uppercase tracking-tight">Zero Matches Found</p>
                <p className="text-zinc-500 font-medium mt-1">Adjust filters or refine search query for broader results.</p>
              </div>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => {
                setSearchInput('');
                router.push('/admin/vendors');
              }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-zinc-400">Organization</TableHead>
                      <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-zinc-400">Node Contact</TableHead>
                      <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-zinc-400">Nexus Comm</TableHead>
                      <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-zinc-400">System Status</TableHead>
                      <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-zinc-400">Registry Date</TableHead>
                      <TableHead className="py-6 px-8 text-right font-black uppercase tracking-widest text-[10px] text-zinc-400">Operations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items.map((vendor) => (
                      <TableRow key={vendor._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border-zinc-100 dark:border-zinc-900 group transition-all h-24">
                        <TableCell className="px-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-zinc-200 dark:border-zinc-700">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black tracking-tight text-sm group-hover:text-primary transition-colors">{vendor.companyName}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">VAT: {vendor.taxId || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-8">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="space-y-0.5">
                              <p className="font-bold text-sm">{vendor.contactPerson}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{vendor.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-8">
                          <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                            <Mail className="h-3 w-3" />
                            {(vendor as unknown as { userId?: { email?: string } }).userId?.email || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="px-8">
                          <Badge variant={statusVariants[vendor.status]} className="font-black uppercase tracking-[0.05em] text-[10px] px-2.5 py-1 rounded-lg border-2">
                            {statusLabels[vendor.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 font-bold text-zinc-400 text-xs text-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(vendor.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" className="rounded-xl font-black uppercase tracking-tighter text-[10px] h-10 hover:bg-primary/10 hover:text-primary border-transparent hover:border-primary/20 border transition-all">
                              <Link href={`/admin/vendors/${vendor._id}`} className="gap-2">
                                <Eye className="h-3 w-3" />
                                Inspect
                              </Link>
                            </Button>
                            <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                              <MoreVertical className="h-4 w-4 text-zinc-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-8 border-t-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Transmission Window <span className="text-zinc-600 dark:text-zinc-300 mx-2">{(data.pagination.page - 1) * data.pagination.pageSize + 1} - {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)}</span> of <span className="text-zinc-600 dark:text-zinc-300 ml-1">{data.pagination.total}</span> Resulting Units
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(data.pagination.page - 1)}
                      disabled={!data.pagination.hasPrev}
                      className="h-10 w-10 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 font-black text-xs uppercase text-zinc-500 bg-white dark:bg-zinc-950 px-4 h-10 rounded-xl border-2 shadow-sm">
                      <span className="text-primary">{data.pagination.page}</span>
                      <span className="opacity-30 mx-1">/</span>
                      <span>{data.pagination.totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(data.pagination.page + 1)}
                      disabled={!data.pagination.hasNext}
                      className="h-10 w-10 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/2 rounded-full blur-[100px] pointer-events-none" />
      </Card>

      {/* Support Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase tracking-tight text-xs">Security Protocol Active</p>
              <p className="text-xs font-medium text-zinc-500">All vendor data is encrypted with AES-256 standards. Audit logs track all nexus interactions.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <ExternalLink className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase tracking-tight text-xs">Partner Export Engine</p>
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">Generate ecosystem report <ExternalLink className="h-3 w-3" /></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="space-y-10">
      <div className="h-24 bg-muted animate-pulse rounded-[2rem]" />
      <div className="h-96 bg-muted animate-pulse rounded-[2rem]" />
    </div>}>
      <VendorsPageContent />
    </Suspense>
  );
}
