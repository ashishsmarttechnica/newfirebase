'use server';

/**
 * @fileOverview AI-powered file renaming flow.
 *
 * This file defines a Genkit flow that automatically renames files using AI to include a short summarization
 * of the file content in the filename, enhancing organization.
 *
 * @module ai/flows/smart-rename
 *
 * @interface SmartRenameInput - Defines the input for the smart rename flow.
 * @interface SmartRenameOutput - Defines the output for the smart rename flow.
 * @function smartRename - The exported function that triggers the smart rename flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRenameInputSchema = z.object({
  fileName: z.string().describe('The original name of the file.'),
  fileType: z.string().describe('The type of the file (e.g., document, image, etc.).'),
  fileContentSummary: z
    .string()
    .describe('A short summary of the file content, used to generate a new file name.'),
});

export type SmartRenameInput = z.infer<typeof SmartRenameInputSchema>;

const SmartRenameOutputSchema = z.object({
  newFileName: z
    .string()
    .describe('The AI-generated new file name, including a summary of the content.'),
});

export type SmartRenameOutput = z.infer<typeof SmartRenameOutputSchema>;

export async function smartRename(input: SmartRenameInput): Promise<SmartRenameOutput> {
  return smartRenameFlow(input);
}

const smartRenamePrompt = ai.definePrompt({
  name: 'smartRenamePrompt',
  input: {schema: SmartRenameInputSchema},
  output: {schema: SmartRenameOutputSchema},
  prompt: `You are an AI assistant designed to rename files to improve organization.  You will be provided with the original filename, the file type, and a short summary of the file content.  Your task is to generate a new filename that incorporates the file content summary in a concise and informative way.

Original Filename: {{{fileName}}}
File Type: {{{fileType}}}
File Content Summary: {{{fileContentSummary}}}

New Filename:`,
});

const smartRenameFlow = ai.defineFlow(
  {
    name: 'smartRenameFlow',
    inputSchema: SmartRenameInputSchema,
    outputSchema: SmartRenameOutputSchema,
  },
  async input => {
    const {output} = await smartRenamePrompt(input);
    return output!;
  }
);
