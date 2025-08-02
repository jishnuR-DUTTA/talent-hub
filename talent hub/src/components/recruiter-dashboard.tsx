"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, FileText } from "lucide-react";


const candidates = [
    { name: "Elena Rodriguez", score: 95, roleMatch: "Data Scientist", resumeLink: "#" , linkedin: "#", github: "#"},
    { name: "Ben Carter", score: 88, roleMatch: "Frontend Developer", resumeLink: "#" , linkedin: "#", github: "#"},
    { name: "Aisha Khan", score: 82, roleMatch: "UX/UI Designer", resumeLink: "#" , linkedin: "#", github: "#"},
];

const appraisals = [
  { name: "John Doe", rating: 92, notes: "Exceeded expectations in Q2." },
  { name: "Jane Smith", rating: 85, notes: "Strong performance, good team player." },
];


export function RecruiterDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Talent Sourcing</CardTitle>
          <CardDescription>Find and manage candidates.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.name}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.roleMatch}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" asChild>
                        <a href={candidate.resumeLink} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                        </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <Button asChild>
                <Link href="/dashboard/talent-sourcing">Search Talent <Search className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
            <CardTitle>AI-driven Appraisals</CardTitle>
            <CardDescription>Latest employee feedback summaries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
           <Button asChild variant="outline">
                <Link href="/dashboard/appraisal">View Appraisals <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
