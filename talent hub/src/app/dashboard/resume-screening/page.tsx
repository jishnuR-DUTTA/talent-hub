'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { rateResume } from '@/ai/flows/rate-resume';
import { fileToDataUri } from '@/lib/utils';
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Wand2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_CERT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const formSchema = z.object({
  jobField: z.string().min(1, 'Please select a job field.'),
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
  certificates: z
    .custom<FileList>()
    .refine(
      (files) =>
        !files || Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files ||
        Array.from(files).every((file) =>
          ACCEPTED_CERT_TYPES.includes(file.type)
        ),
      '.pdf, .png, and .jpeg files are accepted.'
    )
    .optional(),
  workExperience: z
    .string()
    .min(50, 'Please provide at least 50 characters of experience.')
    .max(2000),
});

type ResumeScoreResult = {
  score: number;
  aiComments: string;
  jobField: string;
};

export default function ResumeScreeningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeScoreResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobField: '',
      workExperience: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const resumeDataUri = await fileToDataUri(values.resume[0]);
      
      let certificatesDataUris: string[] = [];
      if (values.certificates && values.certificates.length > 0) {
        certificatesDataUris = await Promise.all(
          Array.from(values.certificates).map((file) => fileToDataUri(file))
        );
      }

      const response = await rateResume({
        jobField: values.jobField,
        resumeDataUri,
        certificatesDataUris,
        workExperience: values.workExperience,
      });

      setResult({ ...response, jobField: values.jobField });
    } catch (error) {
      console.error('Error rating resume:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'There was a problem rating your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Resume Screening
          </h1>
          <p className="text-muted-foreground">
            Get an instant score on your resume for your desired job field.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Profile</CardTitle>
            <CardDescription>
              Upload your documents and get rated by our AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select your preferred job field</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="e.g., Web Development" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Data Science">
                            Data Science
                          </SelectItem>
                          <SelectItem value="Web Development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
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
                      <FormLabel>Upload Resume (.pdf, .docx)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certificates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Upload Certificates (Optional, .pdf, .png)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpeg"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your relevant work experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe past projects, job roles, or freelance work..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Rate My Resume
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          {isLoading && (
             <Card className="w-full">
              <CardHeader>
                <CardTitle>Analyzing...</CardTitle>
                <CardDescription>Our AI is reviewing your profile.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">This may take a moment.</p>
              </CardContent>
            </Card>
          )}
          {result && (
            <Card className="w-full animate-in fade-in-50">
              <CardHeader>
                <CardTitle>Your Resume Score</CardTitle>
                <CardDescription>
                  For the field of <strong>{result.jobField}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary">{result.score}%</p>
                </div>
                <Progress value={result.score} className="w-full" />
                <div>
                  <h4 className="font-semibold mb-2">AI Comments:</h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {result.aiComments}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                    Rate Another Resume
                 </Button>
              </CardFooter>
            </Card>
          )}
          {!isLoading && !result && (
             <Card className="w-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full p-10 text-center">
                 <div className="mb-4 rounded-full border border-dashed p-4">
                  <Wand2 className="h-10 w-10 text-muted-foreground" />
                 </div>
                 <h3 className="text-lg font-medium">Your score will appear here</h3>
                 <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
