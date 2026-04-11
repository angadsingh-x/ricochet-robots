import { Board } from './board';
import {
  Direction, DIRECTIONS, RobotColor, ROBOT_COLORS,
  RobotPositions, Position, Move,
} from './types';
import { slideRobot } from './robot';

/**
 * BFS solver for Ricochet Robots.
 * Finds the optimal (fewest moves) solution to get the target robot to the target position.
 * Returns the move sequence, or null if no solution within maxDepth.
 */
export function solve(
  board: Board,
  initialRobots: RobotPositions,
  targetColor: RobotColor,
  targetPos: Position,
  maxDepth: number = 15,
): Move[] | null {
  // Encode state as string for visited set
  const encodeState = (robots: RobotPositions): string => {
    return ROBOT_COLORS.map(c => `${robots[c].row},${robots[c].col}`).join('|');
  };

  const initialState = encodeState(initialRobots);

  // Check if already solved
  if (
    initialRobots[targetColor].row === targetPos.row &&
    initialRobots[targetColor].col === targetPos.col
  ) {
    return [];
  }

  interface QueueItem {
    robots: RobotPositions;
    moves: Move[];
  }

  const visited = new Set<string>();
  visited.add(initialState);

  let queue: QueueItem[] = [{ robots: initialRobots, moves: [] }];

  for (let depth = 0; depth < maxDepth; depth++) {
    const nextQueue: QueueItem[] = [];

    for (const { robots, moves } of queue) {
      for (const color of ROBOT_COLORS) {
        for (const dir of DIRECTIONS) {
          const newPos = slideRobot(board, robots, color, dir as Direction);
          const oldPos = robots[color];

          // Skip if robot didn't move
          if (newPos.row === oldPos.row && newPos.col === oldPos.col) {
            continue;
          }

          const newRobots: RobotPositions = {
            ...robots,
            [color]: newPos,
          };

          const stateKey = encodeState(newRobots);
          if (visited.has(stateKey)) {
            continue;
          }
          visited.add(stateKey);

          const newMoves = [...moves, { color, from: oldPos, to: newPos }];

          // Check if solved
          if (
            color === targetColor &&
            newPos.row === targetPos.row &&
            newPos.col === targetPos.col
          ) {
            return newMoves;
          }

          nextQueue.push({ robots: newRobots, moves: newMoves });
        }
      }
    }

    queue = nextQueue;

    // Safety: if queue gets too large, bail
    if (visited.size > 2_000_000) {
      return null;
    }
  }

  return null;
}
