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
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const demoStats = [
  { label: "Total Entities", value: "247", change: "+12%", icon: Users, color: "text-notion-blue" },
  { label: "Active Protocols", value: "18", change: "+3", icon: Briefcase, color: "text-semantic-green" },
  { label: "Pending Shards", value: "34", change: "-5", icon: Clock, color: "text-semantic-orange" },
  { label: "Registry Value", value: "$2.4M", change: "+18%", icon: DollarSign, color: "text-notion-black" },
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
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-micro bg-warm-white border-notion-whisper hover:bg-notion-white hover:shadow-notion-card transition-all">
          <Menu className="h-5 w-5 text-notion-black" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-notion-white border-l-notion-whisper font-sans">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 border-b-notion-whisper bg-warm-white/30">
            <div className="flex items-center justify-between">
              <Link className="flex items-center gap-4 group" href="/" onClick={() => setOpen(false)}>
                <div className="h-10 w-10 bg-notion-black rounded-comfortable flex items-center justify-center text-notion-white font-bold text-lg shadow-notion-card">
                  V
                </div>
                <SheetTitle className="font-bold text-xl tracking-tight text-notion-black">
                  VMS
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
                  className="flex items-center justify-between p-6 rounded-pill border-notion-whisper hover:bg-warm-white transition-all group"
                  href={`#${item.toLowerCase()}`}
                >
                  <span className="text-body-medium text-warm-gray-500 group-hover:text-notion-black transition-colors">{item}</span>
                  <ChevronRight className="h-5 w-5 text-warm-gray-300 group-hover:text-notion-black transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-8 border-t-notion-whisper space-y-4">
            <Link href="/login" onClick={() => setOpen(false)} className="block">
              <Button variant="outline" className="w-full h-16 rounded-comfortable border-notion-whisper text-notion-black text-body-medium">
                Log In
              </Button>
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="block">
              <Button className="w-full h-16 rounded-comfortable bg-notion-blue text-notion-white text-body-medium shadow-notion-card">
                Get Started
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
    <div className="flex flex-col min-h-screen bg-notion-white text-notion-black font-sans selection:bg-notion-badge-blue-bg selection:text-inherit relative overflow-hidden">

      {/* Notion-style Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-200",
        scrolled ? "bg-notion-white/90 backdrop-blur-md border-b-notion-whisper py-4" : "py-8"
      )}>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-3 group" href="/">
              <div className="h-9 w-9 bg-notion-black rounded-micro flex items-center justify-center text-notion-white font-bold text-lg shadow-notion-card group-hover:rotate-3 transition-transform duration-200">
                V
              </div>
              <span className="font-bold text-xl tracking-tight text-notion-black">
                VMS
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {["Capabilities", "Architecture", "Registry", "Protocol"].map((item) => (
                <Link
                  key={item}
                  className="text-nav text-warm-gray-500 hover:text-notion-black transition-colors relative group"
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="text-nav text-warm-gray-500 hover:text-notion-black">
                  Log In
                </Button>
              </Link>
              <Link href="/login" className="hidden sm:block">
                <Button className="rounded-micro px-6 bg-notion-blue text-notion-white hover:bg-notion-active-blue">
                  Get Started
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
        {/* Notion-style Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-12 animate-fade-up">
                <Badge className="badge-notion-pill">
                  <Sparkles className="h-3 w-3 mr-2 text-notion-blue" />
                  Vendor Management System
                </Badge>
              </div>

              <h1 className="mb-10 text-display-hero animate-fade-up delay-100">
                Strategic Entity Hub <br className="hidden lg:block" />
                <span className="text-warm-gray-300">Completely Unified.</span>
              </h1>

              <p className="text-body-large text-warm-gray-500 leading-relaxed max-w-2xl mb-16 animate-fade-up delay-200">
                The high-fidelity protocol for automated compliance, seamless entity enrollment, and end-to-end intelligence shards.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md animate-fade-up delay-300">
                {registrationEnabled && (
                  <Link href="/register" className="w-full sm:flex-1">
                    <Button size="lg" className="w-full h-14 rounded-micro text-body bg-notion-blue text-notion-white hover:bg-notion-active-blue">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Link href="/login" className="w-full sm:flex-1">
                  <Button variant="outline" size="lg" className="w-full h-14 rounded-micro text-body border-notion-whisper">
                    Documentation
                  </Button>
                </Link>
              </div>

              {/* Minimal Logo Cloud */}
              <div className="w-full pt-32 max-w-5xl opacity-40 animate-fade-up delay-400">
                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
                  {["Acme Systems", "Global Corp", "Nexus Mod", "Data Core", "Orion Shard"].map((brand) => (
                    <span key={brand} className="text-body text-notion-black tracking-tight">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section id="capabilities" className="py-40 bg-notion-white">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
              <div className="space-y-6 max-w-3xl">
                <Badge className="badge-notion-pill">
                  System Core Capabilities
                </Badge>
                <h2 className="text-section-heading text-notion-black">
                  Engineered for <br />
                  <span className="text-warm-gray-300">Absolute Registry.</span>
                </h2>
              </div>
              <p className="text-body-large text-warm-gray-500 leading-relaxed max-w-sm mb-2">
                Deconstruct the complexity of modern enterprise procurement with a unified protocol designed for strategic resilience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="card-notion p-10 hover:shadow-notion-deep transition-all duration-200 group"
                >
                  <div className="h-12 w-12 rounded-micro bg-notion-black flex items-center justify-center mb-8 shadow-notion-card">
                    <feature.icon className="h-5 w-5 text-notion-white" />
                  </div>
                  <h3 className="text-card-title mb-4 text-notion-black">{feature.title}</h3>
                  <p className="text-body text-warm-gray-500 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-200 cursor-pointer">
                    <span className="text-micro text-notion-black">Learn more</span>
                    <ArrowRight className="h-4 w-4 text-notion-black" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Mockup Architecture */}
        <section id="architecture" className="py-40 border-t-notion-whisper">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <div className="space-y-6">
                  <Badge className="badge-notion-pill">
                    Interface Architecture
                  </Badge>
                  <h2 className="text-section-heading text-notion-black">
                    Visualized <br />
                    <span className="text-warm-gray-300">Intelligence.</span>
                  </h2>
                </div>
                <p className="text-body text-warm-gray-500 leading-relaxed max-w-xl">
                  Every pixel is optimized for cognitive efficiency. We've deconstructed the standard dashboard into a strategic ledger that empowers rapid decision-making.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div className="space-y-1">
                    <p className="text-sub-heading-large text-notion-black">99.8%</p>
                    <p className="text-micro uppercase">Audit Precision</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sub-heading-large text-notion-black">0.02s</p>
                    <p className="text-micro uppercase">Latency Index</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="card-notion-featured overflow-hidden">
                  <div className="h-14 border-b-notion-whisper bg-warm-white flex items-center justify-between px-6">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-warm-gray-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-warm-gray-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-warm-gray-300" />
                    </div>
                    <div className="badge-notion-pill flex items-center gap-3">
                      <Lock className="h-3 w-3 text-semantic-green" />
                      VMS Registry Shard
                    </div>
                    <div className="flex items-center gap-4 opacity-20">
                      <Activity className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      {demoStats.slice(0, 4).map((stat) => (
                        <div key={stat.label} className="p-6 rounded-comfortable border-notion-whisper bg-warm-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="h-9 w-9 rounded-micro bg-notion-black flex items-center justify-center shadow-notion-card">
                              <stat.icon className="h-4 w-4 text-notion-white" />
                            </div>
                            <Badge className="badge-notion-pill">{stat.change}</Badge>
                          </div>
                          <div className="text-card-title text-notion-black">{stat.value}</div>
                          <div className="text-micro uppercase">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-comfortable border-notion-whisper overflow-hidden bg-warm-white">
                      <div className="px-6 py-4 border-b-notion-whisper flex items-center justify-between bg-warm-white/30">
                        <span className="text-micro text-notion-black uppercase">Recent Entity Activity</span>
                        <Fingerprint className="h-4 w-4 text-warm-gray-300" />
                      </div>
                      <div className="divide-y divide-y-[rgba(0,0,0,0.1)]">
                        {demoVendors.map((v) => (
                          <div key={v.name} className="px-6 py-4 flex items-center justify-between hover:bg-warm-white/50 transition-all group/row">
                            <div className="flex items-center gap-4">
                              <div className="h-9 w-9 rounded-micro bg-warm-white border-notion-whisper flex items-center justify-center text-xs font-bold text-notion-black">
                                {v.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-body-medium text-notion-black">{v.name}</div>
                                <div className="text-micro uppercase">{v.type}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right hidden sm:block">
                                <div className="text-body-medium text-notion-black">{v.score}%</div>
                                <div className="text-micro uppercase">Rating</div>
                              </div>
                              <Badge variant="outline" className="text-micro rounded-pill border-notion-whisper">{v.status}</Badge>
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
        <section className="py-40 bg-notion-black text-notion-white overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl text-center relative">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
              <Badge variant="outline" className="badge-notion-pill border-white/10 text-white/60 bg-transparent">
                Global Deployment Portal
              </Badge>
              <h2 className="text-display-hero tracking-tight">
                Secure Your <br />
                <span className="text-white/40">Infrastructure.</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-body-large leading-relaxed">
                Join hundreds of enterprise procurement teams automating their strategic compliance shards with the VMS registry.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {registrationEnabled ? (
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-body-medium rounded-micro bg-notion-white text-notion-black hover:bg-notion-white/90 shadow-notion-card">
                      Initialize Protocol
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-body-medium rounded-micro bg-notion-white text-notion-black hover:bg-notion-white/90 shadow-notion-card">
                      Access Portal
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-body-medium rounded-micro border-white/10 text-notion-white hover:bg-white/5">
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
      <footer className="py-32 bg-notion-white border-t-notion-whisper">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
            <div className="col-span-1 md:col-span-5 space-y-8">
              <Link className="flex items-center gap-4" href="/">
                <div className="h-10 w-10 bg-notion-black rounded-micro flex items-center justify-center text-notion-white font-bold text-xl shadow-notion-card">
                  V
                </div>
                <span className="font-bold text-2xl tracking-tight text-notion-black">
                  VMS
                </span>
              </Link>
              <p className="text-body text-warm-gray-500 leading-relaxed max-w-sm">
                The modern standard for vendor management, automated compliance, and strategic supply chain security.
              </p>
              <div className="flex items-center gap-6 pt-2">
                {["X", "LinkedIn", "GitHub"].map((social) => (
                  <Link key={social} href="#" className="text-micro text-warm-gray-500 hover:text-notion-black transition-colors">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-micro uppercase text-notion-black">Ecosystem</h4>
                <ul className="space-y-4">
                  {["Capabilities", "Architecture", "Registry", "Protocol"].map(item => (
                    <li key={item}><Link href="#" className="text-body text-warm-gray-500 hover:text-notion-black transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-micro uppercase text-notion-black">Company</h4>
                <ul className="space-y-4">
                  {["About", "History", "Careers", "Press"].map(item => (
                    <li key={item}><Link href="#" className="text-body text-warm-gray-500 hover:text-notion-black transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-micro uppercase text-notion-black">Governance</h4>
                <ul className="space-y-4">
                  {["Privacy", "Terms", "Security", "Compliance"].map(item => (
                    <li key={item}><Link href="#" className="text-body text-warm-gray-500 hover:text-notion-black transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t-notion-whisper flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <p className="text-micro text-warm-gray-500">
              © {new Date().getFullYear()} Vendor Management System.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-micro uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-semantic-green" />
                Telemetry: Active
              </div>
              <Link href="#" className="text-micro text-warm-gray-500 hover:text-notion-black transition-colors uppercase">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
