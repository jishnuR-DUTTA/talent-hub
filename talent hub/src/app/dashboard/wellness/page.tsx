'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getWellbeingSuggestion } from '@/ai/flows/wellbeing-suggestion-assistant';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { HeartHandshake, Loader2, Sparkles, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  mood: z.string().min(2, 'Please describe your mood.').max(50),
  recentActivities: z.string().optional(),
});

export default function WellnessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      recentActivities: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);

    try {
      const response = await getWellbeingSuggestion({
        mood: values.mood,
        recentActivities: values.recentActivities,
      });
      setSuggestion(response.suggestion);
    } catch (error) {
      console.error('Error getting suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'There was a problem getting a suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <HeartHandshake className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Wellness Assistant
          </h1>
          <p className="text-muted-foreground">
            Get a personalized suggestion to improve your well-being.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>
              Share your mood and recent activities to get a tip from our AI
              assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Stressed, Happy, Tired" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recentActivities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recent Activities (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Worked on a big project, went for a walk, watched a movie"
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
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get Suggestion
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
            <Card className="w-full h-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full p-10 text-center">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <h3 className="text-lg font-medium">Generating your tip...</h3>
                            <p className="text-sm text-muted-foreground">Our AI is thinking.</p>
                        </>
                    ) : suggestion ? (
                        <div className="animate-in fade-in-50">
                            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Here's a tip for you:</h3>
                            <p className="text-muted-foreground">{suggestion}</p>
                        </div>
                    ) : (
                        <>
                             <div className="mb-4 rounded-full border border-dashed p-4">
                                <Lightbulb className="h-10 w-10 text-muted-foreground" />
                             </div>
                             <h3 className="text-lg font-medium">Your suggestion will appear here</h3>
                             <p className="text-sm text-muted-foreground">Tell us how you feel to get a tip.</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
