'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user spending habits and providing insights.
 *
 * - analyzeSpendingHabits - A function that takes expenditure data and returns spending insights.
 * - SpendingInsightsInput - The input type for the analyzeSpendingHabits function.
 * - SpendingInsightsOutput - The return type for the analyzeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  expenditures: z.array(
    z.object({
      expenditureName: z.string().describe('The name of the expenditure.'),
      amount: z.number().describe('The amount spent on the expenditure.'),
      category: z.string().describe('The category of the expenditure (e.g., food, transportation, entertainment).'),
    })
  ).describe('A list of expenditures with names, amounts, and categories.'),
});

export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s spending habits, including most frequent categories.'),
  insights: z.string().describe('Insights into potential areas for savings based on spending patterns.'),
});

export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function analyzeSpendingHabits(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return analyzeSpendingHabitsFlow(input);
}

const analyzeSpendingHabitsPrompt = ai.definePrompt({
  name: 'analyzeSpendingHabitsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following spending data and provide a summary of spending habits and insights for potential savings.

Expenditures:
{{#each expenditures}}
- {{expenditureName}}: ₹{{amount}} (Category: {{category}})
{{/each}}


Based on this data, provide:
1.  A concise summary of the user\'s spending habits, focusing on the most frequent expenditure categories.
2.  Actionable insights into potential areas where the user could save money. Suggest specific categories to reduce spending in.
`,
});

const analyzeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingHabitsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSpendingHabitsPrompt(input);
    return output!;
  }
);
