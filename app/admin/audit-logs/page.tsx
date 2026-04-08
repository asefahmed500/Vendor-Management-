'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Activity,
  Filter,
  Calendar,
  Download,
  Search,
  User,
  Building2,
  Loader2,
  ShieldCheck,
  Clock,
  FileText,
  Lock,
  ArrowUpRight,
  TrendingUp,
  FilePlus,
  Trophy,
  Settings,
} from 'lucide-react';
import { ApiResponse } from '@/lib/types/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';

interface ActivityLogEntry {
  _id: string;
  activityType: string;
  description: string;
  vendorId?: { companyName: string };
  performedBy: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

const activityIcons: Record<string, React.ElementType> = {
  VENDOR_CREATED: Building2,
  REGISTRATION_APPROVED: ShieldCheck,
  REGISTRATION_REJECTED: FileText,
  DOCUMENTS_SUBMITTED: FileText,
  DOCUMENT_UPLOADED: FileText,
  DOCUMENT_VERIFIED: ShieldCheck,
  DOCUMENT_REJECTED: FileText,
  UNDER_REVIEW: Clock,
  FINAL_APPROVAL: ShieldCheck,
  FINAL_REJECTION: FileText,
  REVISION_REQUESTED: FileText,
  PROFILE_UPDATED: User,
  LOGIN: Lock,
  PROPOSAL_CREATE: FilePlus,
  SUBMISSION_RANKING_UPDATE: Trophy,
  DOCUMENT_TYPE_CREATE: Settings,
};

const activityColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  VENDOR_CREATED: 'secondary',
  REGISTRATION_APPROVED: 'success',
  REGISTRATION_REJECTED: 'danger',
  DOCUMENTS_SUBMITTED: 'default',
  DOCUMENT_UPLOADED: 'default',
  DOCUMENT_VERIFIED: 'success',
  DOCUMENT_REJECTED: 'danger',
  UNDER_REVIEW: 'warning',
  FINAL_APPROVAL: 'success',
  FINAL_REJECTION: 'danger',
  REVISION_REQUESTED: 'warning',
  PROFILE_UPDATED: 'secondary',
  LOGIN: 'secondary',
  PROPOSAL_CREATE: 'default',
  SUBMISSION_RANKING_UPDATE: 'success',
  DOCUMENT_TYPE_CREATE: 'secondary',
};

export default function AdminAuditLogsPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityType, setActivityType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (activityType && activityType !== 'ALL') params.append('activityType', activityType);

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data: ApiResponse<{
        recentActivities: ActivityLogEntry[];
        activitiesByType: Record<string, number>;
      }> = await response.json();

      if (data.success && data.data) {
        setActivities(data.data.recentActivities);
      } else {
        toast.error(data.error || 'Failed to fetch audit logs');
      }
    } catch (error) {
      console.error('Fetch audit logs error:', error);
      toast.error('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    fetchActivities();
  };

  const handleExport = () => {
    const csvContent = [
      'Date,Activity Type,Description,Vendor,Performed By',
      ...activities.map((a) =>
        `${new Date(a.createdAt).toISOString()},${a.activityType},"${a.description}",${a.vendorId?.companyName || 'N/A'},${a.performedBy}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vms-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Audit logs exported');
  };

  const filteredActivities = activities.filter((activity) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.description.toLowerCase().includes(searchLower) ||
        activity.activityType.toLowerCase().includes(searchLower) ||
        activity.vendorId?.companyName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Admin</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system activity and changes
          </p>
        </div>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-full lg:w-[200px] h-10">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="VENDOR_CREATED">Vendor Created</SelectItem>
                <SelectItem value="REGISTRATION_APPROVED">Registration Approved</SelectItem>
                <SelectItem value="REGISTRATION_REJECTED">Registration Rejected</SelectItem>
                <SelectItem value="DOCUMENT_VERIFIED">Document Verified</SelectItem>
                <SelectItem value="DOCUMENT_REJECTED">Document Rejected</SelectItem>
                <SelectItem value="FINAL_APPROVAL">Final Approval</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="PROPOSAL_CREATE">Proposal Created</SelectItem>
                <SelectItem value="SUBMISSION_RANKING_UPDATE">Ranking Updated</SelectItem>
                <SelectItem value="DOCUMENT_TYPE_CREATE">Doc Type Created</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 w-[160px]"
              />
              <span className="text-zinc-600 text-sm">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 w-[160px]"
              />
            </div>
            <Button onClick={handleFilter} variant="secondary" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Activity Log</CardTitle>
                <CardDescription className="text-sm">{activities.length} entries</CardDescription>
              </div>
            </div>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && activities.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center animate-pulse">
                <Activity className="h-5 w-5 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-600">Loading audit logs...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">No activity found</p>
                <p className="text-sm text-zinc-600 mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredActivities.map((activity) => {
                const Icon = activityIcons[activity.activityType] || Activity;
                const colorVariant = activityColors[activity.activityType] || 'default';

                return (
                  <div key={activity._id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400 transition-colors shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {activity.performedBy}
                        </span>
                        {activity.vendorId && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {activity.vendorId.companyName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant={colorVariant} className="text-xs shrink-0">
                      {activity.activityType.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Total Activities</p>
                <p className="text-2xl font-bold">{activities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Unique Types</p>
                <p className="text-2xl font-bold">{new Set(activities.map(a => a.activityType)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Access Level</p>
                <p className="text-2xl font-bold">Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
