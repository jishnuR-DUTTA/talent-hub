'use client';

import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarContent } from './sidebar-content';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarContent />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
