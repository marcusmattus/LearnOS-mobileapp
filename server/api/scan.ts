/**
 * LearnOS scan analysis endpoint.
 *
 * Takes photos of scanned pages (or imported photos) from the mobile app and
 * turns them into a structured learning path: the source material, its key
 * concepts in prerequisite order, and a recommended teaching approach. This is
 * the real analysis behind the app's Analysing -> Complete -> Concepts screens
 * — it replaces the hardcoded "Sapiens" demo data with Claude actually reading
 * the scan.
 *
 * The Anthropic API key lives only here (as the ANTHROPIC_API_KEY environment
 * variable on this deployment) — it must never be embedded in the mobile app,
 * where it would be extractable from the app bundle.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const CheckAnswerSchema = z.object({
  key: z.enum(['A', 'B', 'C', 'D']),
  text: z.string(),
  correct: z.boolean(),
});

const CheckSchema = z.object({
  question: z.string().describe('A single comprehension question testing the core idea of this concept.'),
  answers: z
    .array(CheckAnswerSchema)
    .length(4)
    .describe('Exactly 4 answers, keys A-D, exactly one with correct: true.'),
  correctFeedback: z.string().describe('One or two sentences shown when the learner picks the right answer.'),
  incorrectFeedback: z
    .string()
    .describe('One or two sentences shown on a wrong pick — explain the misconception, not just the right answer.'),
});

const ConceptSchema = z.object({
  name: z.string().describe('Short concept title, e.g. "Agricultural Revolution".'),
  tag: z
    .enum(['CORE', 'FOUNDATION', 'INTERMEDIATE', 'ADVANCED', 'OPTIONAL'])
    .describe('CORE = essential and early; FOUNDATION = underpins later concepts; OPTIONAL = enrichment.'),
  minutes: z.number().int().min(3).max(45).describe('Estimated minutes to learn this concept.'),
  summary: z.string().describe('One or two sentences on what this concept covers.'),
  explanation: z
    .string()
    .describe('A fuller 3-6 sentence written explanation a learner reads to actually understand the concept.'),
  keyTerms: z.array(z.string()).min(2).max(5).describe('2-5 short key terms or vocabulary introduced by this concept.'),
  prerequisites: z
    .array(z.string())
    .describe('Names of other concepts in this same list that must come first. Empty if none.'),
  check: CheckSchema,
});

const AnalysisSchema = z.object({
  book: z.object({
    title: z.string(),
    author: z.string().nullable(),
    subtitle: z.string().nullable(),
    estimatedPages: z.number().int().nullable(),
    difficulty: z.enum(['Easy', 'Moderate difficulty', 'Challenging']),
  }),
  overview: z.string().describe('A short paragraph summarising what the material covers.'),
  themes: z.array(z.string()).max(8),
  concepts: z
    .array(ConceptSchema)
    .min(4)
    .max(16)
    .describe('Ordered so each concept appears after everything it depends on.'),
  recommendedApproach: z
    .enum(['visual', 'written'])
    .describe('Which explanation style to lead the first lesson with.'),
  recommendationNote: z.string().describe('One or two sentences explaining the recommended approach.'),
});

export type ScanAnalysis = z.infer<typeof AnalysisSchema>;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-learnos-key');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // A shared secret embedded in the app build. It's readable if someone
  // decompiles the app, so it's a deterrent against casual scraping of the
  // endpoint URL, not real authentication — see the app's api/scan.ts caller
  // for where this is sent from.
  const expectedKey = process.env.APP_SHARED_SECRET;
  if (expectedKey && req.headers['x-learnos-key'] !== expectedKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { images, hint } = (req.body ?? {}) as { images?: string[]; hint?: string };
  if (!Array.isArray(images) || images.length === 0) {
    res.status(400).json({ error: 'images is required and must be a non-empty array of base64 JPEGs' });
    return;
  }
  if (images.length > 8) {
    res.status(400).json({ error: 'Send at most 8 pages per scan.' });
    return;
  }

  try {
    const response = await client.beta.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 12000,
      // Opus 5 runs adaptive thinking by default when `thinking` is omitted.
      output_format: betaZodOutputFormat(AnalysisSchema),
      system:
        "You are LearnOS's scanning agent. You read photos of book pages, lecture slides or handwritten notes and turn them into a full, ready-to-teach learning path: identify the source material, extract its key concepts in strict prerequisite order (foundational ideas first), tag each concept's role, and estimate how long each takes to learn. For every concept, also write the actual lesson content: a fuller written explanation a learner can study from (not just a summary), 2-5 key terms, and a single multiple-choice comprehension check with exactly one correct answer and feedback for both outcomes. Be precise about prerequisite relationships — a concept's prerequisites array must only name concepts that appear earlier in your list. If the photographed text is only partially legible, use what's visible plus your own knowledge of the subject to fill gaps sensibly — never invent an unrelated subject.",
      messages: [
        {
          role: 'user',
          content: [
            ...images.map(data => ({
              type: 'image' as const,
              source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data },
            })),
            {
              type: 'text' as const,
              text: hint
                ? `These are photos of pages from: ${hint}. Analyse them and build the learning path.`
                : 'Analyse these scanned pages and build the learning path.',
            },
          ],
        },
      ],
    });

    if (!response.parsed_output) {
      res.status(502).json({ error: 'Model response could not be parsed' });
      return;
    }
    res.status(200).json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status ?? 500 : 500;
    const message = err instanceof Error ? err.message : 'Analysis failed';
    console.error('scan analysis failed', err);
    res.status(status).json({ error: message });
  }
}
