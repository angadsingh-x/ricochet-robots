import { Board } from '../game/board';
import {
  GRID_SIZE, NORTH, EAST, SOUTH, WEST,
  RobotColor, RobotPositions, Target, Position, Move,
} from '../game/types';

const ROBOT_FILL: Record<RobotColor, string> = {
  red: '#e53e3e',
  blue: '#3182ce',
  green: '#38a169',
  yellow: '#d69e2e',
};

const ROBOT_STROKE: Record<RobotColor, string> = {
  red: '#c53030',
  blue: '#2b6cb0',
  green: '#2f855a',
  yellow: '#b7791f',
};

const TARGET_COLOR: Record<RobotColor, string> = {
  red: 'rgba(229, 62, 62, 0.3)',
  blue: 'rgba(49, 130, 206, 0.3)',
  green: 'rgba(56, 161, 105, 0.3)',
  yellow: 'rgba(214, 158, 46, 0.3)',
};

const TARGET_BORDER: Record<RobotColor, string> = {
  red: '#e53e3e',
  blue: '#3182ce',
  green: '#38a169',
  yellow: '#d69e2e',
};

export class BoardRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // Animation state
  private animating = false;
  private animRobot: RobotColor | null = null;
  private animFrom: Position | null = null;
  private animTo: Position | null = null;
  private animProgress = 0;
  private animCallback: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const container = this.canvas.parentElement!;
    const size = Math.min(container.clientWidth, container.clientHeight, 700);

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = 12;
    this.cellSize = (size - padding * 2) / GRID_SIZE;
    this.offsetX = padding;
    this.offsetY = padding;
  }

  getCellFromPixel(x: number, y: number): Position | null {
    const col = Math.floor((x - this.offsetX) / this.cellSize);
    const row = Math.floor((y - this.offsetY) / this.cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  }

  animateMove(
    color: RobotColor,
    from: Position,
    to: Position,
    onComplete: () => void,
  ) {
    this.animating = true;
    this.animRobot = color;
    this.animFrom = from;
    this.animTo = to;
    this.animProgress = 0;
    this.animCallback = onComplete;

    const duration = 150; // ms
    const start = performance.now();

    const finish = () => {
      this.animating = false;
      this.animRobot = null;
      this.animFrom = null;
      this.animTo = null;
      this.animCallback?.();
    };

    const tick = (now: number) => {
      this.animProgress = Math.min((now - start) / duration, 1);
      if (this.animProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    requestAnimationFrame(tick);

    // Fallback: if rAF doesn't fire (background tab, headless), force complete
    setTimeout(() => {
      if (this.animating && this.animRobot === color) {
        finish();
      }
    }, duration + 50);
  }

  draw(
    board: Board,
    robots: RobotPositions,
    target: Target | null,
    selectedRobot: RobotColor | null,
    traces: Move[] = [],
  ) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.offsetX;
    const oy = this.offsetY;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid background
    ctx.fillStyle = '#16213e';
    ctx.fillRect(ox, oy, cs * GRID_SIZE, cs * GRID_SIZE);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(ox + i * cs, oy);
      ctx.lineTo(ox + i * cs, oy + GRID_SIZE * cs);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ox, oy + i * cs);
      ctx.lineTo(ox + GRID_SIZE * cs, oy + i * cs);
      ctx.stroke();
    }

    // Draw center block
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(ox + 7 * cs, oy + 7 * cs, 2 * cs, 2 * cs);
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + 7 * cs, oy + 7 * cs, 2 * cs, 2 * cs);

    // Draw target
    if (target) {
      this.drawTarget(target);
    }

    // Draw move traces
    if (traces.length > 0) {
      this.drawTraces(traces);
    }

    // Draw walls
    this.drawWalls(board);

    // Draw robots
    this.drawRobots(robots, selectedRobot);
  }

  private drawTarget(target: Target) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.offsetX;
    const oy = this.offsetY;
    const x = ox + target.pos.col * cs;
    const y = oy + target.pos.row * cs;

    // Fill background
    ctx.fillStyle = TARGET_COLOR[target.color];
    ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);

    // Draw shape
    const cx = x + cs / 2;
    const cy = y + cs / 2;
    const r = cs * 0.25;

    ctx.fillStyle = TARGET_BORDER[target.color];
    ctx.strokeStyle = TARGET_BORDER[target.color];
    ctx.lineWidth = 1.5;

    switch (target.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy + r);
        ctx.lineTo(cx - r, cy + r);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'square':
        ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'star':
        this.drawStar(cx, cy, r);
        break;
    }
  }

  private drawStar(cx: number, cy: number, r: number) {
    const ctx = this.ctx;
    const spikes = 5;
    const outerR = r;
    const innerR = r * 0.45;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  private drawTraces(traces: Move[]) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.offsetX;
    const oy = this.offsetY;

    const TRACE_ALPHA: Record<RobotColor, string> = {
      red: 'rgba(229, 62, 62, 0.45)',
      blue: 'rgba(49, 130, 206, 0.45)',
      green: 'rgba(56, 161, 105, 0.45)',
      yellow: 'rgba(214, 158, 46, 0.45)',
    };

    for (let i = 0; i < traces.length; i++) {
      const move = traces[i];
      const color = TRACE_ALPHA[move.color];
      const fromX = ox + move.from.col * cs + cs / 2;
      const fromY = oy + move.from.row * cs + cs / 2;
      const toX = ox + move.to.col * cs + cs / 2;
      const toY = oy + move.to.row * cs + cs / 2;

      // Draw trail line
      ctx.strokeStyle = color;
      ctx.lineWidth = cs * 0.18;
      ctx.lineCap = 'round';
      ctx.setLineDash([cs * 0.15, cs * 0.1]);
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw arrowhead at destination
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        const ux = dx / len;
        const uy = dy / len;
        const arrowSize = cs * 0.3;
        const tipX = toX;
        const tipY = toY;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - ux * arrowSize - uy * arrowSize * 0.5, tipY - uy * arrowSize + ux * arrowSize * 0.5);
        ctx.lineTo(tipX - ux * arrowSize + uy * arrowSize * 0.5, tipY - uy * arrowSize - ux * arrowSize * 0.5);
        ctx.closePath();
        ctx.fill();
      }

      // Draw move number
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold ${Math.round(cs * 0.32)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      // Background pill for number
      const numStr = String(i + 1);
      const pillR = cs * 0.22;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(midX, midY, pillR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(numStr, midX, midY);
    }
  }

  private drawWalls(board: Board) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.offsetX;
    const oy = this.offsetY;

    ctx.strokeStyle = '#f6ad55';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const x = ox + c * cs;
        const y = oy + r * cs;
        const w = board.walls[r][c];

        // Skip border walls (drawn as board edge)
        if (w & NORTH && r > 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cs, y);
          ctx.stroke();
        }
        if (w & SOUTH && r < GRID_SIZE - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y + cs);
          ctx.lineTo(x + cs, y + cs);
          ctx.stroke();
        }
        if (w & WEST && c > 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cs);
          ctx.stroke();
        }
        if (w & EAST && c < GRID_SIZE - 1) {
          ctx.beginPath();
          ctx.moveTo(x + cs, y);
          ctx.lineTo(x + cs, y + cs);
          ctx.stroke();
        }
      }
    }

    // Draw board border
    ctx.strokeStyle = '#f6ad55';
    ctx.lineWidth = 4;
    ctx.strokeRect(ox, oy, cs * GRID_SIZE, cs * GRID_SIZE);
  }

  private drawRobots(robots: RobotPositions, selectedRobot: RobotColor | null) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.offsetX;
    const oy = this.offsetY;
    const colors: RobotColor[] = ['red', 'blue', 'green', 'yellow'];

    for (const color of colors) {
      let pos = robots[color];

      // If this robot is being animated, interpolate position
      if (this.animating && this.animRobot === color && this.animFrom && this.animTo) {
        const t = easeOutCubic(this.animProgress);
        pos = {
          row: this.animFrom.row + (this.animTo.row - this.animFrom.row) * t,
          col: this.animFrom.col + (this.animTo.col - this.animFrom.col) * t,
        };
      }

      const cx = ox + pos.col * cs + cs / 2;
      const cy = oy + pos.row * cs + cs / 2;
      const r = cs * 0.35;

      // Selection glow
      if (color === selectedRobot) {
        ctx.shadowColor = ROBOT_FILL[color];
        ctx.shadowBlur = 15;
      }

      // Robot body
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = ROBOT_FILL[color];
      ctx.fill();
      ctx.strokeStyle = ROBOT_STROKE[color];
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
