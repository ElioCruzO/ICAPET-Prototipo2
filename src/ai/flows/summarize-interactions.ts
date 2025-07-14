'use server';

/**
 * @fileOverview Summarizes interaction histories for a contact.
 *
 * - summarizeInteractions - A function that summarizes the interactions history.
 * - SummarizeInteractionsInput - The input type for the summarizeInteractions function.
 * - SummarizeInteractionsOutput - The return type for the summarizeInteractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInteractionsInputSchema = z.object({
  interactions: z
    .string()
    .describe('A string containing the interaction history with a contact.'),
});

export type SummarizeInteractionsInput = z.infer<typeof SummarizeInteractionsInputSchema>;

const SummarizeInteractionsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the interaction history, highlighting key discussion points and agreed-upon actions.'),
});

export type SummarizeInteractionsOutput = z.infer<typeof SummarizeInteractionsOutputSchema>;

export async function summarizeInteractions(input: SummarizeInteractionsInput): Promise<SummarizeInteractionsOutput> {
  return summarizeInteractionsFlow(input);
}

const summarizeInteractionsPrompt = ai.definePrompt({
  name: 'summarizeInteractionsPrompt',
  input: {schema: SummarizeInteractionsInputSchema},
  output: {schema: SummarizeInteractionsOutputSchema},
  prompt: `You are an AI assistant that summarizes interaction histories between a user and a contact.

  Given the following interaction history, please provide a concise summary highlighting the key discussion points and any agreed-upon actions:

  Interaction History:
  {{interactions}}
  `,
});

const summarizeInteractionsFlow = ai.defineFlow(
  {
    name: 'summarizeInteractionsFlow',
    inputSchema: SummarizeInteractionsInputSchema,
    outputSchema: SummarizeInteractionsOutputSchema,
  },
  async input => {
    const {output} = await summarizeInteractionsPrompt(input);
    return output!;
  }
);
