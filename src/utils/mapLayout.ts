/**
 * Turns a real, arbitrary-length concept list (with prerequisite edges) into
 * the same kind of node-graph the prototype hand-authored for its "Sapiens"
 * demo: nodes grouped into vertical levels by prerequisite depth, spread
 * horizontally within a level, connected by curved roads.
 *
 * Shares the map canvas's coordinate space with `MapScreen`'s demo layout so
 * the same node components and road-drawing style work for both.
 */
import type { AnalysisConcept } from '../api/scanApi';

export const CANVAS_W = 353;
export const ROOT_Y = 26;
const FIRST_LEVEL_Y = 126;
const LEVEL_GAP = 96;
const DEST_GAP = 130;
/** Matches the demo canvas's hand-tuned column spread (see MapScreen's own note on 82/270). */
const COL_MARGIN = 82;
/** Half the tallest node's height — where roads should stop short of a pill, not touch its centre. */
const NODE_CLEARANCE = 20;

export type MapPoint = { x: number; y: number };
export type MapNodePos = MapPoint & { level: number };
export type MapEdge = { from: MapPoint; to: MapPoint };

export type MapLayout = {
  /** One position per concept, index-aligned with the input array. */
  positions: MapNodePos[];
  /** Concept indices grouped by prerequisite depth. */
  levels: number[][];
  /** Prerequisite edges between concepts. */
  edges: MapEdge[];
  /** Positions the root (book) node connects down to — the level-0 concepts. */
  rootTargets: MapPoint[];
  /** Positions the destination node connects up from — the deepest level's concepts. */
  destSources: MapPoint[];
  destPos: MapPoint;
  canvasHeight: number;
};

function xForColumn(col: number, count: number): number {
  const center = CANVAS_W / 2;
  if (count <= 1) return center;
  const left = COL_MARGIN;
  const right = CANVAS_W - COL_MARGIN;
  return left + ((right - left) * col) / (count - 1);
}

export function computeMapLayout(concepts: AnalysisConcept[]): MapLayout {
  const n = concepts.length;
  const nameToIndex = new Map(concepts.map((c, i) => [c.name, i]));
  const level = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i++) {
    const prereqLevels = concepts[i].prerequisites
      .map(p => nameToIndex.get(p))
      .filter((idx): idx is number => idx != null && idx < i)
      .map(idx => level[idx]);
    level[i] = prereqLevels.length ? Math.max(...prereqLevels) + 1 : 0;
  }

  const maxLevel = n ? Math.max(...level) : 0;
  const levels: number[][] = Array.from({ length: maxLevel + 1 }, () => []);
  for (let i = 0; i < n; i++) levels[level[i]].push(i);

  const positions: MapNodePos[] = new Array(n);
  levels.forEach((idxs, lvl) => {
    const y = FIRST_LEVEL_Y + lvl * LEVEL_GAP;
    idxs.forEach((idx, col) => {
      positions[idx] = { x: xForColumn(col, idxs.length), y, level: lvl };
    });
  });

  const edges: MapEdge[] = [];
  for (let i = 0; i < n; i++) {
    for (const p of concepts[i].prerequisites) {
      const j = nameToIndex.get(p);
      if (j == null || j >= i) continue;
      edges.push({ from: positions[j], to: positions[i] });
    }
  }

  const rootTargets = levels[0]?.map(idx => positions[idx]) ?? [];
  const lastLevel = levels[levels.length - 1] ?? [];
  const destSources = lastLevel.map(idx => positions[idx]);
  const lastY = positions[lastLevel[0]]?.y ?? FIRST_LEVEL_Y;
  const destPos: MapPoint = { x: CANVAS_W / 2, y: lastY + DEST_GAP };

  return {
    positions,
    levels,
    edges,
    rootTargets,
    destSources,
    destPos,
    canvasHeight: destPos.y + 70,
  };
}

/** An SVG path string for a road between two node centres, clearing pill edges. */
export function roadPath(from: MapPoint, to: MapPoint): string {
  const fy = from.y + NODE_CLEARANCE;
  const ty = to.y - NODE_CLEARANCE;
  if (Math.abs(from.x - to.x) < 1) return `M${from.x} ${fy} V${ty}`;
  const midY = (fy + ty) / 2;
  return `M${from.x} ${fy} C${from.x} ${midY} ${to.x} ${midY} ${to.x} ${ty}`;
}
