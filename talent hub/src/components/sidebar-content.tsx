'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent as SidebarContentWrapper,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { useUserRole } from '@/hooks/use-user-role';
import {
  LayoutGrid,
  FileText,
  Users,
  Target,
  ClipboardCheck,
  HeartHandshake,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


const applicantLinks = [
  { href: '/dashboard/resume-screening', label: 'Resume Screening', icon: FileText },
  { href: '/dashboard/skill-gap-analysis', label: 'Skill Gap Analysis', icon: Target },
  { href: '/dashboard/wellness', label: 'Wellness', icon: HeartHandshake },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const recruiterLinks = [
  { href: '/dashboard/talent-sourcing', label: 'Talent Sourcing', icon: Users },
  { href: '/dashboard/appraisal', label: 'Appraisal', icon: ClipboardCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setIsAuthenticated } = useUserRole();
  const links = role === 'applicant' ? applicantLinks : recruiterLinks;
  const { toast } = useToast();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      router.push('/login');
       toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was an issue logging you out. Please try again.',
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            TalentHub
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContentWrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip="Dashboard">
              <Link href="/dashboard">
                <LayoutGrid />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContentWrapper>
      <SidebarFooter>
        <div className="group-data-[collapsible=icon]:hidden">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
           <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
           </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
