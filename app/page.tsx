import Link from "next/link"
import { ArrowRight, Shield, CheckCircle2, Activity, Users, Building2, Zap, Lock, FileText, Star, Globe, ShieldCheck, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminDashboardPreview, VendorDashboardPreview } from "@/components/landing"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navigation */}
      <header className="px-6 lg:px-10 h-18 flex items-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            V
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block text-foreground/90">VendorPortal</span>
        </Link>
        <nav className="ml-12 hidden lg:flex items-center gap-8">
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#demo">
            Demo
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#pricing">
            Pricing
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">
              Member Sign In
            </Button>
          </Link>
          <Link href="#contact">
            <Button className="px-6 bg-accent text-accent-foreground shadow-sm hover:shadow-md transition-all font-semibold">
              Contact Sales
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-48 lg:pb-36 bg-gradient-to-b from-muted/50 to-background">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-24 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] -ml-48 -mb-24 pointer-events-none" />
          </div>

          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm font-medium border-primary/10 animate-fade-in">
                <Globe className="h-3.5 w-3.5 mr-2 text-primary" />
                Trusted by Fortune 500 Enterprises
              </Badge>

              <div className="space-y-6 max-w-4xl">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] text-foreground">
                  Streamline Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Operations</span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                  The mission-critical platform for automated onboarding, compliance monitoring, and secure vendor ecosystem management.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="#contact" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto bg-accent text-accent-foreground shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all font-bold rounded-2xl">
                    Experience the Full Suite <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg w-full sm:w-auto rounded-2xl font-semibold hover:bg-muted/50 transition-all border-2">
                    Partner Login
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                  <ShieldCheck className="h-6 w-6 text-primary" /> SECURECORP
                </div>
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                  <Globe className="h-6 w-6 text-primary" /> GLOBALTECH
                </div>
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                  <Building2 className="h-6 w-6 text-primary" /> APEXINDUSTRY
                </div>
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                  <BarChart3 className="h-6 w-6 text-primary" /> DATAPRO
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Grid */}
        <section id="features" className="py-24 md:py-32 bg-background border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-8 bg-muted/30 border-none shadow-none rounded-3xl group hover:bg-muted/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Enterprise Security</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SOC 2 Type II compliant platform with end-to-end encryption and multi-factor authentication for every vendor interaction.
                </p>
              </Card>
              <Card className="p-8 bg-muted/30 border-none shadow-none rounded-3xl group hover:bg-muted/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Rapid Onboarding</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Reduce vendor cycle times from weeks to hours with self-service registration and automated document verification.
                </p>
              </Card>
              <Card className="p-8 bg-muted/30 border-none shadow-none rounded-3xl group hover:bg-muted/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Deep Insights</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Real-time visibility into vendor health, risk factors, and performance metrics through powerful enterprise BI tools.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Tabs Section */}
        <section className="py-24 md:py-32 bg-background overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-none text-xs font-bold uppercase tracking-widest px-3 py-1">Advanced Capabilities</Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                    One Unified Hub for <br className="hidden md:block" />
                    All Vendor Data
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                    Replace fragmented spreadsheets and email chains with a centralized system of record designed for modern procurement teams.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg tracking-tight">Automated Verification</h4>
                      <p className="text-muted-foreground">Instantly validate EIN, insurance certificates, and tax documents.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg tracking-tight">Compliance Monitoring</h4>
                      <p className="text-muted-foreground">Continuous background checks and watch-list monitoring in real-time.</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" variant="secondary" className="font-bold rounded-xl px-8 py-6 h-auto">
                  Explore Full Feature Set <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full pointer-events-none opacity-50 translate-x-12 translate-y-12" />
                <Card className="relative overflow-hidden border-2 shadow-2xl rounded-3xl bg-background/50 backdrop-blur-sm">
                  <header className="px-6 py-4 border-b bg-muted/50 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-destructive/50" />
                      <div className="h-3 w-3 rounded-full bg-orange-500/50" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">Compliance Dashboard</div>
                  </header>
                  <CardContent className="p-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">94.2%</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">Overall Compliance</div>
                      </div>
                      <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-emerald-500" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[75, 92, 60].map((progress, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{['Insurance', 'Tax Docs', 'Background Checks'][i]}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex gap-3 text-sm font-medium">
                        <Star className="h-5 w-5 text-primary fill-primary" />
                        Smart Recommendation: Update 12 pending contracts.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Previews Section */}
        <section id="demo" className="py-24 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-none text-xs font-bold uppercase tracking-widest px-3 py-1">
                Interactive Preview
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                Experience Both Dashboards
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Explore our powerful admin controls and vendor-friendly interface — no sign-up required.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Admin Dashboard Preview */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    Admin Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Complete control over your vendor ecosystem with analytics, compliance tracking, and automated workflows.
                  </p>
                </div>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <AdminDashboardPreview />
                </div>
              </div>

              {/* Vendor Dashboard Preview */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                    Vendor Portal
                  </h3>
                  <p className="text-muted-foreground">
                    Self-service onboarding, document management, and opportunity bidding in one intuitive interface.
                  </p>
                </div>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <VendorDashboardPreview />
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Interactive demo with mock data • No authentication required
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 text-lg shadow-xl hover:shadow-2xl transition-all font-bold rounded-2xl">
                    Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-2xl font-semibold hover:bg-muted/50 transition-all border-2">
                    Sign In to Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -mr-96 -mt-96 blur-3xl pointer-events-none" />
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2 text-center">
                <div className="text-5xl md:text-6xl font-black italic tracking-tighter">$12B+</div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Managed Spend</div>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-5xl md:text-6xl font-black italic tracking-tighter">80%</div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Cycle Time Reduction</div>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-5xl md:text-6xl font-black italic tracking-tighter">0</div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Security Breaches</div>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-5xl md:text-6xl font-black italic tracking-tighter">24/7</div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">Expert Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32 md:py-48 bg-background relative border-b">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Ready to rethink vendor management?
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
                Join 500+ global enterprises transforming their procurement operations with VendorPortal.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="h-16 px-12 text-xl w-full sm:w-auto shadow-2xl hover:scale-105 transition-all font-bold rounded-2xl">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="#" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="h-16 px-12 text-xl w-full sm:w-auto font-bold rounded-2xl border-2 border-transparent hover:border-muted hover:bg-muted/50">
                    Contact Sales
                  </Button>
                </Link>
              </div>
              <div className="pt-10 flex items-center justify-center gap-2 text-muted-foreground font-semibold">
                <CheckCircle2 className="h-5 w-5 text-primary" /> No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-16 px-6 sm:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12">
            <div className="col-span-2 space-y-6">
              <Link className="flex items-center gap-2.5 group" href="/">
                <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
                  V
                </div>
                <span className="font-extrabold text-2xl tracking-tighter">VendorPortal</span>
              </Link>
              <p className="text-muted-foreground max-w-xs leading-relaxed font-medium">
                The world's most trusted vendor ecosystem platform for modern enterprises. Built for security, speed, and scale.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-foreground/50">Product</h4>
              <nav className="flex flex-col gap-2.5">
                {['Features', 'Security', 'Compliance', 'Solutions'].map((item) => (
                  <Link key={item} href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-foreground/50">Company</h4>
              <nav className="flex flex-col gap-2.5">
                {['About Us', 'Success Stories', 'Partners', 'Careers'].map((item) => (
                  <Link key={item} href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-foreground/50">Legal</h4>
              <nav className="flex flex-col gap-2.5">
                {['Privacy', 'Terms', 'GDPR', 'Cookies'].map((item) => (
                  <Link key={item} href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold text-muted-foreground/60 tracking-tight">
              © 2024 VendorPortal Inc. All rights reserved. Designed for Enterprise Scale.
            </p>
            <div className="flex gap-8">
              {['Twitter', 'LinkedIn', 'Github'].map((social) => (
                <Link key={social} href="#" className="text-sm font-black uppercase tracking-tighter text-muted-foreground/40 hover:text-primary transition-colors">{social}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
