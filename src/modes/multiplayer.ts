import { Board } from '../game/board';
import { randomBoardConfig } from '../game/boards-data';
import { placeRobotsRandomly, slideRobot, isSolved } from '../game/robot';
import { solve } from '../game/solver';
import { BoardRenderer } from '../renderer/canvas';
import {
  Direction, RobotColor, RobotPositions, Target, Move,
  NORTH, EAST, SOUTH, WEST, ROBOT_COLORS,
} from '../game/types';

interface Player {
  name: string;
  score: number;
  bid: number | null;
}

type Phase = 'thinking' | 'bidding' | 'solving' | 'round_end';

export class MultiplayerGame {
  board!: Board;
  robots!: RobotPositions;
  initialRobots!: RobotPositions;
  currentTarget!: Target;
  selectedRobot: RobotColor | null = null;
  moves: Move[] = [];
  solved = false;

  players: Player[];
  currentSolverIndex = 0;
  phase: Phase = 'thinking';
  thinkingTimeLeft = 0;
  round = 0;
  maxRounds: number;
  lastRoundWasSolved = false;
  showingSolution = false;
  solutionOptimalMoves: number | null = null;

  private failedRobotPositions: RobotPositions | null = null;
  private renderer: BoardRenderer;
  private canvas: HTMLCanvasElement;
  private onUpdate: () => void;
  private animating = false;
  private timerInterval: number | null = null;
  private targetIndex = 0;
  private allTargets: Target[] = [];
  private bidQueue: number[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    playerNames: string[],
    maxRounds: number,
    onUpdate: () => void,
  ) {
    this.canvas = canvas;
    this.renderer = new BoardRenderer(canvas);
    this.onUpdate = onUpdate;
    this.maxRounds = maxRounds;

    this.players = playerNames.map(name => ({
      name,
      score: 0,
      bid: null,
    }));

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
    this.round = 0;
    this.players.forEach(p => p.score = 0);
    this.nextRound();
  }

  nextRound() {
    this.round++;
    if (this.targetIndex >= this.allTargets.length) {
      shuffleArray(this.allTargets);
      this.targetIndex = 0;
    }

    this.currentTarget = this.allTargets[this.targetIndex++];
    this.initialRobots = cloneRobots(this.failedRobotPositions ?? this.robots);
    this.moves = [];
    this.solved = false;
    this.selectedRobot = this.currentTarget.color;
    this.players.forEach(p => p.bid = null);
    this.bidQueue = [];
    this.currentSolverIndex = 0;
    this.failedRobotPositions = null;
    this.showingSolution = false;
    this.solutionOptimalMoves = null;
    this.lastRoundWasSolved = false;

    this.startThinking();
  }

  private startThinking() {
    this.phase = 'thinking';
    this.thinkingTimeLeft = 60;
    this.onUpdate();

    this.timerInterval = window.setInterval(() => {
      this.thinkingTimeLeft--;
      if (this.thinkingTimeLeft <= 0) {
        this.stopTimer();
        this.startBidding();
      }
      this.onUpdate();
    }, 1000);

    this.redraw();
  }

  stopThinkingEarly() {
    this.stopTimer();
    this.startBidding();
  }

  private startBidding() {
    this.phase = 'bidding';
    this.onUpdate();
  }

  submitBid(playerIndex: number, bid: number) {
    this.players[playerIndex].bid = bid;
    this.onUpdate();
  }

  allBidsIn(): boolean {
    return this.players.every(p => p.bid !== null);
  }

  startSolving() {
    // Sort by bid (lowest first), then by submission order for ties
    this.bidQueue = this.players
      .map((p, i) => ({ bid: p.bid ?? Infinity, index: i }))
      .filter(x => x.bid < Infinity)
      .sort((a, b) => a.bid - b.bid)
      .map(x => x.index);

    if (this.bidQueue.length === 0) {
      this.endRound(null);
      return;
    }

    this.currentSolverIndex = 0;
    this.startSolverTurn();
  }

  private startSolverTurn() {
    this.phase = 'solving';
    this.robots = cloneRobots(this.initialRobots);
    this.moves = [];
    this.solved = false;
    this.selectedRobot = this.currentTarget.color;
    this.redraw();
    this.onUpdate();
  }

  getCurrentSolver(): Player | null {
    if (this.currentSolverIndex >= this.bidQueue.length) return null;
    return this.players[this.bidQueue[this.currentSolverIndex]];
  }

  getCurrentSolverMaxMoves(): number {
    const solver = this.getCurrentSolver();
    return solver?.bid ?? 0;
  }

  failCurrentSolver() {
    this.currentSolverIndex++;
    if (this.currentSolverIndex >= this.bidQueue.length) {
      this.endRound(null);
    } else {
      this.startSolverTurn();
    }
  }

  moveRobot(direction: Direction) {
    if (!this.selectedRobot || this.solved || this.animating || this.phase !== 'solving') return;

    const color = this.selectedRobot;
    const oldPos = { ...this.robots[color] };
    const newPos = slideRobot(this.board, this.robots, color, direction);

    if (newPos.row === oldPos.row && newPos.col === oldPos.col) return;

    this.animating = true;
    this.renderer.animateMove(color, oldPos, newPos, () => {
      this.robots[color] = newPos;
      this.moves.push({ color, from: oldPos, to: newPos });
      this.animating = false;

      if (isSolved(this.robots, this.currentTarget.color, this.currentTarget.pos)) {
        this.solved = true;
        const solverIdx = this.bidQueue[this.currentSolverIndex];
        this.endRound(solverIdx);
      } else if (this.moves.length >= this.getCurrentSolverMaxMoves()) {
        // Exceeded bid — fail
        this.failCurrentSolver();
      }

      this.redraw();
      this.onUpdate();
    });

    const animLoop = () => {
      if (this.animating) {
        this.redraw();
        requestAnimationFrame(animLoop);
      }
    };
    requestAnimationFrame(animLoop);
  }

  private endRound(winnerIndex: number | null) {
    this.phase = 'round_end';
    this.lastRoundWasSolved = winnerIndex !== null;
    if (winnerIndex !== null) {
      this.players[winnerIndex].score++;
    } else {
      this.failedRobotPositions = cloneRobots(this.robots);
    }
    this.onUpdate();
  }

  showSolution() {
    if (this.showingSolution || this.solutionOptimalMoves !== null) return;

    const solution = solve(
      this.board,
      this.initialRobots,
      this.currentTarget.color,
      this.currentTarget.pos,
    );

    if (solution) {
      this.solutionOptimalMoves = solution.length;
      this.showingSolution = true;
      this.robots = cloneRobots(this.initialRobots);
      this.moves = [];
      this.onUpdate();
      this.replaySolution(solution, 0);
    } else {
      this.solutionOptimalMoves = -1;
      this.onUpdate();
    }
  }

  private replaySolution(solution: Move[], index: number) {
    if (index >= solution.length) {
      this.showingSolution = false;
      this.redraw();
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

  isGameOver(): boolean {
    return this.round >= this.maxRounds;
  }

  undo() {
    if (this.moves.length === 0 || this.solved || this.phase !== 'solving') return;
    const last = this.moves.pop()!;
    this.robots[last.color] = { ...last.from };
    this.redraw();
    this.onUpdate();
  }

  resetPuzzle() {
    if (this.phase !== 'solving') return;
    this.robots = cloneRobots(this.initialRobots);
    this.moves = [];
    this.solved = false;
    this.selectedRobot = this.currentTarget.color;
    this.redraw();
    this.onUpdate();
  }

  selectRobotAt(row: number, col: number) {
    if (this.phase !== 'solving') return;
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

  private stopTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  destroy() {
    this.stopTimer();
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      if (this.animating || this.phase !== 'solving') return;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          e.preventDefault(); this.moveRobot(NORTH); break;
        case 'ArrowDown': case 's': case 'S':
          e.preventDefault(); this.moveRobot(SOUTH); break;
        case 'ArrowLeft': case 'a': case 'A':
          e.preventDefault(); this.moveRobot(WEST); break;
        case 'ArrowRight': case 'd': case 'D':
          e.preventDefault(); this.moveRobot(EAST); break;
        case 'u': case 'U': this.undo(); break;
        case 'r': case 'R': this.resetPuzzle(); break;
        case '1': this.selectedRobot = 'red'; this.redraw(); this.onUpdate(); break;
        case '2': this.selectedRobot = 'blue'; this.redraw(); this.onUpdate(); break;
        case '3': this.selectedRobot = 'green'; this.redraw(); this.onUpdate(); break;
        case '4': this.selectedRobot = 'yellow'; this.redraw(); this.onUpdate(); break;
      }
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cell = this.getCellFromPixel(x, y);
      if (cell) this.selectRobotAt(cell.row, cell.col);
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
