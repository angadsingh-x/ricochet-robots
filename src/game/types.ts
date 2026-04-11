// Wall directions as bitmask
export const NORTH = 1;
export const EAST = 2;
export const SOUTH = 4;
export const WEST = 8;

export type Direction = typeof NORTH | typeof EAST | typeof SOUTH | typeof WEST;

export const DIRECTIONS = [NORTH, EAST, SOUTH, WEST] as const;

export const OPPOSITE: Record<number, number> = {
  [NORTH]: SOUTH,
  [SOUTH]: NORTH,
  [EAST]: WEST,
  [WEST]: EAST,
};

export const DIR_DELTA: Record<number, { dr: number; dc: number }> = {
  [NORTH]: { dr: -1, dc: 0 },
  [SOUTH]: { dr: 1, dc: 0 },
  [EAST]: { dr: 0, dc: 1 },
  [WEST]: { dr: 0, dc: -1 },
};

export type RobotColor = 'red' | 'blue' | 'green' | 'yellow';
export const ROBOT_COLORS: RobotColor[] = ['red', 'blue', 'green', 'yellow'];

export type TargetShape = 'circle' | 'triangle' | 'square' | 'diamond' | 'star';

export interface Position {
  row: number;
  col: number;
}

export interface Target {
  pos: Position;
  color: RobotColor;
  shape: TargetShape;
}

export interface RobotPositions {
  red: Position;
  blue: Position;
  green: Position;
  yellow: Position;
}

export interface WallSegment {
  row: number;
  col: number;
  side: Direction;
}

export interface QuadrantData {
  walls: WallSegment[];
  targets: Target[];
}

export const GRID_SIZE = 16;

export interface Move {
  color: RobotColor;
  from: Position;
  to: Position;
}

export interface GameState {
  robots: RobotPositions;
  currentTarget: Target;
  moves: Move[];
  moveCount: number;
  solved: boolean;
}
