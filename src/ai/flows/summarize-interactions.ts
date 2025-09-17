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
  prompt: `Eres un asistente de IA que resume historiales de interacción entre un usuario y un contacto. El resumen debe estar en español.

  Dado el siguiente historial de interacciones, proporciona un resumen conciso destacando los puntos clave de la discusión y cualquier acción acordada:

  Historial de Interacciones:
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
