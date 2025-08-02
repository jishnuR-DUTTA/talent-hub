'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeAppraisalFeedback,
  type AnalyzeAppraisalFeedbackOutput,
} from '@/ai/flows/appraisal-feedback-analyzer';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ClipboardCheck,
  Loader2,
  Wand2,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

const formSchema = z.object({
  employeeName: z.string().min(1, { message: 'Please select an employee.' }),
  jobTitle: z.string().min(2, { message: 'Job title is required.' }),
  feedbackText: z
    .string()
    .min(50, { message: 'Feedback must be at least 50 characters.' })
    .max(5000, { message: 'Feedback must not exceed 5000 characters.' }),
});

export default function AppraisalPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeAppraisalFeedbackOutput | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: '',
      jobTitle: '',
      feedbackText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeAppraisalFeedback({
        employeeName: values.employeeName,
        jobTitle: values.jobTitle,
        feedbackText: values.feedbackText,
      });
      setAnalysis(result);
      toast({
        title: 'Analysis Complete',
        description: 'AI insights have been generated successfully.',
      });
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'There was a problem analyzing the feedback. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setAnalysis(null);
    form.reset();
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Appraisal Analysis
          </h1>
          <p className="text-muted-foreground">
            Generate intelligent insights from performance feedback.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback for Analysis</CardTitle>
            <CardDescription>
              Fill out the details below to generate AI-powered insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                          <SelectItem value="Sam Wilson">Sam Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="feedbackText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback / Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Exceeded expectations in Q2, great leadership skills..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Analyze Feedback
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          {isLoading && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Analyzing Feedback...</CardTitle>
                <CardDescription>
                  Our AI is generating insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 text-center p-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">This may take a moment.</p>
              </CardContent>
            </Card>
          )}
          {analysis && (
            <Card className="w-full animate-in fade-in-50">
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
                <CardDescription>
                  Insights generated from the feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="flex items-center font-semibold text-sm">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {analysis.summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="flex items-center font-semibold text-sm">
                    <Lightbulb className="mr-2 h-4 w-4 text-primary" />
                    Key Insights
                  </h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {analysis.keyInsights}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="flex items-center font-semibold text-sm">
                    <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                    Recommendations
                  </h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {analysis.recommendations}
                  </p>
                </div>
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
          )}
          {!isLoading && !analysis && (
            <Card className="w-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full p-10 text-center">
                <div className="mb-4 rounded-full border border-dashed p-4">
                  <Wand2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">
                  Your analysis will appear here
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill out the form to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
