'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Briefcase,
  LogOut,
  Building,
  Menu,
  ChevronRight,
  Bell,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { title: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard, group: 'Management' },
  { title: 'Vendors', href: '/admin/vendors', icon: Users, group: 'Management' },
  { title: 'Onboarding', href: '/admin/create-vendor', icon: UserPlus, group: 'Management' },
  { title: 'RFP Proposals', href: '/admin/proposals', icon: Briefcase, group: 'Operations' },
  { title: 'Library', href: '/admin/documents', icon: FileText, group: 'Operations' },
];

interface SidebarContentProps {
  pathname: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

function SidebarContent({ pathname, setMobileMenuOpen, handleLogout }: SidebarContentProps) {
  const groups = Array.from(new Set(navItems.map(item => item.group)));

  return (
    <div className="flex flex-col h-full bg-[#0D0D0F] text-zinc-400">
      {/* Brand Section */}
      <div className="h-20 flex items-center px-8 border-b border-zinc-900 bg-zinc-950/50">
        <Link href="/admin/dashboard" className="flex items-center gap-4 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform">
            <Building className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tighter text-xl uppercase">VMS<span className="text-primary text-xs ml-1 font-bold">PRO</span></span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Management</span>
          </div>
        </Link>
      </div>

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
                  const isActive = item.href === '/admin/dashboard'
                    ? pathname === '/admin/dashboard'
                    : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${isActive
                        ? 'bg-primary/10 text-white'
                        : 'hover:text-white hover:bg-zinc-900'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(var(--primary),0.5)]" />
                      )}
                      <Icon className={`h-5 w-5 transition-all ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
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
      <div className="p-6 mt-auto border-t border-zinc-900 bg-zinc-950/50">
        <div className="mb-4">
          <button className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-zinc-900 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-all border border-zinc-700">
              <Settings className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-zinc-300">System Settings</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Configuration</p>
            </div>
          </button>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all group h-12 font-black uppercase tracking-tighter rounded-xl"
        >
          <LogOut className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-1" />
          Terminate Session
        </Button>
      </div>
    </div>
  );
}

import { authClient } from '@/lib/auth/auth-client';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const currentTitle = navItems.find((item) => pathname?.startsWith(item.href))?.title || 'Admin Overview';

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#09090B] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-zinc-950 border-r border-zinc-900 flex flex-col hidden lg:flex shrink-0 shadow-2xl relative z-40">
        <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md shadow-xl border border-zinc-200">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 border-r-0 bg-zinc-950">
          <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-background">
        {/* Modern Header */}
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b flex items-center justify-between px-8 md:px-12 z-30 sticky top-0 border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-6">
            {/* Breadcrumb navigation - visible on desktop */}
            <div className="hidden lg:flex items-center gap-2 text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Root</span>
              <ChevronRight className="h-3 w-3 opacity-20" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{currentTitle}</span>
            </div>
            {/* Mobile title - visible on small screens, also visible for tests */}
            <h1 className="text-xl font-bold tracking-tight lg:hidden">{currentTitle}</h1>
            {/* Desktop heading - hidden visually but present for SEO/tests */}
            <h1 className="sr-only">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl text-zinc-400 group hover:ring-2 hover:ring-primary/20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-text">
              <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium pr-10">Search records...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-4 pl-2 cursor-pointer group">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-black tracking-tight leading-none group-hover:text-primary transition-colors">{user.name || 'Admin'}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Super Admin</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-xl group-hover:scale-105 transition-transform border-4 border-background outline outline-1 outline-zinc-200 dark:outline-zinc-800">
                      {(user.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-2">
                  <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-zinc-400 px-3 py-2">Account Management</DropdownMenuLabel>
                  <DropdownMenuItem className="rounded-xl h-10 font-bold cursor-pointer">Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-10 font-bold cursor-pointer">Security Center</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-10 font-bold cursor-pointer">Billing & Tiers</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-10 font-bold cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10">
                    Logout System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-[#09090B] relative scroll-smooth">
          {/* Subtle Decorative Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

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
