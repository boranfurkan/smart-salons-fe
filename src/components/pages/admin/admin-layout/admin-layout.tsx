'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="h-screen bg-gray-50/50 overflow-hidden">
      <div className="flex h-full w-full">
        {/* Desktop Sidebar */}
        <div className="hidden w-[220px] lg:w-[280px] border-r bg-muted/40 md:block">
          <AdminSidebar currentPath={pathname} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[70px] lg:px-6 md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <AdminSidebar currentPath={pathname} />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <AdminHeader />
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[70px] lg:px-6 flex-shrink-0">
            <AdminHeader />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
