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
  const registrationEnabled = process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== 'false' && process.env.ENABLE_REGISTRATION !== 'false';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-zinc-950">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="h-10 w-10 bg-zinc-950 border-2 border-zinc-950 flex items-center justify-center text-white font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              V
            </div>
            <span className="font-heading font-black text-2xl uppercase tracking-tighter hidden sm:block text-zinc-950">
              VMS_OS
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 hover:text-zinc-950 transition-colors" href="#features">
              Registry_Specs
            </Link>
            <Link className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 hover:text-zinc-950 transition-colors" href="#demo">
              Operational_Demo
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] hover:bg-zinc-50 rounded-none">
                Sign_In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="h-12 px-6 font-black uppercase tracking-widest text-[10px] bg-zinc-950 text-white rounded-none border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Initialize_Gateway
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 pt-20 outline-none" tabIndex={-1}>
        {/* Clean Industrial Hero Section - Balanced 2.0 */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white border-b-4 border-zinc-950">
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.015\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <Badge variant="outline" className="mb-8 font-sans font-black px-4 py-2 text-[10px] uppercase tracking-[0.5em] bg-zinc-950 text-white rounded-none border-zinc-950 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)]">
              <Globe className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
              SYSTEM_DEPLOYED // NODE_ACCESS_STABLE // 2026.Q2
            </Badge>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-heading font-black tracking-[-0.04em] mb-10 text-zinc-950 leading-[0.82] text-balance">
              Vendor Management. <br />
              <span className="text-indigo-600 uppercase">Engineered_Core.</span>
            </h1>
            
            <p className="text-md md:text-xl font-sans text-zinc-600 max-w-2xl mb-14 leading-relaxed font-bold uppercase tracking-tight">
              Ditch the spreadsheets. VMS_OS is a high-precision operating system to automate compliance and secure your supply chain with clinical accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full mb-32">
              {registrationEnabled && (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-20 px-14 font-heading font-black text-xl bg-indigo-600 hover:bg-indigo-700 text-white rounded-none border-4 border-zinc-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all uppercase tracking-tighter">
                    Initialize
                    <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                  </Button>
                </Link>
              )}

              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-20 px-14 font-heading font-black text-xl rounded-none border-4 border-zinc-950 text-zinc-950 bg-white hover:bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all uppercase tracking-tighter">
                  Terminal
                </Button>
              </Link>
            </div>

            {/* Client Logos - Refined presence */}
            <div className="w-full pt-16 border-t border-zinc-100 max-w-5xl">
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-25 hover:opacity-100 transition-opacity">
                <div className="text-2xl font-black font-heading text-zinc-950 tracking-tighter grayscale">ACME_CORP</div>
                <div className="text-2xl font-black font-heading text-zinc-950 tracking-tighter grayscale">GLOBAL_SYS</div>
                <div className="text-2xl font-black font-heading text-zinc-950 tracking-tighter grayscale">NEXUS_UNIT</div>
                <div className="text-2xl font-black font-heading text-zinc-950 tracking-tighter grayscale">DATA_LOGS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Industrial Grid */}
        <section id="stats" className="bg-zinc-950 text-white border-b-4 border-zinc-950 relative">
          <div className="container mx-auto px-0">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-zinc-900 border-x-2 border-zinc-900">
              {stats.map((stat, index) => (
                <div key={stat.label} className="p-12 md:p-16 hover:bg-zinc-900 transition-colors text-center relative group overflow-hidden">
                  <div className="absolute top-2 right-4 text-[10px] font-mono text-zinc-800 font-black tracking-widest group-hover:text-zinc-600">0{index + 1}</div>
                  <div className="text-4xl md:text-6xl font-heading font-black text-indigo-400 mb-2 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
                    {stat.label.replace(' ', '_')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Dashboard Section - Clean Industrial Masterpiece */}
        <section id="demo" className="py-32 md:py-48 bg-zinc-50 relative overflow-hidden scroll-mt-24">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-6 mb-20 max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-2 font-black border-zinc-950 text-zinc-950 rounded-none bg-white px-5 py-2 uppercase text-[10px] tracking-[0.3em] border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                Live_Operating_Portal
              </Badge>
              <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter text-zinc-950 uppercase leading-none text-balance">
                Total_Visibility.
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-xl border-t border-zinc-200 pt-6">
                Redefining the standard for procurement intelligence. A unified core for vendor relations, compliance tracking, and score automation.
              </p>
            </div>

            {/* Mock Dashboard 2.0 - Detail Rich */}
            <div className="bg-white border-4 border-zinc-950 shadow-[20px_20px_0px_0px_rgba(30,41,59,0.1)] max-w-6xl mx-auto rounded-none overflow-hidden relative z-10 transition-all hover:shadow-[24px_24px_0px_0px_rgba(30,41,59,0.15)] hover:-translate-y-1">
              <div className="flex h-[700px]">
                {/* Dashboard Sidebar - Mock */}
                <div className="w-20 md:w-64 bg-zinc-950 border-r-4 border-zinc-950 flex flex-col hidden sm:flex">
                  <div className="p-8 border-b-2 border-zinc-800 flex items-center gap-4">
                    <div className="h-10 w-10 bg-white text-zinc-950 flex items-center justify-center font-black text-2xl border-2 border-white">
                      V
                    </div>
                    <span className="font-heading font-black text-xl text-white tracking-widest hidden md:block">CORE_OS</span>
                  </div>
                  <div className="flex-1 p-4 space-y-4 pt-10">
                    {['DASHBOARD', 'VENDORS', 'DOCUMENTS', 'PROPOSALS', 'SETTINGS'].map((item, i) => (
                      <div key={item} className={`p-4 font-black text-[10px] tracking-widest uppercase transition-colors flex items-center gap-4 ${i === 0 ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                        <div className={`h-1.5 w-1.5 ${i === 0 ? 'bg-white' : 'bg-zinc-800'}`}></div>
                        <span className="hidden md:block">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-8 border-t-2 border-zinc-800">
                     <div className="h-12 w-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center">
                        <Users className="h-5 w-5 text-zinc-600" aria-hidden="true" />
                     </div>
                  </div>
                </div>

                {/* Dashboard Analytics - Main Panel */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                  {/* Header */}
                  <div className="p-8 border-b-2 border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-widest text-zinc-950">Active_Terminal</h3>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Status: Primary_Node // v.Core.Active</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="h-12 border-2 border-zinc-950 px-6 flex items-center font-black text-[10px] uppercase tracking-widest bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          Search_Registry_
                       </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Stats HUD */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                      {demoStats.map((stat) => (
                        <div key={stat.label} className="p-6 border-2 border-zinc-950 bg-white hover:bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-[background-color,transform,box-shadow] flex flex-col items-center text-center">
                          <stat.icon className="h-6 w-6 text-zinc-950 mb-4" aria-hidden="true" />
                          <div className="text-3xl font-black font-heading mb-1 text-zinc-950 tracking-tighter">{stat.value}</div>
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Rich Data Listing */}
                    <div className="space-y-12">
                      <div className="border-4 border-zinc-950 bg-white">
                        <div className="bg-zinc-950 text-white p-4 flex items-center justify-between">
                           <span className="font-black text-[11px] uppercase tracking-widest flex items-center gap-3">
                              <div className="h-3 w-3 bg-indigo-500"></div>
                              VENDOR_REGISTRY_LISTING
                           </span>
                           <span className="text-[9px] font-mono text-zinc-400 uppercase">Filters: Status(Active) // Risk(Any)</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b-2 border-zinc-950 bg-zinc-50">
                                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-zinc-500">Vendor_Entity</th>
                                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-zinc-500">Vertical</th>
                                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-zinc-500">Risk_Level</th>
                                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-zinc-500">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-zinc-100 uppercase">
                              {[
                                { name: 'Acme Systems', type: 'IT_Infra', risk: 'Low', status: 'Approved', color: 'emerald' },
                                { name: 'Global Tech', type: 'Hardware', risk: 'Medium', status: 'Pending', color: 'amber' },
                                { name: 'Nexus Logistics', type: 'Supply', risk: 'Low', status: 'Approved', color: 'emerald' },
                                { name: 'Data Logs Corp', type: 'Security', risk: 'High', status: 'Reviewing', color: 'indigo' },
                              ].map((v) => (
                                <tr key={v.name} className="hover:bg-zinc-50/50 transition-colors font-sans">
                                  <td className="p-5">
                                    <div className="flex items-center gap-4">
                                      <div className="h-8 w-8 bg-zinc-950 text-white flex items-center justify-center font-black text-[10px]">{v.name.charAt(0)}</div>
                                      <span className="font-black text-[11px] tracking-tight">{v.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-5 font-black text-[10px] text-zinc-500">{v.type}</td>
                                  <td className="p-5">
                                    <div className="flex items-center gap-2">
                                      <div className={`h-2 w-2 rounded-full ${v.risk === 'Low' ? 'bg-emerald-500' : v.risk === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                      <span className="font-black text-[10px]">{v.risk}</span>
                                    </div>
                                  </td>
                                  <td className="p-5">
                                    <Badge variant="outline" className={`rounded-none border-2 font-black text-[8px] tracking-widest px-3 py-1 ${v.color === 'emerald' ? 'border-emerald-600 text-emerald-600 bg-emerald-50' : v.color === 'amber' ? 'border-amber-600 text-amber-600 bg-amber-50' : 'border-indigo-600 text-indigo-600 bg-indigo-50'}`}>
                                      {v.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Performance HUD */}
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="border-4 border-zinc-950 p-8 bg-zinc-50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl">DATA</div>
                          <h4 className="font-heading font-black text-xs uppercase tracking-[0.3em] text-zinc-950 mb-8 border-b-2 border-zinc-200 pb-4">Compliance_Engine_v4</h4>
                          <div className="space-y-8">
                            {demoProposals.slice(0, 3).map((p) => (
                              <div key={p.vendor} className="space-y-3">
                                <div className="flex justify-between items-end">
                                  <p className="font-black text-[11px] uppercase tracking-tighter text-zinc-950">{p.vendor}</p>
                                  <span className="text-[10px] font-mono font-black text-indigo-600">{p.score}% Accuracy</span>
                                </div>
                                <div className="h-3 border-2 border-zinc-950 bg-white p-0.5 relative">
                                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${p.score}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border-4 border-zinc-950 p-8 bg-white relative">
                           <h4 className="font-heading font-black text-xs uppercase tracking-[0.3em] text-zinc-950 mb-8 border-b-2 border-zinc-100 pb-4">Real_Time_Audit_Log</h4>
                           <div className="space-y-6">
                              {[
                                { t: '12:44:02', m: 'Vendor ACME_SYSTEMS authorized with SOC2_VALIDATION.', s: 'SUCCESS' },
                                { t: '11:20:15', m: 'Compliance alert triggered for GLOBAL_TECH (Exp: 2026.04).', s: 'WARNING' },
                                { t: '09:05:47', m: 'Security scan initialized for all CLOUD_NODES.', s: 'SYSTEM' }
                              ].map((log, i) => (
                                <div key={i} className="flex gap-4 border-l-2 border-zinc-100 pl-4 py-1">
                                   <span className="text-[9px] font-mono text-zinc-400">{log.t}</span>
                                   <p className="text-[10px] font-black uppercase tracking-tight leading-tight flex-1">{log.m}</p>
                                   <span className={`text-[8px] font-black ${log.s === 'SUCCESS' ? 'text-emerald-500' : log.s === 'WARNING' ? 'text-amber-500' : 'text-indigo-500'}`}>[{log.s}]</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Detail Listing Style */}
        <section id="features" className="py-32 md:py-48 bg-zinc-950 text-white relative scroll-mt-24">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mb-24 border-l-8 border-indigo-600 pl-10">
              <Badge variant="outline" className="mb-8 font-black border-indigo-500 text-indigo-400 rounded-none uppercase tracking-[0.6em] bg-indigo-950/30 border-2 px-4 py-2 text-[10px]">
                System_Capabilities
              </Badge>
              <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter leading-none mb-8 text-balance">
                The_Core_Modules.
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-2xl leading-loose">
                Engineered for massive datasets and clinical decision-making. No fluff. No distractions. Just pure procurement power.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 border-4 border-zinc-900 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] bg-zinc-900/50 backdrop-blur-sm">
              {features.map((feature, index) => (
                <div key={feature.title} className="bg-zinc-950 p-12 hover:bg-zinc-900 transition-all border-zinc-900 group relative overflow-hidden">
                    <div className="absolute top-4 right-6 text-zinc-800 font-black text-4xl group-hover:text-indigo-900/40 transition-colors">0{index + 1}</div>
                    <div className="h-16 w-16 border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center mb-10 group-hover:border-indigo-500 group-hover:bg-indigo-950/30 transition-[border-color,background-color]">
                      <feature.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-black text-xl mb-4 uppercase tracking-widest text-white">
                      {feature.title.replace(' ', '_')}
                    </h3>
                    <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
                      {feature.description}
                    </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - High Impact 2.0 */}
        <section className="py-32 md:py-48 border-t-8 border-zinc-950 bg-white">
          <div className="container mx-auto px-6">
            <div className="border-8 border-zinc-950 p-16 md:p-32 text-center bg-indigo-600 relative overflow-hidden shadow-[32px_32px_0px_0px_rgba(30,41,59,0.1)]">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'5\' cy=\'5\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
                
                <h2 className="text-5xl md:text-8xl font-heading font-black mb-12 text-white tracking-tighter uppercase leading-[0.8] relative z-10 text-balance">
                  Initialize_ <br /> System_Deployment_
                </h2>
                <p className="text-indigo-100 max-w-xl mx-auto mb-16 text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-loose relative z-10 bg-indigo-700/50 backdrop-blur-sm p-6 border-2 border-indigo-400">
                  Ready to upgrade your supply chain intelligence? Scale instantly with VMS_OS Enterprise. Absolute compliance at the speed of thought.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
                  {registrationEnabled ? (
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-24 px-16 font-heading font-black text-2xl bg-white hover:bg-zinc-50 text-indigo-600 border-4 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all rounded-none uppercase tracking-[0.1em]">
                        BOOT_SYSTEM
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-24 px-16 font-heading font-black text-2xl bg-zinc-950 hover:bg-zinc-800 text-white border-4 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all rounded-none uppercase tracking-[0.1em]">
                        USER_LOGIN
                      </Button>
                    </Link>
                  )}
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Professional Industrial */}
      <footer className="py-24 bg-white border-t-8 border-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="space-y-8">
              <Link className="flex items-center gap-4 group" href="/">
                <div className="h-12 w-12 bg-zinc-950 border-4 border-zinc-950 flex items-center justify-center text-white font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
                  V
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-3xl uppercase tracking-tighter text-zinc-950">
                    VMS_OS
                  </span>
                  <span className="text-[10px] font-black text-indigo-600 tracking-[0.4em]">ENTERPRISE_CORE</span>
                </div>
              </Link>
              <p className="max-w-xs text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-loose border-l-2 border-zinc-100 pl-4">
                Global_Compliance // Scalable_Supply_Chain. <br /> Engineered by specialized systems.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-24">
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-950 border-b-2 border-zinc-950 pb-2">Modules</h4>
                <div className="flex flex-col gap-4">
                    <Link href="#features" className="text-[10px] font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Procurement_v4</Link>
                    <Link href="/login" className="text-[10px] font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Auth_Gateway</Link>
                    <Link href="#demo" className="text-[10px] font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Sandbox_Node</Link>
                </div>
              </div>
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-950 border-b-2 border-zinc-950 pb-2">Legal_Core</h4>
                <div className="flex flex-col gap-4">
                    <Link href="/terms" className="text-[10px] font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">TOS_Contract</Link>
                    <div className="flex items-center gap-3 text-zinc-400">
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        <span className="text-[9px] font-black uppercase tracking-[0.6em]">ISO_27001</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-32 pt-12 border-t-2 border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Specialized_Systems // VMS_CORE_OS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}