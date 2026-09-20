/**
 * The learning content the prototype demonstrates the flow with — Sapiens as
 * the scanned book, its extracted concepts, and the learner's signals.
 *
 * This is the seam where a real backend would plug in; screens read from here
 * rather than embedding copy.
 */
import { C } from '../theme';

/* ── Analysis / path-building checklists ──────────────────────────────── */

export const ANALYSIS_STEPS = [
  'Reading material',
  'Extracting concepts',
  'Identifying terminology',
  'Mapping relationships',
  'Finding prerequisites',
  'Detecting misconceptions',
  'Estimating difficulty',
  'Creating knowledge structure',
  'Building learning opportunities',
];

export const BUILD_STEPS = [
  'Understanding your goal',
  'Analysing the material',
  'Finding what you already know',
  'Identifying prerequisites',
  'Mapping concepts',
  'Calculating optimal route',
  'Adding practice',
  'Adding mastery checkpoints',
];

/** Maps a 0–100 percentage onto done / active / pending step states. */
export function stepStates(steps: string[], pct: number) {
  const done = Math.floor((pct / 100) * steps.length);
  return steps.map((label, i) => ({
    label,
    state: (i < done ? 'done' : i === done ? 'active' : 'todo') as 'done' | 'active' | 'todo',
  }));
}

/* ── Extracted concepts ───────────────────────────────────────────────── */

export type ConceptTag = 'CORE' | 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED' | 'OPTIONAL';

export const TAG_COLORS: Record<ConceptTag, { bg: string; fg: string }> = {
  CORE: { bg: C.redA14, fg: C.redLight },
  FOUNDATION: { bg: C.purpleA16, fg: C.purpleSoft },
  INTERMEDIATE: { bg: C.blueA14, fg: C.blueLight },
  ADVANCED: { bg: C.amberA14, fg: C.amberLight },
  OPTIONAL: { bg: 'rgba(255,255,255,0.06)', fg: C.muted },
};

export type Concept = {
  num: string;
  name: string;
  tag: ConceptTag;
  meta: string;
  mastered: boolean;
};

export const CONCEPTS: Concept[] = [
  ['Human Evolution', 'CORE', '12 min · mastered 100%', true],
  ['Cognitive Revolution', 'CORE', '16 min · mastered 94%', true],
  ['Shared Myths', 'FOUNDATION', '14 min · mastered 82%', true],
  ['Agricultural Revolution', 'CORE', '18 min · 58% · in progress', false],
  ['Societies', 'INTERMEDIATE', '20 min · locked · 2 prerequisites', false],
  ['Money', 'INTERMEDIATE', '15 min · 42%', false],
  ['Religion', 'INTERMEDIATE', '17 min · locked', false],
  ['Science', 'ADVANCED', '22 min · locked · 4 prerequisites', false],
].map(([name, tag, meta, mastered], i) => ({
  num: String(i + 1).padStart(2, '0'),
  name: name as string,
  tag: tag as ConceptTag,
  meta: meta as string,
  mastered: mastered as boolean,
}));

/* ── Concept detail sheet ─────────────────────────────────────────────── */

export type ConceptDetail = {
  name: string;
  importance: string;
  importanceTone: 'high' | 'normal';
  minutes: string;
  mastery: number;
  prerequisites: string[];
  understand: string;
  needsWork: string;
  recommendation: string;
};

/**
 * Detail copy for the map nodes that open the sheet. Agricultural Revolution is
 * the design's worked example; the other two reuse the mastery figures and
 * prerequisite edges the map itself already states.
 */
export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  'Agricultural Revolution': {
    name: 'Agricultural Revolution',
    importance: 'HIGH IMPORTANCE',
    importanceTone: 'high',
    minutes: '18 min',
    mastery: 0.58,
    prerequisites: ['Human Evolution', 'Cognitive Revolution'],
    understand: 'What agriculture means and when it began',
    needsWork: 'Why it changed social organisation',
    recommendation: 'Start with a visual timeline, then anchor it with a real-world example.',
  },
  'Cognitive Revolution': {
    name: 'Cognitive Revolution',
    importance: 'MASTERED',
    importanceTone: 'normal',
    minutes: '16 min',
    mastery: 0.94,
    prerequisites: ['Human Evolution'],
    understand: 'How shared fiction let large groups cooperate',
    needsWork: 'Carrying the idea forward into later concepts',
    recommendation: 'Revisit briefly before Societies — it underpins everything downstream.',
  },
  Societies: {
    name: 'Societies',
    importance: 'HIGH IMPORTANCE',
    importanceTone: 'high',
    minutes: '20 min',
    mastery: 0.12,
    prerequisites: ['Food Surplus', 'Social Hierarchy'],
    understand: 'That larger groups need new ways to organise',
    needsWork: 'How surplus and hierarchy make those structures hold',
    recommendation: 'Take the two support steps first, then come back to this with the chain intact.',
  },
};

/* ── Learner signals ──────────────────────────────────────────────────── */

export type Signal = { label: string; pct: number; colors: readonly [string, string] };

export const SIGNALS: Signal[] = [
  { label: 'Visual explanations', pct: 0.91, colors: [C.purple, C.blue] },
  { label: 'Real-world examples', pct: 0.83, colors: [C.blue, C.teal] },
  { label: 'Interactive practice', pct: 0.76, colors: [C.teal, C.green] },
  { label: 'Teach-back', pct: 0.72, colors: [C.green, '#8FE3B8'] },
  { label: 'Written explanations', pct: 0.54, colors: [C.amber, C.redLight] },
];

/* ── Library ──────────────────────────────────────────────────────────── */

export type LibraryItem = {
  title: string;
  meta: string;
  pct: number;
  colors: readonly [string, string];
};

export const LIBRARY: LibraryItem[] = [
  { title: 'Sapiens', meta: '42 concepts · studied today', pct: 0.71, colors: [C.purple, C.blue] },
  {
    title: 'Blockchain Basics',
    meta: '33 concepts · 2 days ago',
    pct: 0.42,
    colors: [C.purple, C.purpleDeep],
  },
  {
    title: 'Thinking, Fast and Slow',
    meta: '87 concepts · last week',
    pct: 0.28,
    colors: [C.blue, C.teal],
  },
  {
    title: 'Economics Notes',
    meta: '18 concepts · last week',
    pct: 0.64,
    colors: [C.teal, C.green],
  },
  {
    title: 'Psychology 101',
    meta: '51 concepts · 3 weeks ago',
    pct: 0.15,
    colors: [C.amber, C.redLight],
  },
];

/* ── Practice question ────────────────────────────────────────────────── */

export type Answer = { key: string; text: string; correct: boolean };

export const QUESTION = 'Why did farming make lasting social hierarchy possible?';

export const ANSWERS: Answer[] = [
  { key: 'A', text: 'Farmers had more free time than foragers, so some became rulers.', correct: false },
  { key: 'B', text: 'Storable food surplus could be accumulated, counted and controlled.', correct: true },
  { key: 'C', text: 'Agriculture required written law, which created ruling classes.', correct: false },
  { key: 'D', text: 'Villages grew near rivers, and river access was unequal.', correct: false },
];

export const FEEDBACK = {
  correct: {
    title: 'Exactly right.',
    body:
      'Surplus is the hinge. Once food can be stored, it can be owned, taxed and defended — and whoever controls the store controls the people who need it.',
    bg: 'rgba(71,215,158,0.09)',
    border: C.greenA35,
    fg: C.greenLight,
  },
  wrong: {
    title: 'Almost — here’s the part to reconsider.',
    body:
      'Free time and rivers were real, but neither is what made hierarchy durable. Look again at what happens once food can be stored rather than eaten immediately.',
    bg: 'rgba(255,200,87,0.08)',
    border: 'rgba(255,200,87,0.32)',
    fg: C.amberLight,
  },
};

/* ── Scanner ──────────────────────────────────────────────────────────── */

export const SCAN_STATUSES = ['Page detected', 'Hold steady…', 'Captured'];

/* ── Paywall ──────────────────────────────────────────────────────────── */

export type PlanRow = { label: string; free: string; pro: string };

export const PLAN_ROWS: PlanRow[] = [
  { label: 'Scans', free: '5', pro: 'Unlimited' },
  { label: 'Learning maps', free: '1', pro: 'Unlimited' },
  { label: 'Teach me another way', free: '—', pro: 'All modes' },
  { label: 'Live path adaptation', free: '—', pro: 'Included' },
  { label: 'Progress history', free: '7 days', pro: 'Full' },
];

/* ── Book being analysed ──────────────────────────────────────────────── */

export const BOOK = {
  title: 'Sapiens',
  subtitle: 'A Brief History of Humankind',
  author: 'Yuval Noah Harari',
  pages: 320,
  concepts: 42,
  themes: 8,
  difficulty: 'Moderate difficulty',
  overview:
    'A sweeping account of how one species of ape came to dominate the planet — through shared fiction, agriculture, money, empire and science. The argument builds chronologically, so early concepts are prerequisites for almost everything later.',
  themeList: [
    'Human Evolution',
    'Cognitive Revolution',
    'Agricultural Revolution',
    'Societies',
    'Money',
    'Religion',
    'Science',
    'Modern World',
  ],
};
