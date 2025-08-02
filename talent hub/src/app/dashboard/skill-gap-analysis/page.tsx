'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeSkillGaps,
  type AnalyzeSkillGapsOutput,
} from '@/ai/flows/skill-gap-analyzer';
import { fileToDataUri } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { Target, Library, Loader2, Wand2, RefreshCw } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Progress } from '@/components/ui/progress';

const chartConfig: ChartConfig = {
  your: {
    label: 'Your Skills',
    color: 'hsl(var(--primary))',
  },
  required: {
    label: 'Required Skills',
    color: 'hsl(var(--muted-foreground))',
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formSchema = z.object({
  targetRole: z.string().min(1, 'Please select a target role.'),
  resume: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Resume is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_RESUME_TYPES.includes(files?.[0]?.type),
      '.pdf and .docx files are accepted.'
    ),
});

export default function SkillGapAnalysisPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeSkillGapsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetRole: '',
      resume: undefined,
    },
  });

  const { setValue } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const resumeDataUri = await fileToDataUri(values.resume[0]);

      const result = await analyzeSkillGaps({
        resumeDataUri: resumeDataUri,
        targetRole: values.targetRole,
      });
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'Your skill gap analysis is ready.',
      });
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'There was a problem analyzing your skills. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    form.reset();
    setAnalysisResult(null);
  };
  
  const resumeRef = form.register("resume");

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Target className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Skill Gap Analysis
          </h1>
          <p className="text-muted-foreground">
            Upload your resume and select a target role to get AI-powered
            insights.
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-6 md:grid-cols-3"
                >
                  <FormField
                    control={form.control}
                    name="targetRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Frontend Developer">
                              Frontend Developer
                            </SelectItem>
                            <SelectItem value="Backend Developer">
                              Backend Developer
                            </SelectItem>
                            <SelectItem value="Full Stack Developer">
                              Full Stack Developer
                            </SelectItem>
                             <SelectItem value="Data Scientist">
                              Data Scientist
                            </SelectItem>
                             <SelectItem value="DevOps Engineer">
                              DevOps Engineer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Resume</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.docx"
                            {...resumeRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Analyze My Skills
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {isLoading && (
          <div className="lg:col-span-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Analyzing Your Skills...</CardTitle>
                <CardDescription>
                  Our AI is generating your skill analysis. This may take a moment.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 text-center p-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
          </div>
        )}
        
        {analysisResult && (
          <>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Skill Gap Radar</CardTitle>
                <CardDescription>
                  This chart visualizes the gap between your skills and the
                  requirements for a {form.getValues('targetRole')}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[400px]"
                >
                  <RadarChart data={analysisResult.analysis}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      dataKey="your"
                      fill="var(--color-your)"
                      fillOpacity={0.6}
                      stroke="var(--color-your)"
                    />
                    <Radar
                      dataKey="required"
                      fill="var(--color-required)"
                      fillOpacity={0.4}
                      stroke="var(--color-required)"
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  How to bridge the gap for your target role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Overall Match Score</Label>
                    <Progress value={analysisResult.score} />
                    <p className="text-sm text-center font-bold">{analysisResult.score}%</p>
                 </div>
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Library className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{rec.skill}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
               <CardFooter>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Analyze Another
                  </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {!isLoading && !analysisResult && (
           <div className="lg:col-span-3">
             <Card className="w-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full p-20 text-center">
                <div className="mb-4 rounded-full border border-dashed p-4">
                  <Wand2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">
                  Your skill analysis will appear here
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a role and upload your resume to get started.
                </p>
              </CardContent>
            </Card>
           </div>
        )}
      </div>
    </div>
  );
}
