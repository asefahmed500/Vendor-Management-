'use client';

import { type ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { ThemeToggle } from '@/components/theme-toggle';

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const navItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vendors', href: '/admin/vendors', icon: Users },
  { title: 'Onboarding', href: '/admin/create-vendor', icon: UserPlus },
  { title: 'RFPs', href: '/admin/proposals', icon: Briefcase },
  { title: 'Documents', href: '/admin/documents', icon: FileText },
  { title: 'Document Types', href: '/admin/document-types', icon: FileText },
  { title: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { title: 'Analytics', href: '/admin/analytics', icon: FileText },
];

function SidebarContent({ pathname, setMobileMenuOpen, handleLogout }: {
  pathname: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white text-sm">Vendor Management</span>
        </Link>
      </div>

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
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notifications, unreadCount } = useNotificationStore();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Initialize real-time notifications
  useRealtimeNotifications(user?.id);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const currentTitle = navItems.find((item) => pathname?.startsWith(item.href))?.title || 'Dashboard';

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border flex flex-col hidden lg:flex shrink-0 bg-background">
        <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
      </aside>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="bg-background shadow-sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-background">
          <SidebarContent pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-zinc-600">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-900 dark:text-white font-medium">{currentTitle}</span>
            </div>
            <h1 className="text-lg font-semibold lg:hidden">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg text-muted-foreground w-64">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-auto h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer text-center justify-center">
                  <Link href="/admin/notifications" className="w-full text-sm">View all notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
              <HelpCircle className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-lg transition-colors border border-transparent hover:border-border">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white leading-none">{user.name || 'Admin'}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">Administrator</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      {(user.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-600 hidden sm:block" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border-zinc-200 z-50">
                  <DropdownMenuLabel className="font-normal font-sans">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || 'Admin'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin/profile">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
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

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
