import {
  GRID_SIZE, NORTH, EAST, SOUTH, WEST, OPPOSITE,
  Direction, Position, Target, WallSegment, QuadrantData,
} from './types';

export class Board {
  // walls[row][col] is a bitmask of walls on that cell
  walls: number[][];
  targets: Target[];

  constructor() {
    this.walls = [];
    this.targets = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      this.walls[r] = new Array(GRID_SIZE).fill(0);
    }
    this.addBorderWalls();
    this.addCenterBlock();
  }

  private addBorderWalls() {
    for (let i = 0; i < GRID_SIZE; i++) {
      this.walls[0][i] |= NORTH;
      this.walls[GRID_SIZE - 1][i] |= SOUTH;
      this.walls[i][0] |= WEST;
      this.walls[i][GRID_SIZE - 1] |= EAST;
    }
  }

  private addCenterBlock() {
    // Center 2x2 block (rows 7-8, cols 7-8) — all sides walled
    // All sides walled
    this.walls[7][7] |= NORTH | WEST;
    this.walls[7][8] |= NORTH | EAST;
    this.walls[8][7] |= SOUTH | WEST;
    this.walls[8][8] |= SOUTH | EAST;

    // Also set opposing walls on neighbors
    if (6 >= 0) {
      this.walls[6][7] |= SOUTH;
      this.walls[6][8] |= SOUTH;
    }
    this.walls[9][7] |= NORTH;
    this.walls[9][8] |= NORTH;
    this.walls[7][6] |= EAST;
    this.walls[8][6] |= EAST;
    this.walls[7][9] |= WEST;
    this.walls[8][9] |= WEST;
  }

  addWall(row: number, col: number, side: Direction) {
    this.walls[row][col] |= side;
    // Add the corresponding wall on the neighboring cell
    const opp = OPPOSITE[side];
    const nr = side === NORTH ? row - 1 : side === SOUTH ? row + 1 : row;
    const nc = side === WEST ? col - 1 : side === EAST ? col + 1 : col;
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
      this.walls[nr][nc] |= opp;
    }
  }

  hasWall(row: number, col: number, side: Direction): boolean {
    return (this.walls[row][col] & side) !== 0;
  }

  /**
   * Assemble board from 4 quadrants.
   * Quadrants are placed: TL=0, TR=1, BL=2, BR=3
   * Each quadrant covers an 8x8 area of the 16x16 grid.
   * rotation: 0=none, 1=90CW, 2=180, 3=270CW
   */
  static fromQuadrants(
    quadrants: QuadrantData[],
    rotations: number[] = [0, 1, 2, 3],
  ): Board {
    const board = new Board();

    const offsets = [
      { dr: 0, dc: 0 },   // top-left
      { dr: 0, dc: 8 },   // top-right
      { dr: 8, dc: 0 },   // bottom-left
      { dr: 8, dc: 8 },   // bottom-right
    ];

    for (let qi = 0; qi < 4; qi++) {
      const q = quadrants[qi];
      const rot = rotations[qi];
      const off = offsets[qi];

      for (const wall of q.walls) {
        const { row, col, side } = rotateWall(wall, rot);
        board.addWall(row + off.dr, col + off.dc, side);
      }

      for (const target of q.targets) {
        const { row, col } = rotatePos(target.pos, rot);
        board.targets.push({
          pos: { row: row + off.dr, col: col + off.dc },
          color: target.color,
          shape: target.shape,
        });
      }
    }

    return board;
  }
}

function rotatePos(pos: Position, rotation: number): Position {
  let { row, col } = pos;
  for (let i = 0; i < rotation; i++) {
    const newRow = col;
    const newCol = 7 - row;
    row = newRow;
    col = newCol;
  }
  return { row, col };
}

function rotateSide(side: Direction, rotation: number): Direction {
  const order = [NORTH, EAST, SOUTH, WEST];
  let idx = order.indexOf(side);
  idx = (idx + rotation) % 4;
  return order[idx] as Direction;
}

function rotateWall(wall: WallSegment, rotation: number): WallSegment {
  const pos = rotatePos({ row: wall.row, col: wall.col }, rotation);
  const side = rotateSide(wall.side, rotation);
  return { row: pos.row, col: pos.col, side };
}
