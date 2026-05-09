import { Board } from '../game/board';
import { randomBoardConfig } from '../game/boards-data';
import { placeRobotsRandomly, slideRobot, isSolved } from '../game/robot';
import { solve } from '../game/solver';
import { BoardRenderer } from '../renderer/canvas';
import {
  Direction, RobotColor, RobotPositions, Target, Move,
  NORTH, EAST, SOUTH, WEST, ROBOT_COLORS,
} from '../game/types';

export class SoloGame {
  board!: Board;
  robots!: RobotPositions;
  initialRobots!: RobotPositions;
  currentTarget!: Target;
  selectedRobot: RobotColor | null = null;
  moves: Move[] = [];
  solved = false;
  optimalMoves: number | null = null;

  private renderer: BoardRenderer;
  private canvas: HTMLCanvasElement;
  private onUpdate: () => void;
  private animating = false;
  private targetIndex = 0;
  private allTargets: Target[] = [];

  constructor(canvas: HTMLCanvasElement, onUpdate: () => void) {
    this.canvas = canvas;
    this.renderer = new BoardRenderer(canvas);
    this.onUpdate = onUpdate;
    this.newGame();
    this.setupInput();
  }

  newGame() {
    const { quadrants, rotations } = randomBoardConfig();
    this.board = Board.fromQuadrants(quadrants, rotations);
    this.allTargets = [...this.board.targets];
    shuffleArray(this.allTargets);
    this.targetIndex = 0;
    this.robots = placeRobotsRandomly(this.board);
    this.nextTarget();
  }

  nextTarget() {
    if (this.targetIndex >= this.allTargets.length) {
      // All targets done, reshuffle
      shuffleArray(this.allTargets);
      this.targetIndex = 0;
    }
    this.currentTarget = this.allTargets[this.targetIndex++];
    this.initialRobots = cloneRobots(this.robots);
    this.moves = [];
    this.solved = false;
    this.optimalMoves = null;
    this.selectedRobot = this.currentTarget.color;
    this.redraw();
    this.onUpdate();
  }

  resetPuzzle() {
    this.robots = cloneRobots(this.initialRobots);
    this.moves = [];
    this.solved = false;
    this.selectedRobot = this.currentTarget.color;
    this.redraw();
    this.onUpdate();
  }

  undo() {
    if (this.moves.length === 0 || this.solved) return;
    const last = this.moves.pop()!;
    this.robots[last.color] = { ...last.from };
    this.redraw();
    this.onUpdate();
  }

  moveRobot(direction: Direction) {
    if (!this.selectedRobot || this.solved || this.animating) return;

    const color = this.selectedRobot;
    const oldPos = { ...this.robots[color] };
    const newPos = slideRobot(this.board, this.robots, color, direction);

    if (newPos.row === oldPos.row && newPos.col === oldPos.col) {
      return; // No movement
    }

    // Animate the move
    this.animating = true;
    this.renderer.animateMove(color, oldPos, newPos, () => {
      this.robots[color] = newPos;
      this.moves.push({ color, from: oldPos, to: newPos });
      this.animating = false;

      // Check if solved
      if (isSolved(this.robots, this.currentTarget.color, this.currentTarget.pos)) {
        this.solved = true;
      }

      this.redraw();
      this.onUpdate();
    });

    // Trigger redraw during animation
    const animLoop = () => {
      if (this.animating) {
        this.redraw();
        requestAnimationFrame(animLoop);
      }
    };
    requestAnimationFrame(animLoop);
  }

  showSolution() {
    const solution = solve(
      this.board,
      this.initialRobots,
      this.currentTarget.color,
      this.currentTarget.pos,
    );
    if (solution) {
      this.optimalMoves = solution.length;
      // Reset and replay solution
      this.robots = cloneRobots(this.initialRobots);
      this.moves = [];
      this.replaySolution(solution, 0);
    } else {
      this.optimalMoves = -1; // No solution found
    }
    this.onUpdate();
  }

  private replaySolution(solution: Move[], index: number) {
    if (index >= solution.length) {
      this.solved = true;
      this.onUpdate();
      return;
    }

    const move = solution[index];
    this.selectedRobot = move.color;
    this.animating = true;

    this.renderer.animateMove(move.color, move.from, move.to, () => {
      this.robots[move.color] = { ...move.to };
      this.moves.push(move);
      this.animating = false;
      this.redraw();
      this.onUpdate();

      setTimeout(() => this.replaySolution(solution, index + 1), 300);
    });

    const animLoop = () => {
      if (this.animating) {
        this.redraw();
        requestAnimationFrame(animLoop);
      }
    };
    requestAnimationFrame(animLoop);
  }

  selectRobotAt(row: number, col: number) {
    for (const color of ROBOT_COLORS) {
      if (this.robots[color].row === row && this.robots[color].col === col) {
        this.selectedRobot = color;
        this.redraw();
        this.onUpdate();
        return;
      }
    }
  }

  resize() {
    this.renderer.resize();
    this.redraw();
  }

  redraw() {
    this.renderer.draw(this.board, this.robots, this.currentTarget, this.selectedRobot, this.moves);
  }

  getCellFromPixel(x: number, y: number) {
    return this.renderer.getCellFromPixel(x, y);
  }

  private setupInput() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (this.animating) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          this.moveRobot(NORTH);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          this.moveRobot(SOUTH);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          this.moveRobot(WEST);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          this.moveRobot(EAST);
          break;
        case 'u':
        case 'U':
          this.undo();
          break;
        case 'r':
        case 'R':
          this.resetPuzzle();
          break;
        case '1':
          this.selectedRobot = 'red';
          this.redraw();
          this.onUpdate();
          break;
        case '2':
          this.selectedRobot = 'blue';
          this.redraw();
          this.onUpdate();
          break;
        case '3':
          this.selectedRobot = 'green';
          this.redraw();
          this.onUpdate();
          break;
        case '4':
          this.selectedRobot = 'yellow';
          this.redraw();
          this.onUpdate();
          break;
        case 'Tab': {
          e.preventDefault();
          const idx = ROBOT_COLORS.indexOf(this.selectedRobot ?? 'red');
          this.selectedRobot = ROBOT_COLORS[(idx + 1) % ROBOT_COLORS.length];
          this.redraw();
          this.onUpdate();
          break;
        }
      }
    });

    // Mouse click to select robot
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cell = this.getCellFromPixel(x, y);
      if (cell) {
        this.selectRobotAt(cell.row, cell.col);
      }
    });

  }
}

function cloneRobots(robots: RobotPositions): RobotPositions {
  return {
    red: { ...robots.red },
    blue: { ...robots.blue },
    green: { ...robots.green },
    yellow: { ...robots.yellow },
  };
}

function shuffleArray<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
