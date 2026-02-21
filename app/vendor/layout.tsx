'use client';

import { type ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  User,
  Award,
  LogOut,
  Briefcase,
  Building2,
  Menu,
  ChevronRight,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { IVendor } from '@/lib/types/vendor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { title: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { title: 'Opportunities', href: '/vendor/proposals', icon: Briefcase, group: 'Bidding' },
  { title: 'Submissions', href: '/vendor/proposals/submissions', icon: FileText, group: 'Bidding' },
  { title: 'Corporate Profile', href: '/vendor/profile', icon: User, group: 'Compliance' },
  { title: 'Certification', href: '/vendor/certificate', icon: Award, group: 'Compliance' },
];

const statusVariants: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED_LOGIN: 'info',
  DOCUMENTS_SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Registration Pending',
  APPROVED_LOGIN: 'Access Enabled',
  DOCUMENTS_SUBMITTED: 'Docs Verified',
  UNDER_REVIEW: 'Audit in Progress',
  APPROVED: 'Verified Partner',
  REJECTED: 'Access Denied',
};

import { authClient } from '@/lib/auth/auth-client';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [isLoadingVendor, setIsLoadingVendor] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch('/api/vendor/profile');
        if (response.ok) {
          const result = await response.json();
          setVendor(result.data.vendor);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setIsLoadingVendor(false);
      }
    };

    fetchVendor();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const currentTitle = navItems.find((item) => pathname?.startsWith(item.href))?.title || 'Vendor Workspace';
  const groups = Array.from(new Set(navItems.map(item => item.group)));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#09090B] text-zinc-400">
      {/* Brand Section */}
      <div className="h-20 flex items-center px-8 border-b border-zinc-900 bg-zinc-950/20">
        <Link href="/vendor/dashboard" className="flex items-center gap-4 group">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tighter text-xl uppercase">VMS<span className="text-indigo-500 text-xs ml-1 font-bold">VENDOR</span></span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Partner Portal</span>
          </div>
        </Link>
      </div>

      {/* Account Status Badge */}
      {vendor && (
        <div className="px-6 py-6 border-b border-zinc-900 bg-zinc-900/10">
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Nexus Status</p>
            <Badge
              variant={statusVariants[vendor.status] || 'default'}
              className="w-full justify-center py-1.5 rounded-lg border-2 font-bold uppercase tracking-tight text-[10px]"
            >
              {statusLabels[vendor.status] || vendor.status}
            </Badge>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 py-8">
        <div className="space-y-8">
          {groups.map(group => (
            <div key={group} className="space-y-3">
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 border-l border-zinc-800 ml-4 pb-1">
                {group}
              </h3>
              <div className="space-y-1">
                {navItems.filter(item => item.group === group).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.startsWith(item.href) && (item.href !== '/vendor/proposals' || pathname === '/vendor/proposals' || pathname.startsWith('/vendor/proposals/'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${isActive
                        ? 'bg-indigo-600/10 text-white'
                        : 'hover:text-white hover:bg-zinc-900'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[2px_0_10px_rgba(99,102,241,0.5)]" />
                      )}
                      <Icon className={`h-5 w-5 transition-all ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 text-zinc-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Actions */}
      <div className="p-6 mt-auto border-t border-zinc-900 bg-zinc-950/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all group h-12 font-black uppercase tracking-tighter rounded-xl"
        >
          <LogOut className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-1" />
          End Session
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#09090B] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-zinc-950 border-r border-zinc-900 flex flex-col hidden lg:flex shrink-0 shadow-2xl relative z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md shadow-xl border border-zinc-200">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 border-r-0 bg-zinc-950">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-background">
        {/* Modern Header */}
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b flex items-center justify-between px-8 md:px-12 z-30 sticky top-0 border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-6">
            {/* Breadcrumb navigation - visible on desktop */}
            <div className="hidden lg:flex items-center gap-2 text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Vendor Node</span>
              <ChevronRight className="h-3 w-3 opacity-20" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{currentTitle}</span>
            </div>
            {/* Mobile title - visible on small screens, also visible for tests */}
            <h1 className="text-xl font-bold tracking-tight lg:hidden">{currentTitle}</h1>
            {/* Desktop heading - hidden visually but present for SEO/tests */}
            <h1 className="sr-only">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl text-zinc-400 group hover:ring-2 hover:ring-indigo-500/20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-text">
              <Search className="h-4 w-4 group-hover:text-indigo-400 transition-colors" />
              <span className="text-sm font-medium pr-10">Search portal...</span>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
                <HelpCircle className="h-5 w-5 group-hover:text-indigo-500 transition-colors" />
              </Button>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-4 pl-2 cursor-pointer group">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-black tracking-tight leading-none group-hover:text-indigo-500 transition-colors truncate max-w-[150px] uppercase">
                        {vendor?.companyName || user.name || 'Vendor'}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Authorized Vendor</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl group-hover:scale-105 transition-transform border-4 border-background outline outline-1 outline-zinc-200 dark:outline-zinc-800">
                      {(vendor?.contactPerson?.[0] || user.name?.[0] || 'V').toUpperCase()}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 rounded-[1.5rem] p-2 shadow-2xl border-2">
                  <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 px-3 py-3">Vendor Account Management</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="rounded-xl h-11 font-bold cursor-pointer">
                    <Link href="/vendor/profile" className="flex items-center justify-between w-full">
                      Profile Dashboard
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer">Security Protocol</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer">Support Tickets</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-11 font-bold cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10">
                    Secure Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-[#09090B] relative scroll-smooth">
          {/* Subtle Decorative Background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/2 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto p-8 md:p-12 lg:p-16 min-h-full">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
