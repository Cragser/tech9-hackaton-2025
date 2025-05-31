import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Zod schema for the response
const SolutionSchema = z.object({
  title: z.string().describe('Brief title of the solution'),
  description: z.string().describe('Detailed description of the solution'),
  complexity: z.enum(['Low', 'Medium', 'High']).describe('Implementation complexity level'),
  timeEstimate: z.string().describe('Estimated time to implement this solution (e.g., "2-3 days")'),
  costEstimate: z.string().describe('Estimated monetary cost to implement this solution (e.g., "$500-$800")')
});

const ProblemAnalysisSchema = z.object({
  summary: z.string().max(100).describe('Brief summary of the overall solution approach (max 100 characters)'),
  solutions: z.array(SolutionSchema).describe('List of possible solutions to the problem'),
  totalEstimatedTime: z.string().describe('Total estimated time to solve the problem'),
  totalEstimatedCost: z.string().describe('Total estimated monetary cost to solve the problem (e.g., "$2,000-$3,500")')
});

// Validate that the request includes a problem object
const validateRequest = (problem: unknown): problem is { description: string } => {
  return (
    typeof problem === 'object' &&
    problem !== null &&
    'description' in problem &&
    typeof (problem as any).description === 'string'
  );
};

export async function POST(request: NextRequest) {
  try {
    // Check if OPENAI_API_KEY is configured in environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    if (!validateRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected an object with a description property.' },
        { status: 400 }
      );
    }

    // Extract the problem description
    const { description } = body;

    // Generar soluciones y estimados usando generateObject con un esquema Zod
    try {
      const { object: analysis } = await generateObject({
        model: openai('gpt-4o'),
        schema: ProblemAnalysisSchema,
        schemaName: 'ProblemAnalysis',
        schemaDescription: 'Analysis of a technical problem with solutions and estimates',
        messages: [
          {
            role: 'system',
            content: 'You are an expert developer who analyzes technical problems and provides practical solutions with realistic time and cost estimates.'
          },
          {
            role: 'user',
            content: `Analyze the following technical problem and provide between 3 and 5 practical solutions. For each solution include: a time estimate in days/weeks/months and a monetary cost estimate in dollars ($). Also provide a brief summary of the overall solution approach in no more than 100 characters. At the end, provide the total estimated time and cost. Problem: "${description}"`
          }
        ],
        temperature: 0.7,
        maxTokens: 1500
      });
      
      // Devolver el análisis directamente, ya validado por Zod
      return NextResponse.json(analysis);
    } catch (error) {
      console.error('Error generating structured analysis:', error);
      
      // Proporcionar información detallada sobre el error
      let errorMessage = 'Error generating structured analysis';
      let errorDetails = {};
      
      if (error && typeof error === 'object' && 'text' in error) {
        errorDetails = {
          generatedText: (error as any).text,
          cause: (error as any).cause?.message || 'Unknown'
        };
      }
      
      return NextResponse.json({
        error: errorMessage,
        details: errorDetails
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
