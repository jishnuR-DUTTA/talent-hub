"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ApplicantDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>My Resume</CardTitle>
          <CardDescription>
            Keep your resume and skills up-to-date to get the best matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Get an AI-powered score for your resume based on your desired job field.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/dashboard/resume-screening">Rate My Resume <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
          <CardDescription>
            Identify skill gaps for your target roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Compare your skills against job requirements and get recommendations.
          </p>
        </CardContent>
        <CardFooter>
           <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/skill-gap-analysis">View Analysis</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wellness Assistant</CardTitle>
          <CardDescription>
            Get personalized tips to improve your well-being.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Share your mood to receive an AI-generated suggestion for your mental and physical health.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/dashboard/wellness">Get a Tip <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
