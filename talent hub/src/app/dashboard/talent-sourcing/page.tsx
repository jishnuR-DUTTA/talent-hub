'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Users, Download, Linkedin, Github } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const candidates = [
  {
    name: 'Elena Rodriguez',
    role: 'Senior Data Scientist',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    linkedin: '#',
    github: '#',
    experience: 5,
    score: 95,
  },
  {
    name: 'Ben Carter',
    role: 'Lead Frontend Developer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    linkedin: '#',
    github: '#',
    experience: 7,
    score: 92,
  },
  {
    name: 'Aisha Khan',
    role: 'UX/UI Design Lead',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    linkedin: '#',
    github: '#',
    experience: 6,
    score: 88,
  },
  {
    name: 'Marcus Chen',
    role: 'DevOps Engineer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man glasses',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    linkedin: '#',
    github: '#',
    experience: 4,
    score: 85,
  },
   {
    name: 'Sophia Loren',
    role: 'Senior Data Scientist',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman professional',
    skills: ['Python', 'PyTorch', 'Scikit-learn', 'BigQuery'],
    linkedin: '#',
    github: '#',
    experience: 6,
    score: 98,
  },
   {
    name: 'James Sullivan',
    role: 'Lead Frontend Developer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man professional',
    skills: ['Vue.js', 'TypeScript', 'Nuxt.js', 'Jest'],
    linkedin: '#',
    github: '#',
    experience: 8,
    score: 90,
  },
];

export default function TalentSourcingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState(0);
  const [scoreFilter, setScoreFilter] = useState(0);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.role.toLowerCase().includes(searchLower) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        );

      const matchesRole =
        roleFilter === 'all' || candidate.role === roleFilter;

      const matchesExperience = candidate.experience >= experienceFilter;
      const matchesScore = candidate.score >= scoreFilter;

      return matchesSearch && matchesRole && matchesExperience && matchesScore;
    });
  }, [searchTerm, roleFilter, experienceFilter, scoreFilter]);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Talent Sourcing
          </h1>
          <p className="text-muted-foreground">
            Find the perfect candidates for your open roles.
          </p>
        </div>
      </div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative md:col-span-2 lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for candidates by name, skills, role, etc..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Senior Data Scientist">Senior Data Scientist</SelectItem>
                  <SelectItem value="Lead Frontend Developer">Lead Frontend Developer</SelectItem>
                  <SelectItem value="UX/UI Design Lead">UX/UI Design Lead</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="experience">Min. Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g., 5"
                value={experienceFilter || ''}
                onChange={(e) => setExperienceFilter(Number(e.target.value))}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="score">Min. Resume Score</Label>
              <Input
                id="score"
                type="number"
                placeholder="e.g., 80"
                value={scoreFilter || ''}
                onChange={(e) => setScoreFilter(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.name}>
            <CardHeader className="flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage asChild src={candidate.avatar}>
                  <Image
                    src={candidate.avatar}
                    alt={candidate.name}
                    width={64}
                    height={64}
                    data-ai-hint={candidate.dataAiHint}
                  />
                </AvatarImage>
                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.name}</CardTitle>
                <CardDescription>{candidate.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
               <div className="mb-4 flex justify-around text-center text-sm">
                  <div>
                    <p className="font-bold text-lg">{candidate.experience}</p>
                    <p className="text-muted-foreground">Years</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{candidate.score}%</p>
                    <p className="text-muted-foreground">Score</p>
                  </div>
                </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredCandidates.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
              <p>No candidates match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
