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
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoStats = [
  { label: "Total Vendors", value: "247", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Active RFPs", value: "18", change: "+3", icon: Briefcase, color: "text-emerald-500" },
  { label: "Pending Reviews", value: "34", change: "-5", icon: Clock, color: "text-amber-500" },
  { label: "Total Value", value: "$2.4M", change: "+18%", icon: DollarSign, color: "text-purple-500" },
];

const demoVendors = [
  { name: "Acme Corp", status: "Approved", type: "Technology" },
  { name: "Global Solutions", status: "Under Review", type: "Consulting" },
  { name: "TechStart Inc", status: "Pending", type: "SaaS" },
];

const demoProposals = [
  { vendor: "Acme Corp", score: 92, status: "Selected" },
  { vendor: "Global Solutions", score: 87, status: "Reviewing" },
  { vendor: "TechStart Inc", score: 78, status: "Pending" },
];

const features = [
  {
    icon: Shield,
    title: "Compliance Automation",
    description: "SOC 2, HIPAA, and custom compliance workflows automated end-to-end."
  },
  {
    icon: Users,
    title: "Vendor Registry",
    description: "Centralized directory with verified credentials and real-time status tracking."
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure uploads, e-signatures, and automated expiration alerts."
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Comprehensive metrics and insights for data-driven decisions."
  },
  {
    icon: Zap,
    title: "Rapid Onboarding",
    description: "Self-service registration with instant verification checks."
  },
  {
    icon: Building2,
    title: "RFP Management",
    description: "Streamlined proposal collection and evaluation workflows."
  }
];

const stats = [
  { value: "500+", label: "Enterprise Vendors" },
  { value: "99.9%", label: "Compliance Rate" },
  { value: "24/7", label: "Support" },
  { value: "< 2hr", label: "Avg. Onboarding" }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-3" href="/">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="font-heading font-bold text-xl tracking-tight hidden sm:block text-slate-900">
              VendorPortal
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#demo">
              Demo
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="font-medium">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Editorial Tech Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white border-b-2 border-zinc-950">
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <Badge variant="outline" className="mb-8 font-sans font-bold px-4 py-1.5 text-xs uppercase tracking-widest bg-zinc-950 text-white rounded-none border-zinc-950">
                  <Globe className="h-3 w-3 mr-2" />
                  Enterprise OS // 2026 Edition
                </Badge>
                
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 text-zinc-950 leading-[0.9] -ml-1">
                  Vendor Management.<br />
                  <span className="text-indigo-600">Engineered.</span>
                </h1>
                
                <p className="text-xl md:text-2xl font-sans text-zinc-600 max-w-2xl mb-12 leading-relaxed font-medium">
                  The brutal truth? Vendor onboarding shouldn't take weeks. We built a hyper-functional operating system to automate compliance and secure your supply chain instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-heading font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      Initialize Platform
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 font-heading font-bold text-lg rounded-none border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      Access Terminal
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative hidden lg:block">
                {/* Asymmetrical Structural Element */}
                <div className="border-4 border-zinc-950 bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative animate-fade-in z-20">
                   <div className="flex border-b-2 border-zinc-950 pb-4 mb-4 justify-between items-center">
                     <span className="font-heading font-bold text-zinc-950 uppercase tracking-widest">System_Status</span>
                     <span className="bg-emerald-500 w-3 h-3 rounded-none animate-pulse border border-zinc-950"></span>
                   </div>
                   <div className="space-y-4 font-mono text-sm text-zinc-800">
                     <div className="flex justify-between border-b border-zinc-200 pb-2"><span>COMPLIANCE_CHECKS</span><span className="font-bold">PASS</span></div>
                     <div className="flex justify-between border-b border-zinc-200 pb-2"><span>ACTIVE_VENDORS</span><span className="font-bold">1,402</span></div>
                     <div className="flex justify-between border-b border-zinc-200 pb-2"><span>ENCRYPTION</span><span className="font-bold">AES-256</span></div>
                   </div>
                </div>
                <div className="absolute top-10 -right-10 w-full h-full border-4 border-indigo-600 bg-indigo-50 z-10" />
              </div>
            </div>

            {/* Client Logos (Social Proof) */}
            <div className="mt-32 pt-10 border-t-2 border-zinc-950">
              <p className="text-sm font-bold text-zinc-950 mb-6 uppercase tracking-wider font-sans">Trusted by innovative enterprises</p>
              <div className="flex flex-wrap items-center gap-8 md:gap-16 opacity-100 transition-all duration-300">
                <div className="text-2xl font-black font-heading text-zinc-400 hover:text-zinc-950 transition-colors">ACME_CORP</div>
                <div className="text-2xl font-black font-heading text-zinc-400 hover:text-zinc-950 transition-colors">GLOBAL.TECH</div>
                <div className="text-2xl font-black font-heading text-zinc-400 hover:text-zinc-950 transition-colors">NEXUS_HEALTH</div>
                <div className="text-2xl font-black font-heading text-zinc-400 hover:text-zinc-950 transition-colors">FINSERVE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Dashboard Section */}
        <section id="demo" className="py-32 md:py-40 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <Badge variant="secondary" className="mb-4 font-medium">
                <Eye className="h-3 w-3 mr-1.5" />
                Live Dashboard Preview
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                Enterprise-grade vendor management
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Real-time visibility into vendor compliance, performance metrics, and procurement workflows.
              </p>
            </div>

            {/* Demo Dashboard Preview - Sharp Editorial Style */}
            <div className="bg-white border-4 border-zinc-950 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-5xl mx-auto rounded-none mb-10 overflow-hidden relative z-10 transition-transform hover:-translate-y-1">
              {/* Dashboard Header */}
              <div className="bg-zinc-950 text-white p-6 border-b-4 border-zinc-950 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white text-zinc-950 flex items-center justify-center font-black text-xl border-2 border-white">
                    V
                  </div>
                  <div>
                    <span className="font-heading font-black text-2xl uppercase tracking-tight">Terminal</span>
                    <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">VMS_OS_CORE</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 hidden sm:flex">
                  <div className="text-right">
                    <p className="text-sm font-bold uppercase tracking-wider font-heading">Global Admin</p>
                    <p className="text-xs text-zinc-400 font-mono">SYS_ROOT</p>
                  </div>
                  <div className="h-10 w-10 border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 bg-[#f4f4f5]">
                {/* Stats Cards - Sharp */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {demoStats.map((stat) => (
                    <div key={stat.label} className="p-6 border-2 border-zinc-950 bg-white hover:bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-zinc-100">
                        <div className="p-2 border-2 border-zinc-950 bg-white rounded-none">
                          <stat.icon className="h-6 w-6 text-zinc-950" />
                        </div>
                        <span className="text-xs font-black font-mono text-zinc-950 border-2 border-zinc-950 px-2 py-1 uppercase">{stat.change}</span>
                      </div>
                      <div className="text-4xl font-black font-heading mb-1 text-zinc-950">{stat.value}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recent Vendors */}
                  <div className="border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-5 border-b-2 border-zinc-950 flex items-center justify-between bg-zinc-100">
                      <h3 className="font-heading font-black text-lg uppercase tracking-tight">Recent Deployments</h3>
                      <Button variant="outline" size="sm" className="rounded-none border-2 border-zinc-950 font-bold uppercase text-xs">View Log</Button>
                    </div>
                    <div className="p-5 space-y-4">
                      {demoVendors.map((vendor) => (
                        <div key={vendor.name} className="flex items-center justify-between p-3 border-2 border-transparent hover:border-zinc-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 border-2 border-zinc-950 flex items-center justify-center font-black text-zinc-950">
                              {vendor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-950 uppercase">{vendor.name}</p>
                              <p className="text-xs font-mono text-zinc-500">{vendor.type}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider font-mono border-2 px-2 py-1 ${vendor.status === 'Approved' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-amber-500 text-amber-600 bg-amber-50'}`}>
                            {vendor.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposal Evaluations */}
                  <div className="border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-5 border-b-2 border-zinc-950 flex items-center justify-between bg-zinc-100">
                      <h3 className="font-heading font-black text-lg uppercase tracking-tight">Active Threads</h3>
                      <Button variant="outline" size="sm" className="rounded-none border-2 border-zinc-950 font-bold uppercase text-xs">Manage</Button>
                    </div>
                    <div className="p-5 space-y-4">
                      {demoProposals.map((proposal) => (
                        <div key={proposal.vendor} className="flex flex-col gap-2 p-3 border-2 border-transparent hover:border-zinc-200 transition-colors">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-zinc-950 uppercase">{proposal.vendor}</p>
                            <span className="text-xs font-bold uppercase tracking-wider font-mono bg-zinc-950 text-white px-2 py-1">
                              {proposal.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 h-3 border-2 border-zinc-950 bg-zinc-100 p-0.5">
                              <div 
                                className="h-full bg-indigo-600" 
                                style={{ width: `${proposal.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-black font-mono">v{proposal.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This is a preview. Sign in to see your actual data.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-11 px-8 font-medium">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-11 px-8 font-medium">
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-16 border-y border-border/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 bg-zinc-950 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <Badge variant="outline" className="mb-4 font-bold border-zinc-700 text-zinc-300 rounded-none uppercase tracking-widest bg-zinc-900 border-2">
                Capabilities
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                A system built for <br/><span className="text-indigo-400">absolute control.</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={feature.title} className="bg-zinc-900 border-2 border-zinc-800 rounded-none hover:border-indigo-500 transition-colors group">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 border-2 border-zinc-700 bg-zinc-950 flex items-center justify-center mb-6 group-hover:border-indigo-500 group-hover:bg-indigo-950 transition-colors">
                      <feature.icon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 uppercase tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed font-sans font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 border-t-4 border-zinc-950 bg-indigo-600">
          <div className="container mx-auto px-6">
            <Card className="bg-transparent border-0 overflow-hidden relative">
              <CardContent className="p-0 text-center relative z-10 flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 text-white tracking-tighter">
                  READY TO DEPLOY?
                </h2>
                <p className="text-indigo-100 max-w-xl mx-auto mb-10 text-xl font-medium font-sans">
                  The OS for the modern enterprise. Stop managing vendors. Start engineering relationships.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-16 px-12 font-heading font-black text-xl bg-white hover:bg-zinc-100 text-zinc-950 border-4 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none uppercase tracking-widest">
                      Initialize Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                V
              </div>
              <span className="font-heading font-semibold text-sm">
                VendorPortal
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span> SOC 2 Compliant</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VendorPortal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}