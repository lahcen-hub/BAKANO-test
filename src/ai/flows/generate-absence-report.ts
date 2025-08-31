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
  reportSummary: z.string().describe('A summary of absences during the reporting period.'),
  recommendations: z
    .array(z.string())
    .describe('A list of recommendations for addressing frequent absences.'),
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
  prompt: `You are an AI assistant for a pool management system. Your task is to generate a report summarizing student absences and provide recommendations for addressing frequent absences.

  The report should cover the period from {{startDate}} to {{endDate}}.

  Here's the absence data:
  {{#each absences}}
  - Candidate: {{candidateName}}
    Absent Dates: {{#each absentDates}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/each}}

  Please provide a concise summary of the absences and offer actionable recommendations for improving attendance.`,
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
