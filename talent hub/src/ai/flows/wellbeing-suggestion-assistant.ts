'use server';
/**
 * @fileOverview AI-powered wellbeing suggestion assistant.
 *
 * - getWellbeingSuggestion - A function that generates personalized well-being suggestions based on mood.
 * - WellbeingSuggestionInput - The input type for the getWellbeingSuggestion function.
 * - WellbeingSuggestionOutput - The return type for the getWellbeingSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellbeingSuggestionInputSchema = z.object({
  mood: z.string().describe('The current mood of the user.'),
  recentActivities: z
    .string()
    .describe(
      'A comma separated list of recent activities the user has participated in.'
    )
    .optional(),
});
export type WellbeingSuggestionInput = z.infer<typeof WellbeingSuggestionInputSchema>;

const WellbeingSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A personalized suggestion for improving well-being.'),
});
export type WellbeingSuggestionOutput = z.infer<typeof WellbeingSuggestionOutputSchema>;

export async function getWellbeingSuggestion(
  input: WellbeingSuggestionInput
): Promise<WellbeingSuggestionOutput> {
  return wellbeingSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellbeingSuggestionPrompt',
  input: {schema: WellbeingSuggestionInputSchema},
  output: {schema: WellbeingSuggestionOutputSchema},
  prompt: `You are a well-being assistant. You are to provide personalized suggestions for improving well-being based on the user\'s mood.

Mood: {{{mood}}}

{% if recentActivities %}
Recent activities: {{{recentActivities}}}
{% endif %}

Suggestion:`,
});

const wellbeingSuggestionFlow = ai.defineFlow(
  {
    name: 'wellbeingSuggestionFlow',
    inputSchema: WellbeingSuggestionInputSchema,
    outputSchema: WellbeingSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
