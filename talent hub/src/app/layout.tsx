'use client';

import './globals.css';
import { UserRoleProvider } from '@/contexts/user-role-context';
import { useUserRole } from '@/hooks/use-user-role';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function AppBody({ children }: { children: React.ReactNode }) {
  const { role } = useUserRole();
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove('applicant-theme', 'recruiter-theme');
    if (pathname !== '/login' && pathname !== '/signup') {
      document.body.classList.add(
        role === 'applicant' ? 'applicant-theme' : 'recruiter-theme'
      );
    }
  }, [role, pathname]);

  return (
    <body
      className={cn(
        'min-h-screen bg-background font-body antialiased',
      )}
    >
      {children}
      <Toaster />
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TalentHub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <UserRoleProvider>
        <AppBody>{children}</AppBody>
      </UserRoleProvider>
    </html>
  );
}
