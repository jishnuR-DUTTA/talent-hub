/**
 * @fileOverview Zod schemas and TypeScript types for the skill gap analysis flow.
 */
import {z} from 'genkit';

export const AnalyzeSkillGapsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The user's resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetRole: z.string().describe('The target job role for the analysis.'),
});
export type AnalyzeSkillGapsInput = z.infer<typeof AnalyzeSkillGapsInputSchema>;


const SkillSchema = z.object({
    subject: z.string().describe("The name of the skill, e.g., 'React' or 'Communication'."),
    your: z.number().min(0).max(100).describe("The user's current skill level (0-100)."),
    required: z.number().min(0).max(100).describe("The required skill level for the role (0-100)."),
    fullMark: z.literal(100),
});

const RecommendationSchema = z.object({
    skill: z.string().describe("The skill area for the recommendation."),
    recommendation: z.string().describe("A specific, actionable recommendation for improvement."),
});


export const AnalyzeSkillGapsOutputSchema = z.object({
  analysis: z.array(SkillSchema).describe('An array of skill objects for the radar chart.'),
  recommendations: z.array(RecommendationSchema).describe('An array of personalized recommendations to bridge skill gaps.'),
  score: z.number().min(0).max(100).describe("A score from 0-100 representing the resume's overall fit for the role."),
});
export type AnalyzeSkillGapsOutput = z.infer<typeof AnalyzeSkillGapsOutputSchema>;
