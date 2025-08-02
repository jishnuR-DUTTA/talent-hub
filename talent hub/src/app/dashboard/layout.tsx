'use client';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { useUserRole } from '@/hooks/use-user-role';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function AppSkeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <AppSkeleton />;
  }

  return <AppLayout>{children}</AppLayout>;
}
