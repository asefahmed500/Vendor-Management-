'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Activity,
  Filter,
  Download,
  Search,
  User,
  Building2,
  Loader2,
  ShieldCheck,
  Clock,
  FileText,
  Lock,
  FilePlus,
  Trophy,
  Settings,
  Database,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  RefreshCw,
  SearchX,
  Fingerprint,
  Cpu,
  History,
  AlertCircle,
  ChevronLeft,
  LayoutGrid,
  Settings2,
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { ApiResponse } from '@/lib/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Link from 'next/link';
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
  REGISTRATION_REJECTED: AlertTriangle,
  DOCUMENTS_SUBMITTED: FileText,
  DOCUMENT_UPLOADED: FilePlus,
  DOCUMENT_VERIFIED: CheckCircle2,
  DOCUMENT_REJECTED: SearchX,
  UNDER_REVIEW: Activity,
  FINAL_APPROVAL: ShieldCheck,
  FINAL_REJECTION: XCircle,
  REVISION_REQUESTED: RefreshCw,
  PROFILE_UPDATED: User,
  LOGIN: LockKeyhole,
  PROPOSAL_CREATE: LayoutGrid,
  SUBMISSION_RANKING_UPDATE: Trophy,
  DOCUMENT_TYPE_CREATE: Settings2,
};

const getStatusStyles = (type: string) => {
  const isPositive = type.includes('APPROVED') || type.includes('VERIFIED') || type.includes('SUCCESS');
  const isNegative = type.includes('REJECTED') || type.includes('DENIED');
  const isSecurity = type.includes('LOGIN') || type.includes('ACCESS');

  if (isPositive) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: 'text-emerald-500' };
  if (isNegative) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: 'text-red-500' };
  if (isSecurity) return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: 'text-blue-500' };
  return { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-100', icon: 'text-zinc-500' };
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
        toast.error(data.error || 'Failed to synchronize audit stream');
      }
    } catch (error) {
      console.error('Fetch audit logs error:', error);
      toast.error('Audit synchronization failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    fetchActivities();
  };

  const handleExport = () => {
    const csvContent = [
      'Timestamp,Activity Type,Description,Vendor Entity,Actor Signature',
      ...activities.map((a) =>
        `${new Date(a.createdAt).toISOString()},${a.activityType},"${a.description}",${a.vendorId?.companyName || 'N/A'},${a.performedBy}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShieldPlus-AUDIT-EXPORT-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Audit intelligence exported successfully');
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

  const stats = [
    { label: 'Strategic Operations', value: activities.length, sub: 'Logged Transmissions', icon: Cpu, color: 'zinc' },
    { label: 'Protocol Variants', value: new Set(activities.map(a => a.activityType)).size, sub: 'Unique Event IDs', icon: Zap, color: 'blue' },
    { label: 'Primary Actor', value: 'Root Admin', sub: 'Authorization LVL 5', icon: Shield, color: 'emerald' },
    { label: 'System Integrity', value: 'Verified', sub: 'SHA-256 Validated', icon: ShieldCheck, color: 'zinc' }
  ];

  if (isLoading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-12 font-dm-sans flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-[3.5rem] border-4 border-zinc-100 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Fingerprint className="h-10 w-10 text-zinc-300" />
          </div>
        </div>
        <div className="space-y-3 text-center">
           <h2 className="text-2xl font-syne font-black italic tracking-tighter uppercase text-zinc-950">Decrypting Ledger</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Synchronizing immutable audit streams…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-16 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-zinc-950 transition-colors">Admin Core</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">Audit Inventory</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Audit <br /> Inventory
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                A high-fidelity <span className="text-zinc-950 font-bold">Immutable Registry</span> recording all protocol transitions and administrative interactions within the ecosystem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <Button 
              onClick={handleExport} 
              variant="outline" 
              className="h-20 px-10 rounded-[2.5rem] border-zinc-200 text-zinc-950 hover:bg-white hover:shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.3em] group shadow-sm bg-white/50 backdrop-blur-md"
            >
              <Download className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              Export Intelligence
            </Button>
            <Button 
              onClick={handleFilter}
              disabled={isLoading}
              className="h-20 px-12 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] font-black uppercase tracking-[0.25em] group"
            >
              <RefreshCw className={cn("h-5 w-5 mr-4 transition-transform duration-1000 group-hover:rotate-180", isLoading && "animate-spin")} />
              Sync Ledger
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
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
                  <Badge className="bg-zinc-50 text-zinc-400 border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full">Protocol: {stat.color.toUpperCase()}</Badge>
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
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
            <input
              placeholder="SEARCH REGISTRY BY SIGNATURE, ENTITY, OR PROTOCOL…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-24 w-full pl-16 pr-8 bg-white border-none shadow-2xl shadow-zinc-200/40 focus-visible:ring-2 focus-visible:ring-zinc-950/5 rounded-[2.5rem] font-bold text-lg transition-all placeholder:text-zinc-300 placeholder:italic placeholder:font-medium outline-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="h-24 w-full sm:w-[320px] bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-950/20 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] px-12 transition-all hover:bg-zinc-800">
                <div className="flex items-center gap-4">
                   <Settings2 className="h-4 w-4 text-zinc-500" />
                   <SelectValue placeholder="Protocol Variants" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[2.5rem] border-none shadow-3xl p-4 bg-white overflow-hidden">
                <SelectItem value="ALL" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer">All Protocols</SelectItem>
                <SelectItem value="VENDOR_CREATED" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer text-blue-600">Vendor Enrollment</SelectItem>
                <SelectItem value="REGISTRATION_APPROVED" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer text-emerald-600">Verification Success</SelectItem>
                <SelectItem value="DOCUMENT_VERIFIED" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer text-indigo-600">Document Approval</SelectItem>
                <SelectItem value="LOGIN" className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] py-5 focus:bg-zinc-50 transition-colors cursor-pointer text-zinc-950">Security Access</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center h-24 bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/40 px-4">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-full border-none bg-transparent text-[10px] font-black uppercase w-[150px] px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="h-8 w-[1px] bg-zinc-100" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-full border-none bg-transparent text-[10px] font-black uppercase w-[150px] px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>

        {/* Ledger Section */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-zinc-200/40 overflow-hidden relative border border-white/20">
            <div className="px-12 py-12 border-b border-zinc-50 bg-zinc-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="h-20 w-20 rounded-[2.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-3xl shadow-zinc-950/20 group-hover:scale-110 transition-transform duration-700">
                  <Database className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-none">Protocol Stream</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">{filteredActivities.length} Events Synced From Nexus</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-zinc-950 text-white border-none font-black uppercase tracking-[0.3em] text-[9px] px-6 py-3 rounded-full shadow-2xl shadow-zinc-950/20 italic font-syne">End-to-End Encrypted</Badge>
            </div>
            
            <div className="divide-y divide-zinc-50">
              {filteredActivities.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center gap-12 text-center">
                  <div className="h-32 w-32 rounded-[3.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50" />
                    <SearchX className="h-12 w-12 text-zinc-200 group-hover:scale-110 transition-transform relative z-10" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-3xl font-syne font-black text-zinc-950 uppercase italic tracking-tighter">Zero Events Detected</p>
                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">Adjust decryption parameters to scan deeper into the corporate ledger.</p>
                  </div>
                </div>
              ) : (
                filteredActivities.map((activity, index) => {
                  const Icon = activityIcons[activity.activityType] || Activity;
                  const styles = getStatusStyles(activity.activityType);

                  return (
                    <div 
                      key={activity._id} 
                      className="flex flex-col lg:flex-row lg:items-center gap-12 p-12 hover:bg-zinc-50/50 transition-all duration-700 group relative overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-zinc-950 group-hover:h-2/3 transition-all duration-700 rounded-r-full" />
                      
                      <div className="flex items-center gap-12 flex-1 min-w-0">
                        <div className={cn(
                          "h-24 w-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden",
                          styles.bg, styles.icon
                        )}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                          <Icon className="h-10 w-10 relative z-10" />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-6">
                          <p className="text-3xl font-syne font-black text-zinc-950 tracking-tighter uppercase leading-[0.9] group-hover:translate-x-4 transition-transform duration-700 italic">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center flex-wrap gap-4">
                            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-[1.25rem] border border-zinc-100 shadow-sm group-hover:shadow-xl transition-all duration-700">
                               <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                  <User className="h-4 w-4" />
                               </div>
                               <span className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{activity.performedBy}</span>
                            </div>
                            
                            {activity.vendorId && (
                              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-[1.25rem] border border-zinc-100 shadow-sm group-hover:shadow-xl transition-all duration-700">
                                 <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <Building2 className="h-4 w-4" />
                                 </div>
                                 <span className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em] truncate max-w-[200px]">{activity.vendorId.companyName}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-[1.25rem] border border-zinc-100 shadow-sm group-hover:shadow-xl transition-all duration-700 ml-auto lg:ml-0">
                               <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                  <Clock className="h-4 w-4" />
                               </div>
                               <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic font-mono">
                                 {new Date(activity.createdAt).toLocaleString(undefined, { 
                                   dateStyle: 'medium', 
                                   timeStyle: 'short' 
                                 })}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between lg:justify-end gap-10 shrink-0 lg:w-[320px]">
                        <Badge className={cn(
                          "text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-[1.5rem] border-none shadow-2xl italic font-syne",
                          styles.bg, styles.text
                        )}>
                          <span className="flex items-center gap-3">
                             <div className={cn("h-2 w-2 rounded-full animate-pulse", styles.text.replace('text', 'bg'))} />
                             {activity.activityType.replace(/_/g, ' ')}
                          </span>
                        </Badge>
                        <Button variant="ghost" className="h-16 w-16 rounded-[1.5rem] bg-white border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all shadow-xl hover:scale-110">
                          <ArrowUpRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Global Compliance Footer */}
            <div className="p-16 bg-zinc-950 text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-400">Registry Online</p>
                  </div>
                  <div className="h-6 w-[1px] bg-zinc-800 hidden md:block" />
                  <div className="flex items-center gap-4">
                     <Cpu className="h-4 w-4" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] italic font-syne">Shard 01-Delta: Synchronized</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 relative z-10 px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-300">ISO 27001 Protocol Verified</p>
               </div>
            </div>
          </Card>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
           <Card className="rounded-[3.5rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group col-span-1 lg:col-span-2 min-h-[400px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="absolute -bottom-24 -right-24 h-80 w-80 bg-blue-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                 <div className="space-y-10">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                          <Activity className="h-8 w-8 text-blue-400" />
                       </div>
                       <div className="space-y-1">
                         <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic font-syne text-zinc-400 leading-none">Security Telemetry</h4>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Real-time infrastructure analysis</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-6xl font-syne font-black italic tracking-tighter uppercase leading-[0.85]">Immutable <br /> Governance</p>
                       <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] max-w-sm">System-wide transparency with 100% audit trail compliance.</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-12">
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Audit Yield</p>
                       <p className="text-5xl font-syne font-black text-white italic tracking-tighter">100.0%</p>
                    </div>
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sync Latency</p>
                       <p className="text-5xl font-syne font-black text-emerald-400 italic tracking-tighter">&lt; 1ms</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-[3.5rem] p-12 border-none bg-white shadow-2xl shadow-zinc-200/40 flex flex-col justify-between group min-h-[400px]">
              <div className="flex items-center justify-between">
                 <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 border border-zinc-100">
                    <LockKeyhole className="h-10 w-10 text-zinc-950" />
                 </div>
                 <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-[0.3em] rounded-full px-6 py-3 italic font-syne">Vault-01</Badge>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                   <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Security Architecture</p>
                   <p className="text-3xl font-syne font-black text-zinc-950 uppercase tracking-tighter leading-[0.95] italic">Quantum Ledger Protection <span className="text-emerald-500 italic font-black">v2</span> Enabled</p>
                 </div>
                 <div className="h-1 w-20 bg-zinc-950 rounded-full group-hover:w-full transition-all duration-1000" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
