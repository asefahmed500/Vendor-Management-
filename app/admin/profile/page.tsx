'use client';

import { authClient } from '@/lib/auth/auth-client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Shield, 
  Activity, 
  Key, 
  Clock, 
  Smartphone,
  Globe,
  MapPin,
  Fingerprint,
  ShieldCheck,
  Zap,
  Terminal,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  RefreshCcw,
  History,
  ChevronRight,
  ShieldAlert,
  HardDrive,
  Network,
  Waves,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const securityStatus = [
    { label: 'Multi-Factor Auth', status: 'Secure', icon: Smartphone, color: 'blue' },
    { label: 'Session Hardening', status: 'Active', icon: Clock, color: 'emerald' },
    { label: 'Biometric Link', status: 'Hardware', icon: Fingerprint, color: 'zinc' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/30 p-8 lg:p-12 font-dm-sans selection:bg-zinc-950 selection:text-white">
      <div className="max-w-[1400px] mx-auto space-y-20 animate-fade-in">
        
        {/* Profile Architecture Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-zinc-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <span className="hover:text-zinc-950 transition-colors cursor-default">Identity Registry</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-950 italic">Operator Profile</span>
            </nav>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.8] drop-shadow-sm">
                Identity <br /> Manifest
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                Verified operator identity and security clearance parameters. Access tokens are <span className="text-zinc-950 font-bold italic text-blue-600 underline decoration-blue-100 underline-offset-8">Hardware-Bound</span> and rotated every 24 hours.
              </p>
            </div>
          </div>

          <div className="relative group lg:pb-4">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-zinc-950/5 to-emerald-500/10 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-1000" />
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-[3.5rem] bg-zinc-950 flex items-center justify-center text-white shadow-4xl shadow-zinc-900/40 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3 border border-white/10 overflow-hidden">
              <User className="h-20 w-20 sm:h-24 sm:w-24 opacity-20 scale-125" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Fingerprint className="h-16 w-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-500/30 to-transparent" />
              
              {/* Dynamic Overlay Elements */}
              <div className="absolute top-4 right-4 h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-1/2 animate-[progress_3s_infinite]" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-[2rem] bg-white shadow-4xl flex items-center justify-center border border-zinc-100 ring-8 ring-zinc-50/50 scale-90 sm:scale-100">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Core Personnel Data */}
          <div className="lg:col-span-8 space-y-12">
            <Card className="border-none shadow-4xl shadow-zinc-200/50 rounded-[4rem] overflow-hidden bg-white group transition-all relative">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <div className="bg-zinc-50/30 border-b border-zinc-50 px-12 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-[1.75rem] bg-zinc-950 flex items-center justify-center text-white shadow-3xl shadow-zinc-950/20 group-hover:rotate-12 transition-all duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                    <Database className="h-8 w-8 relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-syne font-black italic uppercase tracking-tighter text-zinc-950">Personnel Shard</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em] font-syne italic">SECURE_REGISTRY_OBJECT_ACTIVE</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 backdrop-blur-md rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] font-syne italic self-start sm:self-center shadow-sm">VERIFICATION_STATUS: PASS</Badge>
              </div>
              
              <CardContent className="p-12 lg:p-16 space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6 group/item">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover/item:bg-zinc-950 group-hover/item:text-white transition-all duration-500">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400 font-syne">Operator Identity</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-4xl lg:text-5xl font-syne font-black text-zinc-950 tracking-tighter uppercase italic truncate">
                        {user?.name || 'VMS ADMINISTRATOR'}
                      </p>
                      <div className="h-1 w-20 bg-blue-500 rounded-full group-hover/item:w-40 transition-all duration-700" />
                    </div>
                  </div>
                  
                  <div className="space-y-6 group/item">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover/item:bg-zinc-950 group-hover/item:text-white transition-all duration-500">
                        <Mail className="h-5 w-5" />
                      </div>
                      <p className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400 font-syne">Registry Address</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-4xl lg:text-5xl font-syne font-black text-zinc-950 lowercase tracking-tighter truncate italic">
                        {user?.email || 'ADMIN@VMS.GLOBAL'}
                      </p>
                      <div className="h-1 w-20 bg-emerald-500 rounded-full group-hover/item:w-40 transition-all duration-700" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-zinc-50 w-full relative">
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-white">
                      <Cpu className="h-5 w-5 text-zinc-100" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-zinc-400" />
                      </div>
                      <p className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400 font-syne">Clearance Level</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge className="bg-zinc-950 text-white font-black rounded-[1.25rem] px-8 py-4 text-[12px] uppercase tracking-[0.25em] shadow-3xl shadow-zinc-950/20 italic font-syne" variant="default">
                        L-01 PRINCIPAL
                      </Badge>
                      <div className="h-10 w-10 rounded-full border-2 border-zinc-50 flex items-center justify-center">
                         <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-2xl" />
                        <Activity className="h-5 w-5 text-emerald-600 relative z-10" />
                      </div>
                      <p className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400 font-syne">Active Protocol</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-3xl font-syne font-black text-emerald-600 uppercase italic tracking-tighter">Session_Live</span>
                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mt-1">TELEMETRY_SYNC_ACTIVE</span>
                      </div>
                      <Waves className="h-8 w-8 text-emerald-100 animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hardware-Bound Tokens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {securityStatus.map((pref, i) => (
                <div key={i} className="bg-white border border-zinc-100/60 rounded-[3rem] p-12 space-y-8 hover:shadow-4xl hover:shadow-zinc-200/60 transition-all duration-700 group shadow-sm relative overflow-hidden hover:-translate-y-2">
                  <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-lg",
                    pref.color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-100/50' :
                    pref.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50' :
                    'bg-zinc-950 text-white shadow-zinc-900/20'
                  )}>
                    <pref.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 font-syne italic">{pref.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-syne font-black text-zinc-950 italic uppercase tracking-tighter leading-none">{pref.status}</p>
                      <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 mb-1" />
                    </div>
                  </div>
                  {/* Architectural Underlay */}
                  <div className="absolute -bottom-8 -right-8 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none duration-1000 group-hover:rotate-12 group-hover:scale-150">
                     <pref.icon className="h-32 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intelligence & Telemetry Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-zinc-950 rounded-[4rem] p-12 text-white shadow-4xl shadow-zinc-900/30 relative overflow-hidden group border border-white/5">
              {/* Strategic Backgrounds */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <Fingerprint className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 font-syne italic">Security Signature</h3>
                  </div>
                  <div className="h-1.5 bg-blue-600 w-12 rounded-full group-hover:w-full transition-all duration-1000" />
                </div>
                
                <div className="space-y-8">
                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group/box hover:bg-white/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Terminal className="h-4 w-4 text-zinc-500" />
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-syne italic">Vault_Identifier_Shard</p>
                    </div>
                    <p className="text-sm text-white leading-relaxed truncate font-mono font-bold tracking-tighter bg-zinc-900 p-4 rounded-xl border border-white/5 group-hover/box:border-blue-500/30 transition-colors">
                      {user?.id || 'ROOT_LOCAL_ADMIN_001'}
                    </p>
                  </div>
                  
                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group/box hover:bg-white/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="h-4 w-4 text-zinc-500" />
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-syne italic">Entropy_Seed_Manifest</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-white/5 group-hover/box:border-emerald-500/30 transition-colors">
                       <p className="text-sm text-white font-mono font-bold tracking-tighter truncate">
                        ECDSA_P256_{Math.random().toString(36).substring(7).toUpperCase()}
                      </p>
                      <RefreshCcw className="h-4 w-4 text-emerald-500 animate-spin-slow shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  {['ADMIN', 'OPS', 'TIER_01', 'ROOT'].map(tag => (
                    <span key={tag} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-default font-syne italic">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Card className="border-none shadow-4xl shadow-zinc-200/50 rounded-[4rem] p-12 space-y-12 bg-white group overflow-hidden relative transition-all duration-700 hover:shadow-zinc-300/60">
              {/* Visual Texture */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                 <History className="h-64 w-64 text-zinc-950" />
              </div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="h-16 w-16 rounded-[1.75rem] bg-zinc-950 flex items-center justify-center shadow-3xl shadow-zinc-950/20 group-hover:scale-110 transition-transform duration-700">
                  <History className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-syne font-black uppercase tracking-tighter text-zinc-950 italic">Access Ledger</h3>
                   <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Immutable_Log_Stream</p>
                </div>
              </div>
              
              <div className="space-y-12 relative z-10">
                <div className="relative pl-12 border-l-2 border-zinc-100 space-y-12 group/timeline">
                  <div className="relative group/step">
                    <div className="absolute -left-[57px] top-2 h-5 w-5 rounded-full bg-zinc-950 ring-[12px] ring-white shadow-2xl shadow-zinc-950/20 transition-transform duration-500 group-hover/step:scale-125" />
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 group-hover/step:text-blue-600 transition-colors font-syne italic">Primary Entry Node</p>
                      <p className="text-lg font-syne font-black text-zinc-950 italic uppercase tracking-tighter">SECURE_EDGE_ALPHA</p>
                      <div className="flex items-center gap-3 mt-4">
                         <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-zinc-300" />
                         </div>
                         <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Region: Distributed_Core</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group/step">
                    <div className="absolute -left-[57px] top-2 h-5 w-5 rounded-full bg-zinc-100 ring-[12px] ring-white shadow-sm transition-all duration-500 group-hover/step:scale-125 group-hover/step:bg-emerald-500 group-hover/step:shadow-emerald-500/50" />
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 group-hover/step:text-emerald-600 transition-colors font-syne italic">Manifest Timestamp</p>
                      <p className="text-2xl font-syne font-black text-zinc-950 italic tracking-tighter uppercase">
                        {new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                         <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <RefreshCcw className="h-4 w-4 text-emerald-500 animate-spin-slow" />
                         </div>
                         <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest font-syne">Sync_Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full h-20 rounded-[2rem] bg-zinc-50 border border-zinc-100 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:bg-zinc-950 hover:text-white hover:shadow-4xl hover:shadow-zinc-950/20 transition-all duration-700 flex items-center justify-center gap-6 group/btn font-syne italic">
                  Complete Session Shards
                  <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover/btn:translate-x-3" />
                </button>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-zinc-50 to-transparent pointer-events-none opacity-50" />
              <QrCode className="absolute bottom-10 right-10 h-12 w-12 text-zinc-100" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
