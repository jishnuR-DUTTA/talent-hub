'use client';

import { useUserRole, type UserRole } from '@/hooks/use-user-role';
import { ApplicantDashboard } from '@/components/applicant-dashboard';
import { RecruiterDashboard } from '@/components/recruiter-dashboard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

function DashboardContent({ role }: { role: UserRole }) {
  if (role === 'applicant') {
    return <ApplicantDashboard />;
  }
  return <RecruiterDashboard />;
}

export default function DashboardPage() {
  const { role } = useUserRole();

  const welcomeMessage =
    role === 'applicant'
      ? "Welcome, Applicant!"
      : "Welcome, Recruiter!";
  
  const descriptionMessage = role === 'applicant'
  ? "Here's an overview of your career profile and wellness."
  : "Here's an overview of your recruitment pipeline.";

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{welcomeMessage}</h1>
        <p className="text-muted-foreground">{descriptionMessage}</p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent role={role} />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </Card>
  )
}
