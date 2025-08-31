// src/ai/flows/generate-absence-report.ts
'use server';

/**
 * @fileOverview Generates a report summarizing absences and suggesting strategies for addressing frequent absences.
 *
 * - generateAbsenceReport - A function that generates the absence report.
 * - GenerateAbsenceReportInput - The input type for the generateAbsenceReport function.
 * - GenerateAbsenceReportOutput - The return type for the generateAbsenceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAbsenceReportInputSchema = z.object({
  startDate: z.string().describe('The start date for the report (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the report (YYYY-MM-DD).'),
  absences: z
    .array(
      z.object({
        candidateName: z.string().describe('The name of the candidate.'),
        absentDates: z.array(z.string()).describe('Array of dates the candidate was absent (YYYY-MM-DD).'),
      })
    )
    .describe('An array of candidate absence records.'),
});
export type GenerateAbsenceReportInput = z.infer<typeof GenerateAbsenceReportInputSchema>;

const GenerateAbsenceReportOutputSchema = z.object({
  reportSummary: z.string().describe('Un résumé des absences pendant la période du rapport.'),
  recommendations: z
    .array(z.string())
    .describe("Une liste de recommandations pour gérer les absences fréquentes."),
});
export type GenerateAbsenceReportOutput = z.infer<typeof GenerateAbsenceReportOutputSchema>;

export async function generateAbsenceReport(
  input: GenerateAbsenceReportInput
): Promise<GenerateAbsenceReportOutput> {
  return generateAbsenceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAbsenceReportPrompt',
  input: {schema: GenerateAbsenceReportInputSchema},
  output: {schema: GenerateAbsenceReportOutputSchema},
  prompt: `Vous êtes un assistant IA pour un système de gestion de piscine. Votre tâche est de générer un rapport en français résumant les absences des élèves et de fournir des recommandations pour gérer les absences fréquentes.

  Le rapport doit couvrir la période du {{startDate}} au {{endDate}}.

  Voici les données d'absence :
  {{#each absences}}
  - Élève : {{candidateName}}
    Dates d'absence : {{#each absentDates}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/each}}

  Veuillez fournir un résumé concis des absences et proposer des recommandations concrètes pour améliorer l'assiduité. La réponse doit être entièrement en français.`,
});

const generateAbsenceReportFlow = ai.defineFlow(
  {
    name: 'generateAbsenceReportFlow',
    inputSchema: GenerateAbsenceReportInputSchema,
    outputSchema: GenerateAbsenceReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
