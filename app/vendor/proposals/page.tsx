'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Briefcase, 
  Clock, 
  ChevronRight,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { IProposal } from '@/lib/types/proposal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  'IT_SERVICES',
  'CONSTRUCTION',
  'CONSULTING',
  'SUPPLY_CHAIN',
  'MARKETING',
  'MANUFACTURING',
  'PROFESSIONAL_SERVICES',
  'OTHER',
];

interface ProposalWithSubmissionStatus extends IProposal {
  submissionStatus?: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  hasSubmitted: boolean;
}

function VendorProposalsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [proposals, setProposals] = useState<ProposalWithSubmissionStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category');
  const search = searchParams.get('search') || '';

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const response = await fetch(`/api/vendor/proposals?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setProposals(result.data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    router.push(`/vendor/proposals?${params.toString()}`);
  };

  const handleCategoryFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    router.push(`/vendor/proposals?${params.toString()}`);
  };

  const getTimeRemaining = (deadline: Date | string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Closed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return 'Closing soon';
  };

  const isDeadlineNear = (deadline: Date | string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff < 48 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Proposals</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Opportunities
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and apply for open RFPs
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={category || 'all'}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">No opportunities found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => router.push('/vendor/proposals')}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal._id} className="border-border/50 hover:border-accent/30 transition-colors">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  {isDeadlineNear(proposal.deadline) && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {proposal.category.replace(/_/g, ' ')}
                  </Badge>
                  <h3 className="font-heading font-semibold text-lg leading-tight mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {proposal.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${proposal.budgetMax.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className={`font-medium ${isDeadlineNear(proposal.deadline) ? 'text-danger' : ''}`}>
                      {getTimeRemaining(proposal.deadline)}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-4 border-t border-border">
                  {proposal.hasSubmitted ? (
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {proposal.submissionStatus === 'SUBMITTED' ? 'Submitted' :
                         proposal.submissionStatus === 'UNDER_REVIEW' ? 'Under Review' :
                         proposal.submissionStatus === 'ACCEPTED' ? 'Accepted' :
                         proposal.submissionStatus === 'REJECTED' ? 'Rejected' : 'Draft'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/vendor/proposals/${proposal._id}`)}
                      >
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/vendor/proposals/${proposal._id}`)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {!isLoading && proposals.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span>{proposals.length} opportunities</span>
              <span>·</span>
              <span>{proposals.filter((p) => p.hasSubmitted).length} applied</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function VendorProposalsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 pb-12">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    }>
      <VendorProposalsPageContent />
    </Suspense>
  );
}