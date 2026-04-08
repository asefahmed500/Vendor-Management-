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
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
              V
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight hidden sm:block">
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
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Subtle background mesh */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-accent/5 to-transparent rounded-full blur-3xl opacity-60" />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 font-medium">
                <Globe className="h-3 w-3 mr-1.5" />
                Enterprise-Ready Platform
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
                Vendor management,{" "}
                <span className="text-accent">simplified</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Streamline your vendor lifecycle from onboarding to compliance monitoring. 
                Built for enterprises that demand security, speed, and control.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 font-medium">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 font-medium">
                    View Demo
                  </Button>
                </Link>
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

            {/* Demo Dashboard Preview - Larger & More Detailed */}
            <div className="bg-background rounded-xl border border-border shadow-2xl overflow-hidden max-w-5xl mx-auto">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center font-bold text-lg">
                    V
                  </div>
                  <div>
                    <span className="font-heading font-bold text-xl">Admin Dashboard</span>
                    <p className="text-primary-foreground/70 text-sm">Vendor Management System</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-primary-foreground/70">admin@vms.com</p>
                  </div>
                  <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                {/* Stats Cards - Larger */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {demoStats.map((stat) => (
                    <div key={stat.label} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recent Vendors */}
                  <div className="rounded-xl border bg-card">
                    <div className="p-5 border-b flex items-center justify-between bg-muted/30">
                      <h3 className="font-heading font-bold text-lg">Recent Vendors</h3>
                      <Button variant="ghost" size="sm">View All →</Button>
                    </div>
                    <div className="p-5 space-y-4">
                      {demoVendors.map((vendor) => (
                        <div key={vendor.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center font-bold text-accent">
                              {vendor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">{vendor.name}</p>
                              <p className="text-xs text-muted-foreground">{vendor.type}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              vendor.status === "Approved" ? "default" :
                              vendor.status === "Under Review" ? "secondary" :
                              "outline"
                            }
                            className="font-medium"
                          >
                            {vendor.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposal Evaluations */}
                  <div className="rounded-xl border bg-card">
                    <div className="p-5 border-b flex items-center justify-between bg-muted/30">
                      <h3 className="font-heading font-bold text-lg">Active Proposals</h3>
                      <Button variant="ghost" size="sm">View All →</Button>
                    </div>
                    <div className="p-5 space-y-4">
                      {demoProposals.map((proposal) => (
                        <div key={proposal.vendor} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-semibold">{proposal.vendor}</p>
                            <p className="text-xs text-muted-foreground">Score: {proposal.score}/100</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${proposal.score}%` }}
                              />
                            </div>
                            <Badge 
                              variant={
                                proposal.status === "Selected" ? "default" :
                                proposal.status === "Reviewing" ? "secondary" :
                                "outline"
                              }
                              className="font-medium"
                            >
                              {proposal.status}
                            </Badge>
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
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <Badge variant="outline" className="mb-4 font-medium">
                Capabilities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                Everything you need to manage vendors at scale
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={feature.title} className="border-border/50 hover:border-accent/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 border-t border-border/50">
          <div className="container mx-auto px-6">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Ready to transform your vendor management?
                </h2>
                <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
                  Join 500+ enterprises using VendorPortal to streamline compliance, 
                  onboarding, and vendor relationships.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="h-12 px-8 font-medium">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="ghost" className="h-12 px-8 font-medium text-primary-foreground hover:bg-primary-foreground/10">
                      Contact Sales
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