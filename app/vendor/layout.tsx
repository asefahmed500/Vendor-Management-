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
  HelpCircle,
  ChevronDown,
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
import { authClient } from '@/lib/auth/auth-client';
import { useNotificationStore } from '@/lib/stores/useNotificationStore';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

const navItems = [
  { title: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { title: 'Opportunities', href: '/vendor/proposals', icon: Briefcase },
  { title: 'My Submissions', href: '/vendor/proposals/submissions', icon: FileText },
  { title: 'Profile', href: '/vendor/profile', icon: User },
  { title: 'Documents', href: '/vendor/documents', icon: FileText },
  { title: 'Certificate', href: '/vendor/certificate', icon: Award },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  APPROVED_LOGIN: { label: 'Access Enabled', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  DOCUMENTS_SUBMITTED: { label: 'Documents Submitted', color: 'bg-zinc-50 text-zinc-600 border-zinc-100' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  APPROVED: { label: 'Verified', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  REJECTED: { label: 'Rejected', color: 'bg-red-50 text-red-600 border-red-100' },
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notifications, unreadCount } = useNotificationStore();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useRealtimeNotifications(user?.id);

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

  const currentTitle = navItems.find((item) => pathname?.startsWith(item.href))?.title || 'Dashboard';
  const status = vendor ? statusConfig[vendor.status] : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-zinc-950">
      <div className="h-20 flex items-center px-8 border-b border-zinc-100">
        <Link href="/vendor/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-300">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-zinc-950 tracking-tight text-lg">ShieldPlus</span>
        </Link>
      </div>

      <div className="px-6 py-8">
        {vendor && status && (
          <div className="mb-8 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Vendor Status</p>
            <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${status.color}`}>
              {status.label}
            </Badge>
          </div>
        )}

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-100">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12 text-sm font-bold transition-all"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Terminate Session
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50/50 overflow-hidden text-zinc-950 font-body">
      <aside className="w-72 border-r border-zinc-200 flex flex-col hidden lg:flex shrink-0 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-white border-r border-zinc-200">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-8 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-zinc-100">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            <div className="hidden lg:flex items-center gap-3">
              <Badge variant="outline" className="rounded-full bg-zinc-100 text-zinc-500 border-none font-bold text-[10px] tracking-widest uppercase px-3">
                Partner Node
              </Badge>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
              <h1 className="text-sm font-bold text-zinc-950 uppercase tracking-widest">{currentTitle}</h1>
            </div>
            <h1 className="text-lg font-bold font-heading lg:hidden">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-2xl text-zinc-400 w-72 focus-within:ring-2 focus-within:ring-zinc-100 focus-within:bg-white transition-all">
              <Search className="h-4 w-4" />
              <input type="text" placeholder="Search registry..." className="bg-transparent border-none outline-none text-sm font-medium w-full text-zinc-900 placeholder:text-zinc-400" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-2xl h-11 w-11 border-zinc-200 bg-white hover:bg-zinc-50 transition-all shadow-sm">
                  <Bell className="h-5 w-5 text-zinc-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-zinc-950 border-2 border-white rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-[1.5rem] border-zinc-200 shadow-2xl p-2 z-50">
                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-[10px] bg-zinc-100 text-zinc-900 border-none rounded-full px-2">{unreadCount} New</Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <div className="max-h-[350px] overflow-y-auto py-2">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400 font-medium">
                      Archive is empty
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <DropdownMenuItem key={notif._id} className="flex flex-col items-start gap-1 p-4 cursor-pointer rounded-xl hover:bg-zinc-50 focus:bg-zinc-50 transition-colors mx-1">
                        <div className="flex items-center gap-3 w-full">
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-zinc-950 shrink-0" />}
                          <span className="font-bold text-sm text-zinc-900">{notif.title}</span>
                        </div>
                        <span className="text-xs text-zinc-500 line-clamp-1 ml-5">{notif.message}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-8 w-px bg-zinc-100 mx-2 hidden sm:block" />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-bold text-zinc-950 leading-none truncate max-w-[150px]">
                        {vendor?.companyName || user.name || 'Vendor'}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-bold uppercase tracking-widest">Authorized Entity</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-zinc-950 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-zinc-200 transition-transform group-hover:scale-105 duration-300">
                      {(vendor?.contactPerson?.[0] || user.name?.[0] || 'V').toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] border-zinc-200 shadow-2xl p-2 z-50">
                  <DropdownMenuLabel className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-zinc-950">{vendor?.companyName || user.name}</p>
                      <p className="text-xs font-medium text-zinc-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-100" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-3 hover:bg-zinc-50 focus:bg-zinc-50 transition-colors mx-1">
                    <Link href="/vendor/profile" className="flex items-center gap-3">
                      <User className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-bold">Dossier</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-3 hover:bg-zinc-50 focus:bg-zinc-50 transition-colors mx-1">
                    <Link href="/vendor/settings" className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-bold">Preferences</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-100" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer p-3 text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors mx-1 gap-3">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-bold">Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-zinc-50/50 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
