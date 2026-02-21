'use client';

import { useEffect, useState } from 'react';
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
  Zap,
  Clock,
  ChevronRight,
  Database,
  Terminal,
  FileText,
  Lock,
  ArrowUpRight
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
  SelectValue
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
        toast.error(data.error || 'System rejection identified');
      }
    } catch (error) {
      console.error('Fetch audit logs error:', error);
      toast.error('Nexus connection failure');
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
    a.download = `vms-audit-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Audit ledger exported to host');
  };

  const getActivityIcon = (type: string) => {
    if (type.includes('VENDOR') || type.includes('REGISTRATION')) return Building2;
    if (type.includes('DOCUMENT')) return FileText;
    if (type.includes('LOGIN')) return Lock;
    return Terminal;
  };

  const getActivityColor = (type: string) => {
    if (type.includes('REJECTED')) return 'danger';
    if (type.includes('APPROVED') || type.includes('VERIFIED')) return 'success';
    if (type.includes('CREATED') || type.includes('LOGIN')) return 'secondary';
    if (type.includes('UNDER_REVIEW')) return 'warning';
    return 'default';
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
    <div className="space-y-12 animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] px-3">Protocol Ledger</Badge>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Database className="h-3 w-3" />
              Immutable Audit Trail
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
            System Operations
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            Comprehensive monitoring of nexus transactions, node modifications, and authorized agent interactions across the VMS ecosystem.
          </p>
        </div>

        <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tight gap-3 shadow-sm border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 group">
          <Download className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          Export Ledger
        </Button>
      </div>

      {/* Control Center */}
      <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-zinc-50 dark:divide-zinc-900">
          {/* Search */}
          <div className="p-8 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Global Tracer</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search Logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="p-8 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Event Logic</label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="h-14 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-black uppercase tracking-tight text-xs">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2 border-2">
                <SelectItem value="ALL" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">All Operations</SelectItem>
                <SelectItem value="VENDOR_CREATED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Vendor Init</SelectItem>
                <SelectItem value="DOCUMENT_VERIFIED" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Asset Verification</SelectItem>
                <SelectItem value="LOGIN" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Agent Access</SelectItem>
                <SelectItem value="FINAL_APPROVAL" className="rounded-xl font-bold uppercase tracking-tighter text-xs h-10">Entity Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="p-8 space-y-3 lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Temporal Window</label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                />
              </div>
              <div className="h-0.5 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="relative flex-1 group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-2 bg-zinc-50/50 dark:bg-zinc-900/50 font-bold"
                />
              </div>
              <Button onClick={handleFilter} className="h-14 w-14 rounded-2xl shadow-lg shrink-0">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Ledger */}
      <Card className="rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative">
        <CardHeader className="p-10 flex flex-row items-center justify-between border-b-2 border-zinc-50 dark:border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter">Activity Stream</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live system synchronization data</CardDescription>
            </div>
          </div>
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && activities.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
              <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center border-2 animate-pulse">
                <Terminal className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Synchronizing Ledger Nodes...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-8 text-center">
              <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800 shadow-xl">
                <Activity className="h-10 w-10 text-zinc-200" />
              </div>
              <div className="max-w-xs space-y-2">
                <p className="text-xl font-black uppercase tracking-tight">Stream Isolated</p>
                <p className="text-xs font-bold text-zinc-400 uppercase leading-relaxed tracking-widest">
                  Zero operations identified matching the selected temporal or logic parameters.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b-2 border-zinc-50 dark:border-zinc-900">
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Temporal Stamp</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Operation Node</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Transaction Logic</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Entity Hub</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Agent Identifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-50 dark:divide-zinc-900">
                  {filteredActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.activityType);
                    return (
                      <tr key={activity._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all">
                        <td className="px-10 py-8 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black uppercase tracking-tight">{new Date(activity.createdAt).toLocaleDateString()}</div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(activity.createdAt).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-zinc-300" />
                            <Badge variant={getActivityColor(activity.activityType)} className="font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-md border-2">
                              {activity.activityType.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 max-w-sm line-clamp-2 uppercase leading-relaxed tracking-tight group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                            {activity.description}
                          </p>
                        </td>
                        <td className="px-10 py-8 whitespace-nowrap">
                          {activity.vendorId?.companyName ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 text-zinc-400" />
                              <span className="text-xs font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200">{activity.vendorId.companyName}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">— NEXUS GLOBAL</span>
                          )}
                        </td>
                        <td className="px-10 py-8 whitespace-nowrap">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <User className="h-3 w-3 text-zinc-400" />
                              </div>
                              <span className="text-xs font-bold text-zinc-500">{activity.performedBy}</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-zinc-200 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Infrastructure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Integrity Scan', icon: ShieldCheck, val: '100% SECURE', desc: 'All ledger entries verified by nexus cryptographic loops.' },
          { label: 'Ledger Depth', icon: Activity, val: activities.length + ' EVENTS', desc: 'Total tracked operations in current session buffer.' },
          { label: 'Access Control', icon: Lock, val: 'PROTOCOL LEVEL 4', desc: 'Audit visibility restricted to authorized high-level agents.' }
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                <p className="font-black text-sm uppercase tracking-tight">{stat.val}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">{stat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
