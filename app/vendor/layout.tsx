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
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { title: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { title: 'Opportunities', href: '/vendor/proposals', icon: Briefcase },
  { title: 'My Submissions', href: '/vendor/proposals/submissions', icon: FileText },
  { title: 'Profile', href: '/vendor/profile', icon: User },
  { title: 'Documents', href: '/vendor/documents', icon: FileText },
  { title: 'Certificate', href: '/vendor/certificate', icon: Award },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' },
  APPROVED_LOGIN: { label: 'Access Enabled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' },
  DOCUMENTS_SUBMITTED: { label: 'Documents Submitted', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' },
  APPROVED: { label: 'Verified', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' },
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notifications, unreadCount } = useNotificationStore();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Initialize real-time notifications
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
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/vendor/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white text-sm">Vendor Portal</span>
        </Link>
      </div>

      {vendor && status && (
        <div className="px-4 py-3 border-b border-border">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors h-10 text-sm font-medium"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <aside className="w-64 border-r border-border flex flex-col hidden lg:flex shrink-0 bg-background">
        <SidebarContent />
      </aside>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="bg-white shadow-sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-background border-r border-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-zinc-600">
              <span>Vendor</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-900 dark:text-white font-medium">{currentTitle}</span>
            </div>
            <h1 className="text-lg font-semibold lg:hidden">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg text-muted-foreground w-64">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-lg h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white shadow-lg border-zinc-200 z-50">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem key={notif._id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <div className="flex items-center gap-2 w-full">
                        <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-zinc-300' : 'bg-blue-500'}`} />
                        <span className="font-medium text-sm truncate">{notif.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full">{notif.message}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
              <HelpCircle className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 pl-2 cursor-pointer">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white leading-none truncate max-w-[150px]">
                        {vendor?.companyName || user.name || 'Vendor'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">Vendor</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                      {(vendor?.contactPerson?.[0] || user.name?.[0] || 'V').toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-500 hidden sm:block" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border-zinc-200 z-50">
                  <DropdownMenuLabel className="font-normal font-sans">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{vendor?.companyName || user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/vendor/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/vendor/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background text-foreground">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
