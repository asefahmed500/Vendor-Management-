'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Shield, Lock, Activity } from 'lucide-react';

export default function VendorSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Principal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-zinc-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Partner Interface</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold tracking-tight text-zinc-950">
              Account Settings
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Manage operational notification preferences and security protocols.
            </p>
          </div>
        </div>
        
        <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
          <Settings className="h-5 w-5 text-zinc-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white group hover:border-zinc-300 transition-all">
            <div className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-lg shadow-zinc-950/20 group-hover:scale-110 transition-transform">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">Communication Prefs</h3>
                  <p className="text-[10px] text-zinc-400 font-medium mt-1">Manage network updates and RFP alerts.</p>
                </div>
              </div>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <CardContent className="p-8">
              <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] space-y-4">
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                  All Proposal and Document validation alerts are automatically pushed to your partner dashboard and email address at this time.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-zinc-200 bg-white px-2 py-0.5">
                    Release Phase: V2.0 (Scheduled)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] overflow-hidden bg-white opacity-90 grayscale-[0.5] hover:grayscale-0 transition-all group">
            <div className="bg-zinc-50/50 border-b border-zinc-100 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-950">Security Hardening</h3>
              </div>
              <Badge variant="outline" className="text-[8px] uppercase border-zinc-200 text-zinc-400">System Managed</Badge>
            </div>
            <CardContent className="p-6">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Password and multi-factor authentication settings are currently synchronized with your primary identity provider.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-zinc-200/50 shadow-sm rounded-[2rem] p-8 space-y-8 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center">
                <Shield className="h-4 w-4 text-zinc-400" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">Trust Center</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Compliance Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">Level 1 Partner</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                Settings are automatically optimized for your partner tier. Contact administration for clearance upgrades.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
