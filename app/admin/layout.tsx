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
      <div className="h-16 flex items-center px-6 border-b-2 border-zinc-950">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 border-2 border-zinc-950 bg-indigo-600 flex items-center justify-center text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-heading font-black text-zinc-950 uppercase tracking-tight text-sm">VMS_ADMIN</span>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-bold transition-all border-2 border-transparent ${
                  isActive
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-200'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t-2 border-zinc-950 bg-zinc-50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-950 hover:text-white hover:bg-red-600 border-2 border-transparent hover:border-red-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none h-10 text-sm font-bold uppercase tracking-wider"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Terminate Session
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
      <aside className="w-64 border-r-2 border-zinc-950 flex flex-col hidden lg:flex shrink-0 bg-white">
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
        <header className="h-16 bg-white border-b-2 border-zinc-950 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-zinc-500 font-mono">
              <span>ADMIN_ROOT</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-950 font-bold uppercase tracking-widest">{currentTitle}</span>
            </div>
            <h1 className="text-lg font-black font-heading lg:hidden uppercase">{currentTitle}</h1>
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
                <Button variant="outline" size="icon" className="relative rounded-none h-10 w-10 border-2 border-zinc-950 bg-white hover:bg-zinc-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Bell className="h-4 w-4 text-zinc-950" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 border-2 border-white rounded-none" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-2 border-zinc-950 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
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
                  <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-zinc-100 p-1 pr-2 rounded-none transition-all border-2 border-transparent hover:border-zinc-950 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-bold text-zinc-950 uppercase leading-none">{user.name || 'Admin'}</p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-widest">Administrator</p>
                    </div>
                    <div className="h-8 w-8 border-2 border-zinc-950 bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none">
                      {(user.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-950 hidden sm:block" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-2 border-zinc-950 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
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
