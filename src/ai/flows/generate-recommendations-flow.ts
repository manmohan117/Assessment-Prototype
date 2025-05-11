'use server';
/**
 * @fileOverview Generates recommendations for assessment areas.
 *
 * - generateRecommendations - A function that provides recommendations based on assessment questions and scores.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionScoreSchema = z.object({
  question: z.string().describe('The text of the assessment question.'),
  score: z.number().describe('The score achieved for this question (typically out of 10).'),
});
export type QuestionScore = z.infer<typeof QuestionScoreSchema>;

const GenerateRecommendationsInputSchema = z.object({
  assessmentAreaName: z.string().describe('The name of the assessment area.'),
  questionsAndScores: z.array(QuestionScoreSchema).describe('An array of questions and their corresponding scores for the assessment area.'),
  averageScore: z.number().describe('The average score for the assessment area.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const RecommendationItemSchema = z.object({
  question: z.string().describe('The original question text.'),
  score: z.number().describe('The original score for this question.'),
  recommendationText: z.string().describe('Specific recommendation for this question. If performance is satisfactory, this must state so explicitly (e.g., "Performance is satisfactory." or "No specific recommendation needed at this score."). It should not be an empty string.'),
});
export type RecommendationItem = z.infer<typeof RecommendationItemSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  overallComment: z.string().describe('A brief overall comment about the assessment area based on its average score. This will be displayed before individual question recommendations.'),
  recommendations: z.array(RecommendationItemSchema).describe('An array of recommendations, one for each input question.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an expert educational consultant. Your task is to provide feedback and actionable recommendations for an assessment area based on individual question scores and the overall average score for that area.

Assessment Area: {{assessmentAreaName}}
Average Score for this Area: {{averageScore}} / 10

Questions and Scores:
{{#each questionsAndScores}}
- Question: "{{this.question}}"
  Score: "{{this.score}} / 10
{{/each}}

Instructions:
1.  First, provide an 'overallComment' based on the 'averageScore' for the '{{assessmentAreaName}}' area.
    - If averageScore is less than 4: Indicate that this area needs significant attention and improvement. Be empathetic but clear.
    - If averageScore is between 4 (inclusive) and 7 (exclusive): Suggest that while there's a basic understanding, there are clear areas for growth and consolidation.
    - If averageScore is 7 or above: Acknowledge good performance and suggest maintaining this level or exploring advanced topics if applicable.
2.  Then, for each question in 'questionsAndScores', provide a 'recommendationText' in the 'recommendations' array.
    - For questions with a score less than 4: Provide a specific, actionable recommendation to improve understanding or performance related to that question. Focus on foundational concepts, suggest resources, or identify common pitfalls.
    - For questions with a score between 4 (inclusive) and 7 (exclusive): Provide a suggestion for reinforcement, targeted practice, or deeper exploration of the topic to solidify understanding.
    - For questions with a score of 7 or above: State "Performance is satisfactory for this question. Focus on maintaining this understanding." or a similar positive remark. The recommendationText must not be empty.
3.  Ensure your recommendations are constructive, concise, and directly related to the question content where possible.
4.  You MUST generate a 'recommendationText' for EVERY question provided in the input.
5.  Match the output format precisely as defined by the output schema, including the 'overallComment' and the 'recommendations' array with 'question', 'score', and 'recommendationText' for each item.
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to generate recommendations. The AI model did not return a valid output.");
    }
    // Ensure all questions have recommendations
    if (output.recommendations.length !== input.questionsAndScores.length) {
        throw new Error("Mismatch between input questions and output recommendations count.");
    }
    output.recommendations.forEach(rec => {
        if (!rec.recommendationText || rec.recommendationText.trim() === "") {
            // This case should be prevented by the prompt, but as a fallback:
            rec.recommendationText = "No specific recommendation generated.";
        }
    });
    return output;
  }
);
