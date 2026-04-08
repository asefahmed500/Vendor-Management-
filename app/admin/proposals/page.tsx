'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  DollarSign,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal, ProposalStatus } from '@/lib/types/proposal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProposalsResponse {
  items: IProposal[];
  pagination: { total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
}

const statusConfig: Record<ProposalStatus, { label: string; variant: 'default' | 'success' | 'danger' | 'warning' }> = {
  DRAFT: { label: 'Draft', variant: 'default' },
  OPEN: { label: 'Open', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'danger' },
  AWARDED: { label: 'Awarded', variant: 'warning' },
};

const categories = ['IT_SERVICES', 'CONSTRUCTION', 'CONSULTING', 'SUPPLY_CHAIN', 'MARKETING', 'MANUFACTURING', 'PROFESSIONAL_SERVICES', 'OTHER'];

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
    if (!confirm('Delete this proposal?')) return;
    try {
      const response = await fetch(`/api/admin/proposals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Proposal deleted');
        fetchProposals();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/proposals?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Proposals
          </h1>
          <p className="text-muted-foreground mt-1">
            {data?.pagination?.total || 0} total proposals
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/proposals/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="AWARDED">Awarded</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="py-16 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">No proposals found</h3>
              <Button asChild variant="outline">
                <Link href="/admin/proposals/create">Create First Proposal</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Title</th>
                      <th className="text-left p-4 font-medium text-sm">Category</th>
                      <th className="text-left p-4 font-medium text-sm">Budget</th>
                      <th className="text-left p-4 font-medium text-sm">Deadline</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-right p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items.map((proposal) => (
                      <tr key={proposal._id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4">
                          <p className="font-medium">{proposal.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{proposal.description}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-xs">
                            {proposal.category.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">${proposal.budgetMax.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(proposal.deadline).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant={statusConfig[proposal.status].variant}>
                            {statusConfig[proposal.status].label}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/proposals/${proposal._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(proposal._id)}>
                              <Trash2 className="h-4 w-4 text-danger" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {((data.pagination.page - 1) * data.pagination.pageSize) + 1} - {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} of {data.pagination.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(data.pagination.page - 1)} disabled={!data.pagination.hasPrev}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{data.pagination.page} / {data.pagination.totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(data.pagination.page + 1)} disabled={!data.pagination.hasNext}>
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

export default function ProposalsPage() {
  return (
    <Suspense fallback={<div className="space-y-8"><div className="h-24 bg-muted animate-pulse rounded-lg" /><div className="h-96 bg-muted animate-pulse rounded-lg" /></div>}>
      <ProposalsPageContent />
    </Suspense>
  );
}