'use server';
/**
 * @fileOverview Flow to extract student names from a PDF or image file.
 *
 * - extractStudentsFromFile - A function that handles the student extraction process.
 * - ExtractStudentsInput - The input type for the extractStudentsFromFile function.
 * - ExtractStudentsOutput - The return type for the extractStudentsFromFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractStudentsInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A PDF or image file of a student list, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    fileType: z.string().describe('The MIME type of the file.'),
});
export type ExtractStudentsInput = z.infer<typeof ExtractStudentsInputSchema>;

const ExtractStudentsOutputSchema = z.object({
  students: z.array(z.string()).describe('A list of student names extracted from the document.'),
});
export type ExtractStudentsOutput = z.infer<typeof ExtractStudentsOutputSchema>;

export async function extractStudentsFromFile(input: ExtractStudentsInput): Promise<ExtractStudentsOutput> {
  return extractStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractStudentsPrompt',
  input: { schema: ExtractStudentsInputSchema },
  output: { schema: ExtractStudentsOutputSchema },
  prompt: `You are an expert at extracting text from documents and images.
You will be given a file (image or PDF) containing a list of names.
Your task is to identify and extract only the full names of the students from the document.
Ignore any other text, numbers, or headers. Just return a clean list of names.

File: {{media url=fileDataUri type=fileType}}`,
});

const extractStudentsFlow = ai.defineFlow(
  {
    name: 'extractStudentsFlow',
    inputSchema: ExtractStudentsInputSchema,
    outputSchema: ExtractStudentsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
