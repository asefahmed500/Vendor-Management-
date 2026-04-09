'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Plus, Building2, Mail, Calendar, MoreVertical, ShieldCheck } from 'lucide-react';
import { IVendor, VendorStatus } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const statusVariants: Record<VendorStatus, 'default' | 'secondary' | 'warning' | 'success' | 'destructive'> = {
  PENDING: 'warning',
  APPROVED_LOGIN: 'secondary',
  DOCUMENTS_SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

const statusLabels: Record<VendorStatus, string> = {
  PENDING: 'Pending',
  APPROVED_LOGIN: 'Access Enabled',
  DOCUMENTS_SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Verified',
  REJECTED: 'Rejected',
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
    <div className="space-y-12 pb-24 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-zinc-950 pb-8">
        <div>
          <Badge variant="outline" className="mb-4 border-zinc-950 text-zinc-950">Directory: Network</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-zinc-950 uppercase">
            Vendor Registry
          </h1>
          <p className="text-zinc-600 mt-2 font-medium uppercase tracking-widest text-xs">
            Operational: {data?.pagination?.total || 0} entities registered
          </p>
        </div>
        <Button asChild className="border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/admin/create-vendor">
            <Plus className="h-4 w-4 mr-2" />
            Initialize Vendor
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-4 border-zinc-950 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search registry indices..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 border-2 border-zinc-950 bg-white"
              />
            </div>
            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[240px] border-2 border-zinc-950 bg-white rounded-none font-bold uppercase text-[10px] tracking-widest">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-zinc-950">
                <SelectItem value="all">ALL ENTITIES</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="APPROVED_LOGIN">ACCESS ENABLED</SelectItem>
                <SelectItem value="DOCUMENTS_SUBMITTED">SUBMITTED</SelectItem>
                <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
                <SelectItem value="APPROVED">VERIFIED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary" className="border-2 border-zinc-950 bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Filter className="h-4 w-4 mr-2" />
              Filter Results
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-4 border-zinc-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => router.push('/admin/vendors')}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <Table className="border-collapse">
                <TableHeader className="bg-zinc-50 border-b-2 border-zinc-950">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-black text-xs uppercase tracking-widest text-zinc-950 py-5">Company Node</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest text-zinc-950 py-5">Internal Contact</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest text-zinc-950 py-5">Network ID</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest text-zinc-950 py-5">System Status</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest text-zinc-950 py-5">Entry Date</TableHead>
                    <TableHead className="text-right font-black text-xs uppercase tracking-widest text-zinc-950 py-5">Execute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map((vendor) => (
                    <TableRow key={vendor._id} className="border-b border-zinc-200 hover:bg-zinc-50/50 transition-colors">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 border-2 border-zinc-950 flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Building2 className="h-5 w-5 text-zinc-950" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight text-zinc-950">{vendor.companyName}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{vendor.taxId || 'UNREGISTERED'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <p className="font-bold text-sm text-zinc-950">{vendor.contactPerson}</p>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{vendor.phone}</p>
                      </TableCell>
                      <TableCell className="py-5">
                         <p className="text-xs font-mono text-zinc-600">
                          {(vendor as unknown as { userId?: { email?: string } }).userId?.email || 'N/A'}
                         </p>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge 
                          variant="outline"
                          className={`rounded-none border-2 font-black uppercase text-[10px] tracking-widest px-3 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            vendor.status === 'APPROVED' ? 'border-emerald-600 text-emerald-600' : 
                            vendor.status === 'REJECTED' ? 'border-red-600 text-red-600' :
                            vendor.status === 'PENDING' ? 'border-amber-600 text-amber-600' :
                            'border-zinc-950 text-zinc-950'
                          }`}
                        >
                          {statusLabels[vendor.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
                          {new Date(vendor.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right py-5">
                        <Button asChild variant="outline" size="sm" className="rounded-none border-2 border-zinc-950 font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                          <Link href={`/admin/vendors/${vendor._id}`}>
                            VIEW
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {((data.pagination.page - 1) * data.pagination.pageSize) + 1} - {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} of {data.pagination.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.pagination.page - 1)}
                      disabled={!data.pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {data.pagination.page} / {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.pagination.page + 1)}
                      disabled={!data.pagination.hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    }>
      <VendorsPageContent />
    </Suspense>
  );
}