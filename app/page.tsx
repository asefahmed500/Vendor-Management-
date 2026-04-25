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
  Workflow,
  QrCode,
  Box,
  Binary,
  Compass
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
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f4ed] text-[#1c1c1c] font-sans selection:bg-[#1c1c1c]/10 selection:text-inherit relative overflow-hidden">
      <GrainOverlay />
      
      {/* Editorial Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        scrolled ? "bg-[#f7f4ed]/80 backdrop-blur-md border-b border-[#eceae4] py-4" : "py-8"
      )}>
        <div className="container mx-auto px-6 md:px-12">
           <div className="flex items-center justify-between">
              <Link className="flex items-center gap-3 group" href="/">
                <div className="h-9 w-9 bg-[#1c1c1c] rounded-md flex items-center justify-center text-[#fcfbf8] font-heading font-semibold text-lg shadow-lovable-inset group-hover:rotate-3 transition-transform duration-500">
                  V
                </div>
                <span className="font-heading font-semibold text-xl tracking-tight text-[#1c1c1c]">
                  ShieldPlus
                </span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-10">
                {["Capabilities", "Architecture", "Registry", "Protocol"].map((item) => (
                  <Link 
                    key={item} 
                    className="text-sm font-normal text-[rgba(28,28,28,0.83)] hover:text-[#1c1c1c] transition-colors relative group" 
                    href={`#${item.toLowerCase()}`}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-sm font-normal text-[rgba(28,28,28,0.83)] hover:text-[#1c1c1c]">
                    Log In
                  </Button>
                </Link>
                <Link href="/login" className="hidden sm:block">
                  <Button className="rounded-md px-6">
                    Start Building
                  </Button>
                </Link>

                <div className="lg:hidden">
                   <MobileNav />
                </div>
              </div>
           </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {/* Editorial Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20">
          {/* Subtle Atmospheric Wash */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
             <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
             <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full opacity-50" />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Badge variant="secondary" className="px-4 py-1.5 text-[11px] font-normal border-[#eceae4] text-[#5f5f5d]">
                  <Sparkles className="h-3 w-3 mr-2 text-orange-400" />
                  Unified Strategic Registry v4.0
                </Badge>
              </div>
              
              <h1 className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Strategic Entity Hub <br className="hidden lg:block" />
                <span className="text-[rgba(28,28,28,0.4)]">Completely Unified.</span>
              </h1>
              
              <p className="text-[rgba(28,28,28,0.82)] text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                The high-fidelity protocol for automated compliance, seamless entity enrollment, and end-to-end intelligence shards.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
                {registrationEnabled && (
                  <Link href="/register" className="w-full sm:flex-1">
                    <Button size="lg" className="w-full h-14 rounded-md text-base">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Link href="/login" className="w-full sm:flex-1">
                  <Button variant="outline" size="lg" className="w-full h-14 rounded-md text-base">
                    Documentation
                  </Button>
                </Link>
              </div>

              {/* Minimal Logo Cloud */}
              <div className="w-full pt-32 max-w-5xl opacity-40 animate-in fade-in duration-1000 delay-1000">
                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
                  {["Acme Systems", "Global Corp", "Nexus Mod", "Data Core", "Orion Shard"].map((brand) => (
                    <span key={brand} className="text-sm font-normal text-[#1c1c1c] tracking-tight">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section id="capabilities" className="py-40 bg-[#f7f4ed]">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
               <div className="space-y-6 max-w-3xl">
                  <Badge variant="secondary" className="px-3 py-1 text-[10px] font-normal border-[#eceae4]">
                    System Core Capabilities Alpha
                  </Badge>
                  <h2 className="text-5xl md:text-7xl font-semibold text-[#1c1c1c] tracking-tight leading-[1.1]">
                    Engineered for <br />
                    <span className="text-[rgba(28,28,28,0.4)]">Absolute Registry.</span>
                  </h2>
               </div>
               <p className="text-[rgba(28,28,28,0.82)] text-lg md:text-xl font-normal leading-relaxed max-w-sm mb-2">
                Deconstruct the complexity of modern enterprise procurement with a unified protocol designed for strategic resilience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="p-10 rounded-lg border border-[#eceae4] bg-[#f7f4ed] hover:bg-[#eceae4]/30 transition-all duration-300 group"
                >
                    <div className="h-12 w-12 rounded-md bg-[#1c1c1c] flex items-center justify-center mb-8 shadow-lovable-inset">
                      <feature.icon className="h-5 w-5 text-[#fcfbf8]" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-[#1c1c1c] tracking-tight">{feature.title}</h3>
                    <p className="text-[#5f5f5d] text-base leading-relaxed font-normal mb-8">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300 cursor-pointer">
                       <span className="text-xs font-normal text-[#1c1c1c]">Learn more</span>
                       <ArrowRight className="h-4 w-4 text-[#1c1c1c]" />
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Mockup Architecture */}
        <section id="architecture" className="py-40 border-t border-[#eceae4]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2 space-y-10">
                  <div className="space-y-6">
                    <Badge variant="secondary" className="px-3 py-1 text-[10px] font-normal border-[#eceae4]">
                      Interface Architecture
                    </Badge>
                    <h2 className="text-5xl md:text-7xl font-semibold text-[#1c1c1c] tracking-tight leading-[1.1]">
                      Visualized <br />
                      <span className="text-[rgba(28,28,28,0.4)]">Intelligence.</span>
                    </h2>
                  </div>
                  <p className="text-[rgba(28,28,28,0.82)] text-lg font-normal leading-relaxed max-w-xl">
                    Every pixel is optimized for cognitive efficiency. We've deconstructed the standard dashboard into a strategic ledger that empowers rapid decision-making.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-6">
                     <div className="space-y-1">
                        <p className="text-3xl font-semibold text-[#1c1c1c] tracking-tighter">99.8%</p>
                        <p className="text-[10px] font-normal text-[#5f5f5d] uppercase tracking-widest">Audit Precision</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-3xl font-semibold text-[#1c1c1c] tracking-tighter">0.02s</p>
                        <p className="text-[10px] font-normal text-[#5f5f5d] uppercase tracking-widest">Latency Index</p>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 w-full">
                  <div className="bg-[#f7f4ed] rounded-xl border border-[#eceae4] shadow-lovable-focus overflow-hidden">
                    <div className="h-14 border-b border-[#eceae4] bg-[#fcfbf8] flex items-center justify-between px-6">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#eceae4]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#eceae4]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#eceae4]" />
                      </div>
                      <div className="px-4 py-1.5 rounded-md text-[10px] text-[#5f5f5d] font-normal flex items-center gap-3 border border-[#eceae4] bg-[#f7f4ed] uppercase tracking-widest">
                        <Lock className="h-3 w-3 text-emerald-600/60" />
                        VMS Registry Shard
                      </div>
                      <div className="flex items-center gap-4 opacity-20">
                         <Activity className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        {demoStats.slice(0, 4).map((stat) => (
                          <div key={stat.label} className="p-6 rounded-lg border border-[#eceae4] bg-[#fcfbf8]">
                            <div className="flex items-center justify-between mb-4">
                              <div className="h-9 w-9 rounded-md bg-[#1c1c1c] flex items-center justify-center shadow-lovable-inset">
                                <stat.icon className="h-4 w-4 text-[#fcfbf8]" />
                              </div>
                              <Badge className="bg-[#f7f4ed] text-[#5f5f5d] border-[#eceae4] text-[9px]">{stat.change}</Badge>
                            </div>
                            <div className="text-2xl font-semibold text-[#1c1c1c] tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-normal text-[#5f5f5d] uppercase tracking-widest">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-[#eceae4] overflow-hidden bg-[#fcfbf8]">
                         <div className="px-6 py-4 border-b border-[#eceae4] flex items-center justify-between bg-[#f7f4ed]/30">
                           <span className="text-[10px] font-normal text-[#1c1c1c] uppercase tracking-widest">Recent Entity Activity</span>
                           <Fingerprint className="h-4 w-4 text-[#eceae4]" />
                         </div>
                         <div className="divide-y divide-[#eceae4]">
                            {demoVendors.map((v) => (
                              <div key={v.name} className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f4ed]/50 transition-all group/row">
                                <div className="flex items-center gap-4">
                                  <div className="h-9 w-9 rounded-md bg-[#f7f4ed] border border-[#eceae4] flex items-center justify-center text-xs font-semibold text-[#1c1c1c]">
                                    {v.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-[#1c1c1c]">{v.name}</div>
                                    <div className="text-[10px] text-[#5f5f5d] font-normal uppercase tracking-widest">{v.type}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="text-right hidden sm:block">
                                     <div className="text-xs font-semibold text-[#1c1c1c]">{v.score}%</div>
                                     <div className="text-[8px] text-[#5f5f5d] font-normal uppercase tracking-widest">Rating</div>
                                  </div>
                                  <Badge variant="outline" className="text-[9px] px-3 py-0.5">{v.status}</Badge>
                                </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Global CTA Protocol */}
        <section className="py-40 bg-[#1c1c1c] text-[#fcfbf8] overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 text-center relative">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <Badge variant="outline" className="px-3 py-1 text-[10px] font-normal border-white/10 text-white/60">
                  Global Deployment Portal
                </Badge>
                <h2 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[1.05]">
                  Secure Your <br /> 
                  <span className="text-white/40">Infrastructure.</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl font-normal leading-relaxed">
                  Join hundreds of enterprise procurement teams automating their strategic compliance shards with the ShieldPlus registry.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  {registrationEnabled ? (
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-sm font-normal rounded-md bg-[#fcfbf8] text-[#1c1c1c] hover:bg-[#fcfbf8]/90 shadow-lovable-inset">
                        Initialize Protocol
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-sm font-normal rounded-md bg-[#fcfbf8] text-[#1c1c1c] hover:bg-[#fcfbf8]/90 shadow-lovable-inset">
                        Access Portal
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-sm font-normal rounded-md border-white/10 text-white hover:bg-white/5">
                    Speak with an Architect
                  </Button>
                </div>
            </div>
            
            {/* Minimalist Background Detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
               <Shield className="w-full h-full stroke-[0.5px]" />
            </div>
          </div>
        </section>
      </main>

      {/* Manifest Footer */}
      <footer className="py-32 bg-[#f7f4ed] border-t border-[#eceae4]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
            <div className="col-span-1 md:col-span-5 space-y-8">
              <Link className="flex items-center gap-4" href="/">
                <div className="h-10 w-10 bg-[#1c1c1c] rounded-md flex items-center justify-center text-[#fcfbf8] font-semibold text-xl shadow-lovable-inset">
                  V
                </div>
                <span className="font-semibold text-2xl tracking-tight text-[#1c1c1c]">
                  ShieldPlus
                </span>
              </Link>
              <p className="text-base text-[#5f5f5d] leading-relaxed max-w-sm font-normal">
                The modern standard for vendor management, automated compliance, and strategic supply chain security.
              </p>
              <div className="flex items-center gap-6 pt-2">
                 {["X", "LinkedIn", "GitHub"].map((social) => (
                   <Link key={social} href="#" className="text-xs font-normal text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors">
                     {social}
                   </Link>
                 ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-normal uppercase tracking-widest text-[#1c1c1c]">Ecosystem</h4>
                <ul className="space-y-4">
                  {["Capabilities", "Architecture", "Registry", "Protocol"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-normal text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-normal uppercase tracking-widest text-[#1c1c1c]">Company</h4>
                <ul className="space-y-4">
                  {["About", "History", "Careers", "Press"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-normal text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-normal uppercase tracking-widest text-[#1c1c1c]">Governance</h4>
                <ul className="space-y-4">
                  {["Privacy", "Terms", "Security", "Compliance"].map(item => (
                    <li key={item}><Link href="#" className="text-sm font-normal text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-[#eceae4] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <p className="text-xs font-normal text-[#5f5f5d]">
              © {new Date().getFullYear()} Specialized Systems Intelligence.
            </p>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-[10px] font-normal text-[#5f5f5d] uppercase tracking-widest">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Telemetry: Active
               </div>
               <Link href="#" className="text-[10px] font-normal text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors uppercase tracking-widest">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
}