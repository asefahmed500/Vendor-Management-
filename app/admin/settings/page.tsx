'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Cpu,
  Activity,
  Lock,
  Zap,
  Globe,
  Server,
  Cloud,
  Layers,
  History,
  ShieldAlert,
  ArrowUpRight,
  ChevronLeft,
  RefreshCw,
  Terminal,
  Fingerprint,
  Network,
  Binary,
  Code,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-20 animate-fade-in">
        
        {/* Principal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-zinc-950 transition-colors">Admin Core</Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="text-zinc-950 italic">System Manifest</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                System <br /> Settings
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Configure global operational parameters and infrastructure preferences. Maintain alignment with <span className="text-zinc-950 font-bold italic text-blue-600 underline decoration-blue-100 underline-offset-8">Corporate Security Protocols</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:pb-4">
            <div className="h-20 px-10 rounded-[2.5rem] bg-white border border-zinc-100 flex items-center gap-6 shadow-2xl shadow-zinc-200/40 backdrop-blur-md">
              <div className="h-12 w-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-950/20">
                <Fingerprint className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">Auth Level 04</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic font-syne">Super_Admin_Prime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Main Configuration Stream */}
          <div className="xl:col-span-8 space-y-10">
            
            {/* Telemetry Section */}
            <Card className="border-none shadow-3xl shadow-zinc-200/60 rounded-[4rem] overflow-hidden bg-white group transition-all duration-700 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="bg-zinc-50/50 border-b border-zinc-50 px-12 py-10 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="h-20 w-20 rounded-[2rem] bg-zinc-950 flex items-center justify-center text-white shadow-2xl shadow-zinc-950/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
                    <Bell className="h-8 w-8 relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-syne font-black italic uppercase tracking-tighter text-zinc-950">Telemetry Streams</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em] font-syne italic">Active_Signal_Bus_Linked</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-[0.3em] rounded-full px-6 py-2 italic font-syne shadow-sm">NOMINAL</Badge>
                   <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
                </div>
              </div>

              <CardContent className="p-12 space-y-10">
                <div className="p-12 bg-zinc-50/50 rounded-[3rem] space-y-8 relative overflow-hidden group/box hover:bg-white transition-all duration-700 border border-transparent hover:border-zinc-100 hover:shadow-3xl hover:shadow-zinc-200/40">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-4">
                       <p className="text-xl text-zinc-600 leading-relaxed font-medium max-w-xl">
                        Real-time alerting for proposal lifecycles and compliance audits are currently routed via the <span className="text-zinc-950 font-black italic underline decoration-zinc-200 underline-offset-8">VMS_SIGNAL_CORE</span>.
                      </p>
                    </div>
                    <Zap className="h-12 w-12 text-zinc-100 group-hover/box:text-blue-200 transition-all duration-700 group-hover/box:scale-110 group-hover/box:rotate-12" />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 relative z-10 pt-4">
                    <div className="flex items-center gap-4 bg-zinc-950 text-white px-8 py-3 rounded-2xl shadow-2xl shadow-zinc-950/20">
                       <Binary className="h-4 w-4 text-blue-400" />
                       <span className="text-[11px] font-black uppercase tracking-[0.3em]">VERSION: V1.4.0_STABLE</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-zinc-100 text-zinc-400 px-8 py-3 rounded-2xl shadow-sm italic font-syne">
                       <Clock className="h-4 w-4" />
                       <span className="text-[11px] font-black uppercase tracking-[0.3em]">NEXT_SYNC: 04:00_UTC</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button className="h-24 rounded-[2rem] bg-white border border-zinc-100 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-zinc-950 hover:shadow-2xl hover:border-zinc-200 transition-all group/btn">
                      <Settings className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                      Configure Bus
                   </button>
                   <button className="h-24 rounded-[2rem] bg-zinc-950 text-white flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-zinc-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn">
                      <RefreshCw className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-1000" />
                      Initialize Restart
                   </button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Security Protocol */}
              <Card className="border-none shadow-3xl shadow-zinc-200/60 rounded-[4rem] overflow-hidden bg-white hover:shadow-4xl transition-all duration-700 group relative">
                <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-1000">
                   <Shield className="h-64 w-64 text-zinc-950" />
                </div>
                <div className="bg-zinc-50/50 border-b border-zinc-50 px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
                      <Lock className="h-6 w-6 relative z-10" />
                    </div>
                    <h3 className="text-lg font-syne font-black italic uppercase tracking-tighter text-zinc-950">Access Guard</h3>
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 border-none rounded-full px-4 py-2 text-[8px] font-black uppercase tracking-widest italic font-syne">RESTRICTED_ZONE</Badge>
                </div>
                <CardContent className="p-10 space-y-10">
                  <p className="text-base text-zinc-500 leading-relaxed font-medium">
                    Authentication and RBAC enforcement layers are managed via <span className="text-zinc-950 font-bold italic text-blue-600">Better Auth x JWT</span> protocols.
                  </p>
                  <div className="pt-2 border-t border-zinc-50">
                    <button className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3 group/btn italic font-syne">
                      SECURITY_AUDIT_LOGS
                      <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all duration-500">
                         <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Registry */}
              <Card className="border-none shadow-3xl shadow-zinc-200/60 rounded-[4rem] overflow-hidden bg-white hover:shadow-4xl transition-all duration-700 group relative">
                <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-1000">
                   <Database className="h-64 w-64 text-zinc-950" />
                </div>
                <div className="bg-zinc-50/50 border-b border-zinc-50 px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
                      <Database className="h-6 w-6 relative z-10" />
                    </div>
                    <h3 className="text-lg font-syne font-black italic uppercase tracking-tighter text-zinc-950">Data Matrix</h3>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 py-2 text-[8px] font-black uppercase tracking-widest italic font-syne">INTEGRITY_SAFE</Badge>
                </div>
                <CardContent className="p-10 space-y-10">
                  <p className="text-base text-zinc-500 leading-relaxed font-medium">
                    Registry integrity and backup cycles are handled by the <span className="text-zinc-950 font-bold italic text-emerald-600">Global Cloud Grid</span> infrastructure.
                  </p>
                  <div className="pt-2 border-t border-zinc-50">
                    <button className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3 group/btn italic font-syne">
                      SYSTEM_HEALTH_REPORT
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all duration-500">
                         <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Infrastructure Sidebar */}
          <div className="xl:col-span-4 space-y-10">
            <Card className="border-none shadow-3xl shadow-zinc-200/60 rounded-[4rem] p-12 space-y-12 bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Cpu className="h-64 w-64 text-zinc-950" />
              </div>
              
              <div className="space-y-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-900/20 group-hover:rotate-12 transition-transform duration-700">
                    <Layers className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne italic">Operational Core</h3>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-4 group/item">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-black flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-zinc-50 flex items-center justify-center">
                        <Server className="h-3 w-3 text-zinc-400" />
                      </div>
                      App Architecture
                    </p>
                    <p className="text-xl font-syne font-black text-zinc-950 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">VMS.CORE_PRIME_25.1</p>
                  </div>
                  
                  <div className="space-y-4 group/item">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-black flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-zinc-50 flex items-center justify-center">
                        <Globe className="h-3 w-3 text-zinc-400" />
                      </div>
                      Environment Segment
                    </p>
                    <div className="flex items-center gap-4">
                       <p className="text-xl font-syne font-black text-emerald-600 group-hover:scale-105 transition-all origin-left uppercase italic tracking-tighter underline decoration-emerald-100 underline-offset-8">PROD_SECURE_STABLE</p>
                       <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-4 group/item">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-black flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-zinc-50 flex items-center justify-center">
                        <Network className="h-3 w-3 text-zinc-400" />
                      </div>
                      System Velocity
                    </p>
                    <p className="text-xl font-syne font-black text-zinc-950 group-hover:text-emerald-500 transition-colors uppercase italic tracking-tighter">99.98% / 365D Uptime</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-50 relative z-10">
                 <div className="flex items-center gap-4 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 group-hover:bg-white transition-all duration-700">
                    <Terminal className="h-6 w-6 text-zinc-300" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Kernel Build</span>
                       <span className="text-[10px] font-mono text-zinc-400">#4A2B-9C01-FEDX</span>
                    </div>
                 </div>
              </div>
            </Card>

            <Card className="rounded-[4rem] p-12 border-none bg-zinc-950 text-white shadow-3xl shadow-zinc-950/40 relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-1000" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="h-6 w-6 text-blue-500" />
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400 font-syne italic">Manifest Directive</h4>
                </div>
                <div className="h-1.5 w-16 bg-blue-500 rounded-full group-hover:w-32 transition-all duration-1000" />
              </div>
              
              <div className="space-y-10 relative z-10">
                 <p className="text-2xl font-syne font-black italic tracking-tighter text-zinc-400 leading-tight group-hover:text-white transition-colors">
                  &quot;Global configuration changes require <span className="text-white underline decoration-white/20 underline-offset-8">Level 02 Authentication</span>. All manifest overrides are logged in the immutable audit registry.&quot;
                </p>
                
                <div className="pt-6">
                  <Button className="w-full h-20 rounded-[2rem] bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-zinc-950 transition-all duration-700 backdrop-blur-xl group/btn overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                       <Code className="h-4 w-4" />
                       Architecture Support
                    </span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
