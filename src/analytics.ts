import { RobotColor } from './game/types';

// ─── Event types ───────────────────────────────────────────────────────────

export type EventName =
  | 'mode_selected'
  | 'solo_puzzle_loaded'
  | 'solo_puzzle_solved'
  | 'solo_solution_shown'
  | 'solo_undo_used'
  | 'solo_puzzle_reset'
  | 'mp_round_won';

export interface AnalyticsEvent {
  name: EventName;
  sessionId: string;
  ts: number;
  props: Record<string, unknown>;
}

// ─── Derived stats shape ────────────────────────────────────────────────────

export interface PlayerStats {
  // Totals
  puzzlesPlayed: number;
  puzzlesSolved: number;
  solveRate: number;              // 0–1

  // Efficiency (solved puzzles only)
  averageMovesToSolve: number;
  bestMoveCount: number;          // fewest moves ever used to solve
  averageEfficiency: number;      // mean(moves / optimalMoves) — 1.0 = perfect

  // Habits
  solutionRevealRate: number;     // reveals / puzzles played (lower = better)
  totalUndos: number;
  totalResets: number;
  daysPlayed: number;             // unique calendar days with activity

  // Current session
  puzzlesThisSession: number;
  solvedThisSession: number;
}

// ─── Storage constants ──────────────────────────────────────────────────────

const STORAGE_KEY = 'rr:analytics';
const MAX_EVENTS = 500;

// ─── Analytics class ────────────────────────────────────────────────────────

export class Analytics {
  private readonly sessionId: string;

  constructor() {
    this.sessionId = Math.random().toString(36).slice(2, 10);
  }

  track(name: EventName, props: Record<string, unknown> = {}): void {
    const event: AnalyticsEvent = {
      name,
      sessionId: this.sessionId,
      ts: Date.now(),
      props,
    };

    const events = this.getEvents();
    events.push(event);

    // Rolling buffer — drop oldest when over limit
    const trimmed = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Storage quota exceeded — silently discard
    }
  }

  getSummary(): PlayerStats {
    const events = this.getEvents();

    const loaded  = events.filter(e => e.name === 'solo_puzzle_loaded');
    const solved  = events.filter(e => e.name === 'solo_puzzle_solved');
    const reveals = events.filter(e => e.name === 'solo_solution_shown');
    const undos   = events.filter(e => e.name === 'solo_undo_used');
    const resets  = events.filter(e => e.name === 'solo_puzzle_reset');

    const moveCounts = solved.map(e => e.props['moves'] as number);
    const efficiencies = solved
      .filter(e => (e.props['optimalMoves'] as number) > 0)
      .map(e => (e.props['moves'] as number) / (e.props['optimalMoves'] as number));

    const daySet = new Set(
      [...loaded, ...solved].map(e => new Date(e.ts).toDateString()),
    );

    // Session-scoped counts
    const sessionLoaded = loaded.filter(e => e.sessionId === this.sessionId);
    const sessionSolved = solved.filter(e => e.sessionId === this.sessionId);

    return {
      puzzlesPlayed: loaded.length,
      puzzlesSolved: solved.length,
      solveRate: loaded.length > 0 ? solved.length / loaded.length : 0,

      averageMovesToSolve: mean(moveCounts),
      bestMoveCount: moveCounts.length > 0 ? Math.min(...moveCounts) : 0,
      averageEfficiency: mean(efficiencies),

      solutionRevealRate: loaded.length > 0 ? reveals.length / loaded.length : 0,
      totalUndos: undos.length,
      totalResets: resets.length,
      daysPlayed: daySet.size,

      puzzlesThisSession: sessionLoaded.length,
      solvedThisSession: sessionSolved.length,
    };
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  getEvents(): AnalyticsEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    } catch {
      return [];
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// Re-export RobotColor so callers don't need a separate import
export type { RobotColor };
