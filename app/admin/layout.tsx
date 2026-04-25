'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Briefcase,
  LogOut,
  Building2,
  Menu,
  ChevronRight,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  History,
  Shield,
  Zap,
  Globe,
  Plus
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
import { authClient } from '@/lib/auth/auth-client';
import { useNotificationStore } from '@/lib/stores/useNotificationStore';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { toast } from 'sonner';

const navItems = [
  { title: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vendors', href: '/admin/vendors', icon: Users },
  { title: 'Proposals', href: '/admin/proposals', icon: Briefcase },
  { title: 'Compliance', href: '/admin/documents', icon: ShieldCheck },
  { title: 'Directories', href: '/admin/document-types', icon: FileText },
  { title: 'Security Logs', href: '/admin/audit-logs', icon: History },
  { title: 'Intelligence', href: '/admin/analytics', icon: BarChart3 },
];

function SidebarContent({ pathname, setMobileMenuOpen, handleLogout }: {
  pathname: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-100 font-body">
      <div className="h-20 flex items-center px-8 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-200 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-zinc-950 font-heading">ShieldPlus</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest -mt-1">Control Hub</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="px-4 mb-6">
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Core Management</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] text-sm font-bold transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-950'}`} />
                <span>{item.title}</span>
                {isActive && (
                  <div className="absolute right-0 top-0 h-full w-1 bg-white/20" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-12 px-4 mb-6">
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Global Network</p>
        </div>
        <div className="space-y-2">
           <Link href="/admin/create-vendor" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] text-sm font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 transition-all group">
             <div className="h-5 w-5 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-white transition-colors">
               <Plus className="h-3 w-3" />
             </div>
             <span>Deploy Vendor</span>
           </Link>
        </div>
      </ScrollArea>

      <div className="p-6 mt-auto">
        <div className="bg-zinc-50 rounded-[1.5rem] p-5 border border-zinc-100 mb-6 group cursor-pointer hover:bg-zinc-100 transition-all">
           <div className="flex items-center gap-3 mb-3">
             <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
               <Globe className="h-4 w-4 text-zinc-950" />
             </div>
             <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest">Global Status</p>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">All Systems Operational</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start h-14 rounded-[1.25rem] text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-bold px-5"
        >
          <LogOut className="h-5 w-5 mr-4" />
          Terminate Session
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notifications, unreadCount } = useNotificationStore();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useRealtimeNotifications(user?.id);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const currentItem = navItems.find((item) => pathname?.startsWith(item.href));
  const currentTitle = currentItem?.title || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-zinc-950 overflow-hidden font-body">
      <aside className="w-80 flex flex-col hidden lg:flex shrink-0">
        <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
      </aside>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white border-r border-zinc-100">
          <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100">
                <Menu className="h-5 w-5 text-zinc-500" />
              </Button>
            </SheetTrigger>
            
            <div className="hidden lg:flex items-center gap-3">
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full">
                Admin Console
              </Badge>
              <ChevronRight className="h-4 w-4 text-zinc-300" />
              <span className="text-lg font-bold text-zinc-950 font-heading tracking-tight">
                {currentTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-zinc-50 px-5 py-3 rounded-2xl border border-zinc-100 w-80 group focus-within:bg-white focus-within:border-zinc-300 transition-all focus-within:shadow-xl focus-within:shadow-zinc-200/50">
              <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
              <input 
                type="text" 
                placeholder="Secure search..." 
                className="bg-transparent border-none outline-none text-sm font-bold placeholder:text-zinc-400 w-full text-zinc-950"
              />
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                    <Bell className="h-5 w-5 text-zinc-500 group-hover:text-zinc-950 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 rounded-[2rem] bg-white border border-zinc-100 shadow-2xl p-2 z-50 mt-4 overflow-hidden">
                  <div className="bg-zinc-950 p-6 text-white mb-2 rounded-t-[1.5rem]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Alerts</p>
                      {unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white border-none text-[9px] font-bold px-2 py-0.5">{unreadCount} Critical</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-heading">Notifications</h3>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center gap-4">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-50 flex items-center justify-center border border-zinc-100">
                          <Bell className="h-6 w-6 text-zinc-200" />
                       </div>
                       <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No active alerts</p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[400px]">
                      <div className="space-y-1 p-2">
                        {notifications.slice(0, 5).map((notif) => (
                          <DropdownMenuItem key={notif._id} className="flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-zinc-50 rounded-[1.25rem] mb-1 transition-all border border-transparent hover:border-zinc-100 group">
                            <div className="flex items-center gap-3 w-full">
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                              <span className="font-bold text-sm text-zinc-950 leading-tight group-hover:translate-x-1 transition-transform">{notif.title}</span>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase ml-auto">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className="text-xs font-medium text-zinc-500 pl-5 line-clamp-2 leading-relaxed">{notif.message}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-50" />
                  <DropdownMenuItem asChild className="cursor-pointer text-center justify-center py-4 rounded-b-[1.5rem] bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <Link href="/admin/notifications" className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-950">Review All Intel</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-px bg-zinc-100 mx-2 hidden sm:block" />

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-4 pl-2 pr-4 py-2 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                      <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-zinc-200 transition-transform group-hover:scale-105">
                        {(user.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-bold text-zinc-950 tracking-tight leading-none mb-1">{user.name || 'Administrator'}</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Security Level 4</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 rounded-[2rem] bg-white border border-zinc-100 shadow-2xl p-2 z-50 mt-4 overflow-hidden">
                    <div className="p-6 border-b border-zinc-50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-white text-base font-bold shadow-xl">
                          {(user.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-zinc-950">{user.name || 'Administrator'}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[140px]">{user.email}</p>
                        </div>
                      </div>
                      <Badge className="w-full bg-emerald-50 text-emerald-600 border-none font-bold uppercase tracking-widest text-[9px] py-1.5 justify-center rounded-xl shadow-sm">Verified Operator</Badge>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-3.5 focus:bg-zinc-50 group">
                        <Link href="/admin/profile" className="flex items-center w-full">
                          <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mr-4 group-hover:bg-white transition-colors">
                            <Settings className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-950">Settings</span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Control Panel</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-3.5 focus:bg-zinc-50 group">
                        <Link href="/admin/audit-logs" className="flex items-center w-full">
                          <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mr-4 group-hover:bg-white transition-colors">
                            <History className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-950">Activity Log</span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Session History</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-zinc-50" />
                    
                    <div className="p-2">
                      <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer p-3.5 text-red-600 focus:bg-red-50 focus:text-red-600 group">
                        <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100/50 flex items-center justify-center mr-4 group-hover:bg-white transition-colors">
                          <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">Log out</span>
                          <span className="text-[9px] font-bold text-red-400/80 uppercase tracking-widest mt-0.5">End Encryption</span>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1600px] mx-auto p-8 lg:p-12 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
