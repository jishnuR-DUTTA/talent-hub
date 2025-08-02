'use server';
/**
 * @fileOverview An AI agent that analyzes a resume for skill gaps against a target role.
 *
 * - analyzeSkillGaps - A function that handles the skill gap analysis.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeSkillGapsInputSchema,
  AnalyzeSkillGapsOutputSchema,
  type AnalyzeSkillGapsInput,
  type AnalyzeSkillGapsOutput,
} from '@/ai/schemas/skill-gap-analyzer-schemas';

export async function analyzeSkillGaps(
  input: AnalyzeSkillGapsInput
): Promise<AnalyzeSkillGapsOutput> {
  return skillGapAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: AnalyzeSkillGapsInputSchema},
  output: {schema: AnalyzeSkillGapsOutputSchema},
  prompt: `You are an expert HR analyst. Your task is to perform a skill gap analysis based on a user's resume and their target job role.

Analyze the resume provided and compare the user's skills against the typical requirements for the specified target role.

1.  **Analysis (for Radar Chart):** Identify 5-7 key skills relevant to the role. For each skill, provide an estimated score for the user's current level ('your') and the level required for the role ('required'). Scores must be between 0 and 100.
2.  **Recommendations:** Based on the most significant gaps, provide 2-3 specific, actionable recommendations for the user to improve their skills.
3.  **Score:** Provide an overall score (0-100) indicating how well the resume matches the target role.

Target Role: {{{targetRole}}}
Resume: {{media url=resumeDataUri}}`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: AnalyzeSkillGapsInputSchema,
    outputSchema: AnalyzeSkillGapsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
