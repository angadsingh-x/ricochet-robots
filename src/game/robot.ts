import { Board } from './board';
import {
  Direction, Position, RobotColor, RobotPositions,
  DIR_DELTA, ROBOT_COLORS, GRID_SIZE,
} from './types';

/**
 * Slide a robot in a direction until it hits a wall or another robot.
 * Returns the final position.
 */
export function slideRobot(
  board: Board,
  robots: RobotPositions,
  color: RobotColor,
  direction: Direction,
): Position {
  const pos = { ...robots[color] };
  const delta = DIR_DELTA[direction];

  // Collect all other robot positions for collision
  const otherPositions = ROBOT_COLORS
    .filter(c => c !== color)
    .map(c => robots[c]);

  while (true) {
    // Check if current cell has a wall in the movement direction
    if (board.hasWall(pos.row, pos.col, direction)) {
      break;
    }

    const nextRow = pos.row + delta.dr;
    const nextCol = pos.col + delta.dc;

    // Check bounds (shouldn't happen with border walls, but safety)
    if (nextRow < 0 || nextRow >= GRID_SIZE || nextCol < 0 || nextCol >= GRID_SIZE) {
      break;
    }

    // Check if another robot is blocking
    const blocked = otherPositions.some(
      p => p.row === nextRow && p.col === nextCol
    );
    if (blocked) {
      break;
    }

    pos.row = nextRow;
    pos.col = nextCol;
  }

  return pos;
}

/**
 * Check if a robot actually moved (not already against a wall/robot)
 */
export function wouldMove(
  board: Board,
  robots: RobotPositions,
  color: RobotColor,
  direction: Direction,
): boolean {
  const newPos = slideRobot(board, robots, color, direction);
  const oldPos = robots[color];
  return newPos.row !== oldPos.row || newPos.col !== oldPos.col;
}

/**
 * Place robots randomly on the board, avoiding center block, walls clusters, and each other.
 */
export function placeRobotsRandomly(_board: Board): RobotPositions {
  const occupied = new Set<string>();

  // Center block cells are off-limits
  for (let r = 7; r <= 8; r++) {
    for (let c = 7; c <= 8; c++) {
      occupied.add(`${r},${c}`);
    }
  }

  const positions: Partial<RobotPositions> = {};

  for (const color of ROBOT_COLORS) {
    let row: number, col: number;
    do {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * GRID_SIZE);
    } while (occupied.has(`${row},${col}`));

    occupied.add(`${row},${col}`);
    positions[color] = { row, col };
  }

  return positions as RobotPositions;
}

/**
 * Check if the target robot is on the target position.
 */
export function isSolved(robots: RobotPositions, targetColor: RobotColor, targetPos: Position): boolean {
  const robotPos = robots[targetColor];
  return robotPos.row === targetPos.row && robotPos.col === targetPos.col;
}
