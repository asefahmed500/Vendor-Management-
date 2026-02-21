'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data for preview
const mockStats = [
  { label: 'Total Vendors', value: '247', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'Pending Review', value: '18', change: '+3', icon: Clock, color: 'text-amber-600' },
  { label: 'Verified', value: '89%', change: '+5%', icon: CheckCircle, color: 'text-emerald-600' },
  { label: 'Compliance Rate', value: '94%', change: '+2%', icon: TrendingUp, color: 'text-indigo-600' },
];

const mockVendors = [
  { name: 'Acme Corp', status: 'APPROVED', documents: 12, joined: '2 days ago' },
  { name: 'TechSolutions Inc', status: 'UNDER_REVIEW', documents: 8, joined: '5 days ago' },
  { name: 'Global Logistics', status: 'PENDING', documents: 3, joined: '1 week ago' },
  { name: 'Prime Services', status: 'APPROVED', documents: 15, joined: '2 weeks ago' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  APPROVED: 'success',
  UNDER_REVIEW: 'warning',
  PENDING: 'default',
};

export function AdminDashboardPreview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors'>('overview');
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Simulate loading animations
  useEffect(() => {
    const intervals = [0, 1, 2, 3].map((i) =>
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [i]: true }));
      }, 100 + i * 150)
    );
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <Card className="overflow-hidden border-2 shadow-2xl rounded-3xl bg-background">
      {/* Simulated Header */}
      <header className="bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Admin Dashboard</div>
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">VMS PRO</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[10px] text-zinc-500 font-medium">LIVE PREVIEW</div>
        </div>
      </header>

      {/* Simulated Tabs */}
      <div className="flex border-b bg-muted/30 px-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'vendors'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Vendors
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 border-transparent text-muted-foreground hover:text-foreground`}
        >
          Documents
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockStats.map((stat, i) => (
            <div key={i} className="relative">
              {!loadingStates[i] ? (
                <div className="h-24 bg-muted/50 rounded-xl animate-pulse" />
              ) : (
                <Card className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{stat.change} this month</div>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Vendor List Preview */}
        {activeTab === 'overview' && (
          <Card className="bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-bold text-sm">Recent Registrations</h3>
            </div>
            <div className="divide-y">
              {mockVendors.map((vendor, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{vendor.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{vendor.name}</div>
                      <div className="text-[10px] text-muted-foreground">{vendor.joined}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[vendor.status]} className="text-[10px] px-2 py-0.5">
                      {vendor.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Activity Feed */}
        {activeTab === 'vendors' && (
          <Card className="bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-bold text-sm">Activity Feed</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { action: 'New vendor registered', time: '2 minutes ago', type: 'info' },
                { action: 'Document approved for Acme Corp', time: '15 minutes ago', type: 'success' },
                { action: 'Compliance alert: TechSolutions Inc', time: '1 hour ago', type: 'warning' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="flex-1">{activity.action}</span>
                  <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}
