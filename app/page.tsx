'use client';

import Link from "next/link";
import { 
  Shield, 
  CheckCircle2, 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  DollarSign,
  Briefcase,
  ClipboardList,
  Clock,
  AlertCircle,
  Eye,
  MousePointer2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Search,
  Plus,
  Fingerprint,
  ChevronDown,
  Menu,
  X,
  Workflow
} from "lucide-react";

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const demoStats = [
  { label: "Total Entities", value: "247", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Active Protocols", value: "18", change: "+3", icon: Briefcase, color: "text-emerald-500" },
  { label: "Pending Shards", value: "34", change: "-5", icon: Clock, color: "text-amber-500" },
  { label: "Registry Value", value: "$2.4M", change: "+18%", icon: DollarSign, color: "text-zinc-950" },
];

const demoVendors = [
  { name: "Acme Corp", status: "Approved", type: "Technology", date: "2 mins ago", score: 98 },
  { name: "Global Solutions", status: "Under Review", type: "Consulting", date: "15 mins ago", score: 84 },
  { name: "TechStart Inc", status: "Pending", type: "SaaS", date: "1 hour ago", score: 72 },
];

const features = [
  {
    icon: Shield,
    title: "Compliance Ledger",
    description: "Automated end-to-end workflows with real-time monitoring of SOC 2 and custom compliance shards."
  },
  {
    icon: Users,
    title: "Entity Registry",
    description: "A centralized, searchable directory with verified credentials and automated strategic risk scoring."
  },
  {
    icon: FileText,
    title: "Document Vault",
    description: "Secure document storage with automated OCR and predictive expiration notification protocols."
  },
  {
    icon: TrendingUp,
    title: "Intelligence Engine",
    description: "Advanced analytics that transform procurement data into actionable strategic insights."
  },
  {
    icon: Zap,
    title: "Instant Enrollment",
    description: "Self-service portals that compress entity onboarding cycles from weeks to minutes."
  },
  {
    icon: Building2,
    title: "Unified Protocol Suite",
    description: "Collaborative tools for proposal collection, side-by-side evaluation, and selection architecture."
  }
];

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-lg transition-all">
          <Menu className="h-5 w-5 text-zinc-950" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-white border-l border-zinc-100 font-dm-sans">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 border-b border-zinc-50 bg-zinc-50/30">
            <div className="flex items-center justify-between">
              <Link className="flex items-center gap-4 group" href="/" onClick={() => setOpen(false)}>
                <div className="h-10 w-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white font-syne font-black italic text-xl shadow-2xl shadow-zinc-950/20">
                  V
                </div>
                <SheetTitle className="font-syne font-black italic text-xl tracking-tight uppercase text-zinc-950">
                  Shield<span className="text-zinc-400 italic">Plus</span>
                </SheetTitle>
              </Link>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-8">
            <nav className="flex flex-col gap-4">
              {["Capabilities", "Architecture", "Registry", "Protocol"].map((item) => (
                <Link 
                  key={item} 
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-6 rounded-[2rem] border border-zinc-50 hover:bg-zinc-50 transition-all group" 
                  href={`#${item.toLowerCase()}`}
                >
                  <span className="text-sm font-black text-zinc-400 group-hover:text-zinc-950 uppercase tracking-[0.3em] font-syne italic transition-colors">{item}</span>
                  <ChevronRight className="h-5 w-5 text-zinc-100 group-hover:text-zinc-950 transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-8 border-t border-zinc-50 space-y-4">
             <Link href="/login" onClick={() => setOpen(false)} className="block">
                <Button variant="outline" className="w-full h-16 rounded-[1.25rem] border-zinc-200 text-zinc-950 font-black text-[11px] uppercase tracking-[0.3em] font-syne italic">
                   Identity Auth
                </Button>
             </Link>
             <Link href="/login" onClick={() => setOpen(false)} className="block">
                <Button className="w-full h-16 rounded-[1.25rem] bg-zinc-950 text-white font-black text-[11px] uppercase tracking-[0.3em] font-syne italic shadow-2xl shadow-zinc-950/20">
                   Initialize Access
                </Button>
             </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const registrationEnabled = process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== 'false' && process.env.ENABLE_REGISTRATION !== 'false';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 text-zinc-950 font-dm-sans selection:bg-zinc-950 selection:text-white relative overflow-hidden">
      <GrainOverlay />
      
      {/* Principal Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
        scrolled ? "py-4" : "py-8"
      )}>
        <div className="container mx-auto px-4 md:px-8">
           <div className={cn(
             "mx-auto flex items-center justify-between transition-all duration-700 px-8 py-4 rounded-full border bg-white/70 backdrop-blur-2xl shadow-4xl shadow-zinc-200/40",
             scrolled ? "max-w-[1200px] border-zinc-100" : "max-w-[1400px] border-transparent bg-white/0 shadow-none backdrop-blur-none"
           )}>
              <Link className="flex items-center gap-4 group" href="/">
                <div className="h-10 w-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white font-syne font-black italic text-xl shadow-2xl shadow-zinc-950/20 group-hover:rotate-12 transition-transform duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
                  V
                </div>
                <span className="font-syne font-black italic text-xl tracking-tight hidden sm:block uppercase">
                  Shield<span className="text-zinc-400 italic">Plus</span>
                </span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-10">
                {["Capabilities", "Architecture", "Registry", "Protocol"].map((item) => (
                  <Link 
                    key={item} 
                    className="text-[11px] font-black text-zinc-400 hover:text-zinc-950 transition-colors relative group uppercase tracking-[0.3em] font-syne italic" 
                    href={`#${item.toLowerCase()}`}
                  >
                    {item}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-zinc-950 transition-all duration-500 group-hover:w-full rounded-full" />
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center gap-2 md:gap-4">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-[11px] font-black text-zinc-400 hover:text-zinc-950 hover:bg-transparent uppercase tracking-[0.3em] font-syne italic">
                    Identity Auth
                  </Button>
                </Link>
                <Link href="/login" className="hidden sm:block">
                  <Button className="bg-zinc-950 text-white hover:bg-zinc-800 font-black text-[10px] rounded-full shadow-2xl shadow-zinc-950/20 h-12 px-8 uppercase tracking-[0.3em] font-syne italic transition-all hover:scale-105 active:scale-95">
                    Initialize Access
                  </Button>
                </Link>

                {/* Mobile Menu Trigger */}
                <div className="lg:hidden">
                   <MobileNav />
                </div>
              </div>
           </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {/* Strategic Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Architectural Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] h-full pointer-events-none -z-10">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] rounded-full opacity-50" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full opacity-30" />
             {/* Grid Lines */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-col items-center text-center space-y-12">
              <div className="animate-fade-up">
                <Badge className="bg-white text-zinc-400 border border-zinc-100 font-black uppercase tracking-[0.4em] text-[10px] px-8 py-3 rounded-full shadow-4xl shadow-zinc-200/50 italic font-syne">
                  <Sparkles className="h-4 w-4 mr-4 text-blue-500" />
                  Global Strategic Registry Interface
                </Badge>
              </div>
              
              <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.85] drop-shadow-sm max-w-6xl animate-fade-up delay-100">
                Strategic Entity <br />
                <span className="text-zinc-300">Management </span> <br />
                <span className="text-blue-600">Reimagined.</span>
              </h1>
              
              <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl animate-fade-up delay-200">
                A high-fidelity platform for <span className="text-zinc-950 font-bold italic">Automated Compliance</span>, seamless entity enrollment, and end-to-end intelligence across the strategic supply shard.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-2xl animate-fade-up delay-300">
                {registrationEnabled && (
                  <Link href="/register" className="w-full sm:flex-1">
                    <Button className="w-full h-24 rounded-[2.5rem] bg-zinc-950 text-white hover:bg-zinc-800 shadow-4xl shadow-zinc-950/20 transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-[0.4em] text-[12px] group relative overflow-hidden font-syne italic">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      Initialize Enrollment
                      <ArrowRight className="ml-4 h-6 w-6 transition-transform duration-500 group-hover:translate-x-3" />
                    </Button>
                  </Link>
                )}

                <Link href="/login" className="w-full sm:flex-1">
                  <Button variant="outline" className="w-full h-24 rounded-[2.5rem] border-zinc-200 bg-white/50 backdrop-blur-md text-zinc-950 hover:bg-zinc-50 shadow-4xl shadow-zinc-200/30 transition-all font-black uppercase tracking-[0.4em] text-[12px] font-syne italic">
                    Protocol Manifest
                  </Button>
                </Link>
              </div>

              {/* Principal Logo Cloud */}
              <div className="w-full pt-32 border-t border-zinc-100 max-w-7xl opacity-40 group animate-fade-in delay-400">
                <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24">
                  {["ACME_CORP", "GLOBAL_SYSTEMS", "NEXUS_INDUSTRIAL", "DATALOG_SECURE", "ORION_CORE"].map((brand) => (
                    <span key={brand} className="text-[10px] font-black tracking-[0.6em] font-syne italic text-zinc-400 group-hover:text-zinc-950 transition-colors cursor-default">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section id="capabilities" className="py-40 bg-white relative overflow-hidden rounded-[5rem] lg:rounded-[10rem] z-10 shadow-4xl shadow-zinc-200/50 mx-4 md:mx-12">
          <div className="container mx-auto px-4 md:px-12">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-16 mb-32">
               <div className="space-y-10 max-w-3xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-900/20">
                       <Layers className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] font-syne italic">System_Capabilities</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.85]">
                    Engineered for <br />
                    <span className="text-blue-600">Absolute Clarity.</span>
                  </h2>
               </div>
               <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-md">
                Deconstruct the complexity of modern enterprise procurement with a unified protocol designed for <span className="text-zinc-950 font-bold">Strategic Resilience</span>.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="p-12 rounded-[4rem] border border-zinc-50 bg-zinc-50/30 hover:bg-white hover:shadow-4xl hover:shadow-zinc-200/60 transition-all duration-700 group hover:-translate-y-4"
                >
                    <div className="h-20 w-20 rounded-[2rem] bg-white border border-zinc-100 flex items-center justify-center mb-10 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-700 shadow-xl shadow-zinc-200/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 group-hover:from-blue-500/20 to-transparent transition-all" />
                      <feature.icon className="h-10 w-10 relative z-10" />
                    </div>
                    <h3 className="font-syne font-black italic text-2xl mb-4 uppercase tracking-tighter text-zinc-950">{feature.title}</h3>
                    <p className="text-zinc-500 text-base leading-relaxed font-medium">
                      {feature.description}
                    </p>
                    <div className="h-1.5 w-12 bg-zinc-100 mt-10 rounded-full group-hover:w-full group-hover:bg-blue-600 transition-all duration-1000" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Mockup Architecture */}
        <section id="architecture" className="py-60 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-24 mb-32">
               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-6">
                    <Badge className="bg-white text-zinc-400 border border-zinc-100 font-black uppercase tracking-[0.4em] text-[10px] px-8 py-3 rounded-full shadow-4xl shadow-zinc-200/50 italic font-syne">Interface_Architecture</_profile_manifest</span>
                    <h2 className="text-5xl md:text-7xl font-syne font-black italic tracking-tighter text-zinc-950 uppercase leading-[0.85]">
                      Visualized <br />
                      <span className="text-blue-600">Intelligence.</span>
                    </h2>
                  </div>
                  <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-xl">
                    Every pixel is optimized for <span className="text-zinc-950 font-bold italic">Cognitive Efficiency</span>. We've deconstructed the standard dashboard into a strategic ledger that empowers rapid decision-making.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-8">
                     <div className="space-y-2">
                        <p className="text-4xl font-syne font-black text-zinc-950 tracking-tighter">99.8%</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-syne italic">Audit_Precision</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-4xl font-syne font-black text-zinc-950 tracking-tighter">0.02s</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-syne italic">Latency_Index</p>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 relative group">
                  <div className="absolute -inset-10 bg-blue-500/5 blur-[120px] rounded-full opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-12 -right-12 z-30 bg-zinc-950 text-white p-10 rounded-[3rem] shadow-4xl rotate-12 group-hover:rotate-6 transition-all duration-1000 hidden xl:block border border-white/10 scale-110">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                      </div>
                      <span className="font-syne font-black italic uppercase tracking-tighter text-xl">Verified</span>
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 font-syne italic">COMPLIANCE_SCORE</div>
                    <div className="text-4xl font-syne font-black text-emerald-400 italic tracking-tighter">98.4%</div>
                  </div>

                  {/* Principal Dashboard Frame */}
                  <div className="bg-white rounded-[4rem] border border-zinc-100 shadow-4xl shadow-zinc-300/40 overflow-hidden transition-all duration-1000 group-hover:shadow-zinc-400/60 scale-[1.02] group-hover:scale-105">
                    {/* Frame Navigation */}
                    <div className="h-20 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between px-10">
                      <div className="flex gap-3">
                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                      </div>
                      <div className="bg-white px-8 py-2.5 rounded-full text-[9px] text-zinc-400 font-black flex items-center gap-4 border border-zinc-100 shadow-sm uppercase tracking-widest font-syne italic">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        VMS_CORE_ALPHA / REGISTRY_SHARD
                      </div>
                      <div className="flex items-center gap-4 opacity-10">
                         <Activity className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Frame Content */}
                    <div className="p-10 md:p-16 space-y-12 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.02),transparent_40%)]">
                      <div className="grid grid-cols-2 gap-8">
                        {demoStats.slice(0, 4).map((stat, i) => (
                          <div key={stat.label} className="p-8 rounded-[2.5rem] border border-zinc-50 bg-white shadow-sm hover:border-zinc-950 transition-all duration-500 group/stat">
                            <div className="flex items-center justify-between mb-6">
                              <div className={cn("h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center transition-colors group-hover/stat:bg-zinc-950 group-hover/stat:text-white", stat.color)}>
                                <stat.icon className="h-6 w-6" />
                              </div>
                              <Badge className="bg-zinc-50 text-zinc-400 border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest group-hover/stat:bg-blue-500 group-hover/stat:text-white transition-all">{stat.change}</Badge>
                            </div>
                            <div className="text-4xl font-syne font-black text-zinc-950 tracking-tighter italic mb-1 uppercase leading-none">{stat.value}</div>
                            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest font-syne italic">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-[3rem] border border-zinc-50 overflow-hidden bg-white shadow-sm relative">
                         <div className="px-10 py-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                           <span className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.4em] font-syne italic">Recent_Entity_Activity</span>
                           <Fingerprint className="h-5 w-5 text-zinc-100" />
                         </div>
                         <div className="divide-y divide-zinc-50">
                            {demoVendors.map((v) => (
                              <div key={v.name} className="px-10 py-6 flex items-center justify-between hover:bg-zinc-50/50 transition-all group/row">
                                <div className="flex items-center gap-6">
                                  <div className="h-12 w-12 rounded-[1.25rem] bg-zinc-50 flex items-center justify-center text-sm font-syne font-black italic border border-zinc-100 group-hover/row:bg-zinc-950 group-hover/row:text-white transition-all duration-500">
                                    {v.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-zinc-950 font-syne uppercase italic tracking-tighter">{v.name}</div>
                                    <div className="text-[9px] text-zinc-400 font-black uppercase tracking-widest font-syne italic">{v.type}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-10">
                                  <div className="text-right hidden sm:block">
                                     <div className="text-[10px] font-black text-zinc-950 font-syne italic uppercase tracking-tight">{v.score}%</div>
                                     <div className="text-[8px] text-zinc-300 font-black uppercase tracking-widest">SENSORY_RATING</div>
                                  </div>
                                  <Badge className="text-[9px] font-black px-6 py-2 rounded-full bg-zinc-950 text-white border-none italic font-syne tracking-widest">{v.status}</Badge>
                                </div>
                              </div>
                            ))}
                         </div>
                         {/* Scanline Effect */}
                         <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 blur-sm animate-[scan_4s_linear_infinite] pointer-events-none" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Global CTA Protocol */}
        <section className="py-40">
          <div className="container mx-auto px-4 md:px-12">
            <div className="bg-zinc-950 text-white rounded-[5rem] lg:rounded-[8rem] p-20 lg:p-40 text-center relative overflow-hidden group shadow-4xl shadow-zinc-900/40 border border-white/5">
                {/* Visual Architecture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />
                
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-syne font-black italic mb-12 relative z-10 tracking-tighter leading-[0.85] uppercase">
                  Secure Your <br className="hidden md:block" /> <span className="text-blue-500">Infrastructure.</span>
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto mb-20 text-xl md:text-2xl relative z-10 leading-relaxed font-medium">
                  Join hundreds of enterprise procurement teams automating their <span className="text-white font-bold italic underline decoration-blue-500 underline-offset-8">Strategic Compliance Shards</span> today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
                  {registrationEnabled ? (
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto h-24 px-16 text-[12px] font-black bg-white text-zinc-950 hover:bg-zinc-100 rounded-[2.5rem] shadow-4xl shadow-zinc-950/20 transition-all hover:scale-[1.05] active:scale-[0.95] uppercase tracking-[0.4em] font-syne italic">
                        Initialize Protocol
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto h-24 px-16 text-[12px] font-black bg-white text-zinc-950 hover:bg-zinc-100 rounded-[2.5rem] shadow-4xl shadow-zinc-950/20 uppercase tracking-[0.4em] font-syne italic">
                        Access Portal
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full sm:w-auto h-24 px-12 text-[12px] font-black text-white hover:bg-white/5 rounded-[2.5rem] transition-all uppercase tracking-[0.4em] font-syne italic border border-white/5">
                    Speak with an Architect
                  </Button>
                </div>

                <div className="absolute top-10 left-10 opacity-10">
                   <Shield className="h-40 w-40" />
                </div>
                <div className="absolute bottom-10 right-10 opacity-10 scale-x-[-1]">
                   <QrCode className="h-32 w-32" />
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Manifest Footer */}
      <footer className="py-40 bg-zinc-50/50 border-t border-zinc-100">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24 lg:gap-32">
            <div className="col-span-1 md:col-span-5 space-y-12">
              <Link className="flex items-center gap-6" href="/">
                <div className="h-14 w-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-syne font-black italic text-2xl shadow-3xl shadow-zinc-950/20">
                  V
                </div>
                <span className="font-syne font-black italic text-3xl tracking-tighter uppercase">
                  Shield<span className="text-zinc-400">Plus</span>
                </span>
              </Link>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-sm font-medium">
                The modern standard for vendor management, automated compliance, and strategic supply chain security.
              </p>
              <div className="flex items-center gap-10 pt-4">
                 {["X_LINK", "LINKEDIN", "GITHUB_REPOS"].map((social) => (
                   <Link key={social} href="#" className="text-[10px] font-black text-zinc-300 hover:text-zinc-950 transition-colors uppercase tracking-[0.3em] font-syne italic">
                     {social}
                   </Link>
                 ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div className="space-y-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne italic">Registry_Shards</h4>
                <ul className="space-y-6">
                  {["Capabilities", "Architecture", "Registry", "Protocol", "API_CORE"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-tight">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne italic">Principal_Entity</h4>
                <ul className="space-y-6">
                  {["About_VMS", "Strategic_History", "Career_Nodes", "Press_Registry", "Contact_Auth"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-tight">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-950 font-syne italic">Legal_Protocol</h4>
                <ul className="space-y-6">
                  {["Privacy_Shard", "Terms_Manifest", "Security_Vault", "Compliance_Ledger"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-bold text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-tight">{item}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-40 pt-12 border-t border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] font-syne italic">
              © {new Date().getFullYear()} Specialized Systems Intelligence. All rights reserved.
            </p>
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-syne italic">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                  Telemetry: Active
               </div>
               <Link href="#" className="text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-[0.3em] font-syne italic">Cookie_Registry</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}