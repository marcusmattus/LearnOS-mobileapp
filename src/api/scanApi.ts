/**
 * Client for the LearnOS scan analysis backend (`server/api/scan.ts`).
 *
 * The backend is a separate service — the Anthropic API key can't live in
 * this app, since anything bundled into a mobile build is extractable. Point
 * this at your deployed backend via `expo.extra.scanApiUrl` in app.json (or
 * an EAS environment variable of the same name); it defaults to
 * `http://localhost:3000` for local development with `vercel dev`.
 */
import Constants from 'expo-constants';

export type ConceptTag = 'CORE' | 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED' | 'OPTIONAL';

export type CheckAnswer = { key: 'A' | 'B' | 'C' | 'D'; text: string; correct: boolean };

export type ConceptCheck = {
  question: string;
  answers: CheckAnswer[];
  correctFeedback: string;
  incorrectFeedback: string;
};

export type AnalysisConcept = {
  name: string;
  tag: ConceptTag;
  minutes: number;
  summary: string;
  explanation: string;
  keyTerms: string[];
  prerequisites: string[];
  check: ConceptCheck;
};

export type ScanAnalysis = {
  book: {
    title: string;
    author: string | null;
    subtitle: string | null;
    estimatedPages: number | null;
    difficulty: 'Easy' | 'Moderate difficulty' | 'Challenging';
  };
  overview: string;
  themes: string[];
  concepts: AnalysisConcept[];
  recommendedApproach: 'visual' | 'written';
  recommendationNote: string;
};

type Extra = { scanApiUrl?: string; scanApiKey?: string };

function config() {
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  return {
    baseUrl: (extra.scanApiUrl || 'http://localhost:3000').replace(/\/+$/, ''),
    key: extra.scanApiKey || '',
  };
}

export class ScanApiError extends Error {}

/**
 * Sends captured page photos (base64 JPEG strings, no data URI prefix) to the
 * backend and returns the structured learning path Claude extracted from
 * them. Throws `ScanApiError` on any non-2xx response or network failure.
 */
export async function analyzeScan(images: string[], hint?: string): Promise<ScanAnalysis> {
  const { baseUrl, key } = config();
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { 'x-learnos-key': key } : {}),
      },
      body: JSON.stringify({ images, hint }),
    });
  } catch {
    throw new ScanApiError(
      `Couldn't reach the scan backend at ${baseUrl}. Is it running and reachable from this device?`,
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new ScanApiError(body.error || `Analysis failed (${res.status})`);
  }
  return (await res.json()) as ScanAnalysis;
}
