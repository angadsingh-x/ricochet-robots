import { QuadrantData, SOUTH, EAST, WEST, NORTH } from './types';

/**
 * Classic Ricochet Robots quadrant data.
 * Each quadrant is an 8x8 section (rows 0-7, cols 0-7).
 * Walls are specified as cell + side.
 * When assembled, quadrants are rotated and placed in the 16x16 grid.
 *
 * We define 4 distinct quadrant sets (A, B, C, D).
 * Each has different wall/target configurations for variety.
 */

// Quadrant A — top-left style
export const QUADRANT_A1: QuadrantData = {
  walls: [
    { row: 1, col: 2, side: SOUTH },
    { row: 1, col: 2, side: EAST },
    { row: 2, col: 5, side: SOUTH },
    { row: 2, col: 5, side: WEST },
    { row: 3, col: 1, side: EAST },
    { row: 3, col: 1, side: SOUTH },
    { row: 4, col: 6, side: SOUTH },
    { row: 4, col: 6, side: EAST },
    { row: 5, col: 3, side: NORTH },
    { row: 5, col: 3, side: EAST },
    { row: 6, col: 0, side: SOUTH },
    { row: 6, col: 5, side: SOUTH },
    { row: 6, col: 5, side: WEST },
  ],
  targets: [
    { pos: { row: 1, col: 2 }, color: 'red', shape: 'circle' },
    { pos: { row: 2, col: 5 }, color: 'blue', shape: 'triangle' },
    { pos: { row: 3, col: 1 }, color: 'green', shape: 'square' },
    { pos: { row: 5, col: 3 }, color: 'yellow', shape: 'diamond' },
    { pos: { row: 6, col: 5 }, color: 'red', shape: 'star' },
  ],
};

export const QUADRANT_A2: QuadrantData = {
  walls: [
    { row: 0, col: 3, side: EAST },
    { row: 1, col: 5, side: SOUTH },
    { row: 1, col: 5, side: WEST },
    { row: 2, col: 1, side: SOUTH },
    { row: 2, col: 1, side: EAST },
    { row: 3, col: 6, side: NORTH },
    { row: 3, col: 6, side: WEST },
    { row: 4, col: 3, side: SOUTH },
    { row: 4, col: 3, side: EAST },
    { row: 5, col: 7, side: SOUTH },
    { row: 6, col: 2, side: NORTH },
    { row: 6, col: 2, side: EAST },
  ],
  targets: [
    { pos: { row: 1, col: 5 }, color: 'yellow', shape: 'circle' },
    { pos: { row: 2, col: 1 }, color: 'red', shape: 'triangle' },
    { pos: { row: 3, col: 6 }, color: 'green', shape: 'diamond' },
    { pos: { row: 4, col: 3 }, color: 'blue', shape: 'star' },
    { pos: { row: 6, col: 2 }, color: 'yellow', shape: 'square' },
  ],
};

// Quadrant B — different wall pattern
export const QUADRANT_B1: QuadrantData = {
  walls: [
    { row: 1, col: 4, side: SOUTH },
    { row: 1, col: 4, side: WEST },
    { row: 2, col: 6, side: SOUTH },
    { row: 2, col: 6, side: EAST },
    { row: 3, col: 2, side: NORTH },
    { row: 3, col: 2, side: EAST },
    { row: 4, col: 0, side: SOUTH },
    { row: 5, col: 5, side: SOUTH },
    { row: 5, col: 5, side: WEST },
    { row: 6, col: 3, side: NORTH },
    { row: 6, col: 3, side: WEST },
    { row: 7, col: 6, side: NORTH },
  ],
  targets: [
    { pos: { row: 1, col: 4 }, color: 'blue', shape: 'circle' },
    { pos: { row: 2, col: 6 }, color: 'red', shape: 'diamond' },
    { pos: { row: 3, col: 2 }, color: 'yellow', shape: 'triangle' },
    { pos: { row: 5, col: 5 }, color: 'green', shape: 'star' },
    { pos: { row: 6, col: 3 }, color: 'blue', shape: 'square' },
  ],
};

export const QUADRANT_B2: QuadrantData = {
  walls: [
    { row: 0, col: 5, side: EAST },
    { row: 1, col: 1, side: SOUTH },
    { row: 1, col: 1, side: EAST },
    { row: 2, col: 4, side: NORTH },
    { row: 2, col: 4, side: WEST },
    { row: 3, col: 7, side: SOUTH },
    { row: 4, col: 2, side: SOUTH },
    { row: 4, col: 2, side: EAST },
    { row: 5, col: 6, side: NORTH },
    { row: 5, col: 6, side: EAST },
    { row: 6, col: 4, side: SOUTH },
    { row: 6, col: 4, side: WEST },
  ],
  targets: [
    { pos: { row: 1, col: 1 }, color: 'green', shape: 'circle' },
    { pos: { row: 2, col: 4 }, color: 'yellow', shape: 'diamond' },
    { pos: { row: 4, col: 2 }, color: 'red', shape: 'square' },
    { pos: { row: 5, col: 6 }, color: 'blue', shape: 'triangle' },
    { pos: { row: 6, col: 4 }, color: 'green', shape: 'star' },
  ],
};

// Quadrant C
export const QUADRANT_C1: QuadrantData = {
  walls: [
    { row: 0, col: 4, side: EAST },
    { row: 1, col: 6, side: SOUTH },
    { row: 1, col: 6, side: WEST },
    { row: 2, col: 3, side: SOUTH },
    { row: 2, col: 3, side: EAST },
    { row: 3, col: 0, side: SOUTH },
    { row: 4, col: 5, side: NORTH },
    { row: 4, col: 5, side: WEST },
    { row: 5, col: 1, side: SOUTH },
    { row: 5, col: 1, side: EAST },
    { row: 6, col: 7, side: SOUTH },
    { row: 7, col: 4, side: NORTH },
  ],
  targets: [
    { pos: { row: 1, col: 6 }, color: 'yellow', shape: 'star' },
    { pos: { row: 2, col: 3 }, color: 'blue', shape: 'diamond' },
    { pos: { row: 4, col: 5 }, color: 'red', shape: 'circle' },
    { pos: { row: 5, col: 1 }, color: 'green', shape: 'triangle' },
  ],
};

export const QUADRANT_C2: QuadrantData = {
  walls: [
    { row: 1, col: 3, side: SOUTH },
    { row: 1, col: 3, side: WEST },
    { row: 2, col: 7, side: SOUTH },
    { row: 3, col: 5, side: NORTH },
    { row: 3, col: 5, side: EAST },
    { row: 4, col: 1, side: SOUTH },
    { row: 4, col: 1, side: WEST },
    { row: 5, col: 4, side: SOUTH },
    { row: 5, col: 4, side: EAST },
    { row: 6, col: 6, side: NORTH },
    { row: 6, col: 6, side: WEST },
  ],
  targets: [
    { pos: { row: 1, col: 3 }, color: 'red', shape: 'triangle' },
    { pos: { row: 3, col: 5 }, color: 'blue', shape: 'square' },
    { pos: { row: 4, col: 1 }, color: 'yellow', shape: 'circle' },
    { pos: { row: 5, col: 4 }, color: 'green', shape: 'diamond' },
    { pos: { row: 6, col: 6 }, color: 'red', shape: 'star' },
  ],
};

// Quadrant D
export const QUADRANT_D1: QuadrantData = {
  walls: [
    { row: 0, col: 2, side: EAST },
    { row: 1, col: 5, side: NORTH },
    { row: 1, col: 5, side: EAST },
    { row: 2, col: 0, side: SOUTH },
    { row: 3, col: 3, side: SOUTH },
    { row: 3, col: 3, side: WEST },
    { row: 4, col: 7, side: SOUTH },
    { row: 5, col: 2, side: NORTH },
    { row: 5, col: 2, side: WEST },
    { row: 6, col: 5, side: SOUTH },
    { row: 6, col: 5, side: EAST },
  ],
  targets: [
    { pos: { row: 1, col: 5 }, color: 'green', shape: 'star' },
    { pos: { row: 3, col: 3 }, color: 'blue', shape: 'circle' },
    { pos: { row: 5, col: 2 }, color: 'red', shape: 'diamond' },
    { pos: { row: 6, col: 5 }, color: 'yellow', shape: 'triangle' },
  ],
};

export const QUADRANT_D2: QuadrantData = {
  walls: [
    { row: 1, col: 1, side: SOUTH },
    { row: 1, col: 1, side: WEST },
    { row: 2, col: 6, side: NORTH },
    { row: 2, col: 6, side: EAST },
    { row: 3, col: 4, side: SOUTH },
    { row: 3, col: 4, side: WEST },
    { row: 4, col: 2, side: NORTH },
    { row: 4, col: 2, side: EAST },
    { row: 5, col: 5, side: SOUTH },
    { row: 5, col: 5, side: WEST },
    { row: 6, col: 0, side: SOUTH },
    { row: 7, col: 3, side: NORTH },
  ],
  targets: [
    { pos: { row: 1, col: 1 }, color: 'yellow', shape: 'square' },
    { pos: { row: 2, col: 6 }, color: 'green', shape: 'circle' },
    { pos: { row: 3, col: 4 }, color: 'red', shape: 'triangle' },
    { pos: { row: 5, col: 5 }, color: 'blue', shape: 'diamond' },
  ],
};

/** All quadrant sets — pick one from each for a full board */
export const QUADRANT_SETS = [
  [QUADRANT_A1, QUADRANT_A2],
  [QUADRANT_B1, QUADRANT_B2],
  [QUADRANT_C1, QUADRANT_C2],
  [QUADRANT_D1, QUADRANT_D2],
];

/**
 * Pick a random board configuration: one quadrant from each set,
 * randomly assigned to the 4 positions with appropriate rotations.
 */
export function randomBoardConfig(): { quadrants: QuadrantData[]; rotations: number[] } {
  // Shuffle set order for position assignment
  const setIndices = [0, 1, 2, 3];
  shuffle(setIndices);

  const quadrants: QuadrantData[] = [];
  const rotations: number[] = [];

  for (let i = 0; i < 4; i++) {
    const set = QUADRANT_SETS[setIndices[i]];
    const variant = set[Math.floor(Math.random() * set.length)];
    quadrants.push(variant);
    rotations.push(i); // Standard rotations: 0, 1, 2, 3 for TL, TR, BL, BR
  }

  return { quadrants, rotations };
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
