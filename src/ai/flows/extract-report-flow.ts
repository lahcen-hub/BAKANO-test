'use server';
/**
 * @fileOverview Flow to extract student data from a PDF report.
 *
 * - extractDataFromPdf - Extracts structured data from a PDF file.
 * - ExtractDataInput - The input type for the extraction function.
 * - ExtractedData - The return type for the extraction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Student, PaymentStatus, AttendanceStatus } from '@/types';

const ExtractDataInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file of a report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ExtractDataInput = z.infer<typeof ExtractDataInputSchema>;

const ExtractedStudentSchema = z.object({
  name: z.string().describe("The student's full name."),
  attendance: z.record(z.string(), z.enum(['present', 'absent'])).describe("The student's attendance record. Keys are 'yyyy-MM-dd' dates."),
  payments: z.record(z.string(), z.enum(['paid', 'unpaid'])).describe("The student's payment record. Keys are 'yyyy-MM' months."),
});

const ExtractedGroupSchema = z.object({
  name: z.string().describe("The group's name."),
  students: z.array(ExtractedStudentSchema).describe("The list of students in this group.")
});

const ExtractedDataSchema = z.object({
    groups: z.array(ExtractedGroupSchema).describe("A list of all groups and their students found in the document.")
});

export type ExtractedData = z.infer<typeof ExtractedDataSchema>;

export async function extractDataFromPdf(input: ExtractDataInput): Promise<ExtractedData> {
  return extractReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReportPrompt',
  input: { schema: ExtractDataInputSchema },
  output: { schema: ExtractedDataSchema },
  prompt: `You are an expert data extraction agent. You are tasked with extracting student attendance and payment information from a PDF report.

The user has provided a PDF report. Analyze the entire document.

Extract the following information for each student listed:
- Full Name
- Group Name
- Payment Status for the month in the report. The output should be 'paid' or 'unpaid'.
- Attendance Status for each session day in the month. The output should be 'present' or 'absent'. The date should be in 'yyyy-MM-dd' format.

Structure the output according to the provided schema. The root object should contain a list of groups, and each group should contain a list of its students with their extracted data.

PDF Report:
{{media url=pdfDataUri}}`,
});


const extractReportFlow = ai.defineFlow(
  {
    name: 'extractReportFlow',
    inputSchema: ExtractDataInputSchema,
    outputSchema: ExtractedDataSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to extract data from PDF.');
    }
    return output;
  }
);
