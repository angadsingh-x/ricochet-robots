import './styles.css';
import { SoloGame } from './modes/solo';
import { MultiplayerGame } from './modes/multiplayer';
import { RobotColor, NORTH, SOUTH, EAST, WEST } from './game/types';

type Screen = 'menu' | 'solo' | 'multiplayer-setup' | 'multiplayer';

let currentScreen: Screen = 'menu';
let soloGame: SoloGame | null = null;
let mpGame: MultiplayerGame | null = null;

const app = document.getElementById('app')!;

function render() {
  switch (currentScreen) {
    case 'menu':
      renderMenu();
      break;
    case 'solo':
      renderSolo();
      break;
    case 'multiplayer-setup':
      renderMultiplayerSetup();
      break;
    case 'multiplayer':
      renderMultiplayer();
      break;
  }
}

// ===== Menu =====
function renderMenu() {
  app.innerHTML = `
    <div class="menu-screen">
      <h1>Ricochet Robots</h1>
      <p class="subtitle">The sliding puzzle game</p>
      <div class="menu-buttons">
        <button class="btn btn-primary" id="btn-solo">Solo Puzzle</button>
        <button class="btn btn-secondary" id="btn-mp">Local Multiplayer</button>
      </div>
      <div class="how-to-play">
        <p class="how-to-play-title">How to Play</p>
        <ul>
          <li><span class="arrow">→</span> Slide the colored robot to its matching target</li>
          <li><span class="arrow">→</span> Robots slide until hitting a wall or another robot</li>
          <li><span class="arrow">→</span> Use other robots as blockers</li>
          <li><span class="arrow">→</span> Fewer moves = better</li>
        </ul>
      </div>
      <div class="keyboard-hints">
        <span><kbd>Arrow Keys</kbd> / <kbd>WASD</kbd> Move</span>
        <span><kbd>1-4</kbd> Select Robot</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>R</kbd> Reset</span>
      </div>
    </div>
  `;
  document.getElementById('btn-solo')!.onclick = () => {
    currentScreen = 'solo';
    render();
  };
  document.getElementById('btn-mp')!.onclick = () => {
    currentScreen = 'multiplayer-setup';
    render();
  };
}

// ===== Solo =====
function renderSolo() {
  app.innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="btn btn-ghost btn-small" id="btn-back">Back</button>
        <h2>Solo Puzzle</h2>
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">Moves</span>
            <span class="info-value" id="move-count">0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Target</span>
            <span class="info-value" id="target-info">-</span>
          </div>
        </div>
      </div>

      <div class="robot-selector" id="robot-selector"></div>

      <div class="canvas-container" id="canvas-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div id="solved-area"></div>

      <div class="d-pad" id="d-pad">
        <button class="d-pad-up">&#9650;</button>
        <button class="d-pad-left">&#9668;</button>
        <button class="d-pad-center"></button>
        <button class="d-pad-right">&#9658;</button>
        <button class="d-pad-down">&#9660;</button>
      </div>

      <div class="game-controls">
        <button class="btn btn-ghost btn-small" id="btn-undo">Undo (U)</button>
        <button class="btn btn-ghost btn-small" id="btn-reset">Reset (R)</button>
        <button class="btn btn-ghost btn-small" id="btn-solve">Show Solution</button>
        <button class="btn btn-primary btn-small" id="btn-next">Next Puzzle</button>
      </div>

      <div class="keyboard-hints">
        <span><kbd>Arrow Keys</kbd> / <kbd>WASD</kbd> Move</span>
        <span><kbd>1-4</kbd> Select Robot</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>R</kbd> Reset</span>
        <span>Click robot to select</span>
      </div>
    </div>
  `;

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  soloGame = new SoloGame(canvas, updateSoloUI);
  soloGame.resize();

  // D-pad buttons
  const dpad = document.getElementById('d-pad')!;
  dpad.querySelector('.d-pad-up')!.addEventListener('click', () => soloGame?.moveRobot(NORTH));
  dpad.querySelector('.d-pad-down')!.addEventListener('click', () => soloGame?.moveRobot(SOUTH));
  dpad.querySelector('.d-pad-left')!.addEventListener('click', () => soloGame?.moveRobot(WEST));
  dpad.querySelector('.d-pad-right')!.addEventListener('click', () => soloGame?.moveRobot(EAST));

  document.getElementById('btn-back')!.onclick = () => {
    soloGame = null;
    currentScreen = 'menu';
    render();
  };
  document.getElementById('btn-undo')!.onclick = () => soloGame?.undo();
  document.getElementById('btn-reset')!.onclick = () => soloGame?.resetPuzzle();
  document.getElementById('btn-solve')!.onclick = () => soloGame?.showSolution();
  document.getElementById('btn-next')!.onclick = () => soloGame?.nextTarget();

  renderRobotSelector();
  updateSoloUI();

  window.addEventListener('resize', () => soloGame?.resize());
}

function renderRobotSelector() {
  const container = document.getElementById('robot-selector')!;
  const colors: RobotColor[] = ['red', 'blue', 'green', 'yellow'];
  container.innerHTML = colors.map(c =>
    `<button class="robot-btn ${c}" data-color="${c}" title="${c} (${colors.indexOf(c) + 1})"></button>`
  ).join('');
  container.querySelectorAll('.robot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = (btn as HTMLElement).dataset.color as RobotColor;
      if (soloGame) {
        soloGame.selectedRobot = color;
        soloGame.redraw();
        updateSoloUI();
      }
      if (mpGame) {
        mpGame.selectedRobot = color;
        mpGame.redraw();
        updateMultiplayerUI();
      }
    });
  });
}

function updateSoloUI() {
  if (!soloGame) return;

  document.getElementById('move-count')!.textContent = String(soloGame.moves.length);

  const t = soloGame.currentTarget;
  const targetEl = document.getElementById('target-info')!;
  targetEl.textContent = `${t.shape}`;
  targetEl.style.color = getColorHex(t.color);

  // Update robot selector
  document.querySelectorAll('.robot-btn').forEach(btn => {
    const c = (btn as HTMLElement).dataset.color;
    btn.classList.toggle('selected', c === soloGame!.selectedRobot);
  });

  // Solved area
  const solvedArea = document.getElementById('solved-area')!;
  if (soloGame.solved) {
    let msg = `Solved in ${soloGame.moves.length} move${soloGame.moves.length !== 1 ? 's' : ''}!`;
    if (soloGame.optimalMoves !== null && soloGame.optimalMoves > 0) {
      msg += ` (Optimal: ${soloGame.optimalMoves})`;
    }
    solvedArea.innerHTML = `<div class="solved-banner">${msg}</div>`;
  } else if (soloGame.optimalMoves === -1) {
    solvedArea.innerHTML = `<div class="phase-banner">No solution found within search depth.</div>`;
  } else {
    solvedArea.innerHTML = '';
  }
}

// ===== Multiplayer Setup =====
let mpPlayerCount = 2;
let mpPlayerNames: string[] = ['Player 1', 'Player 2'];
let mpRounds = 10;

function renderMultiplayerSetup() {
  app.innerHTML = `
    <div class="menu-screen">
      <h1>Local Multiplayer</h1>
      <p class="subtitle">Play on the same device</p>

      <div class="player-count-control">
        <button id="btn-minus">-</button>
        <span id="count-label">${mpPlayerCount} Players</span>
        <button id="btn-plus">+</button>
      </div>

      <div class="player-setup" id="player-inputs"></div>

      <div style="display:flex; align-items:center; gap:0.75rem;">
        <label style="color:#718096; font-size:0.9rem;">Rounds:</label>
        <input type="number" id="rounds-input" value="${mpRounds}" min="1" max="50"
          style="width:60px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:0.4rem; color:#e2e8f0; text-align:center; font-size:1rem;">
      </div>

      <div class="menu-buttons">
        <button class="btn btn-secondary" id="btn-start-mp">Start Game</button>
        <button class="btn btn-ghost" id="btn-back-setup">Back</button>
      </div>
    </div>
  `;

  renderPlayerInputs();

  document.getElementById('btn-minus')!.onclick = () => {
    if (mpPlayerCount > 2) {
      mpPlayerCount--;
      mpPlayerNames = mpPlayerNames.slice(0, mpPlayerCount);
      document.getElementById('count-label')!.textContent = `${mpPlayerCount} Players`;
      renderPlayerInputs();
    }
  };
  document.getElementById('btn-plus')!.onclick = () => {
    if (mpPlayerCount < 8) {
      mpPlayerCount++;
      mpPlayerNames.push(`Player ${mpPlayerCount}`);
      document.getElementById('count-label')!.textContent = `${mpPlayerCount} Players`;
      renderPlayerInputs();
    }
  };

  document.getElementById('btn-back-setup')!.onclick = () => {
    currentScreen = 'menu';
    render();
  };

  document.getElementById('btn-start-mp')!.onclick = () => {
    for (let i = 0; i < mpPlayerCount; i++) {
      const input = document.getElementById(`player-name-${i}`) as HTMLInputElement;
      if (input.value.trim()) mpPlayerNames[i] = input.value.trim();
    }
    const roundsInput = document.getElementById('rounds-input') as HTMLInputElement;
    mpRounds = Math.max(1, Math.min(50, parseInt(roundsInput.value) || 10));

    currentScreen = 'multiplayer';
    render();
  };
}

function renderPlayerInputs() {
  const container = document.getElementById('player-inputs')!;
  container.innerHTML = '';
  for (let i = 0; i < mpPlayerCount; i++) {
    if (!mpPlayerNames[i]) mpPlayerNames[i] = `Player ${i + 1}`;
    container.innerHTML += `
      <input type="text" id="player-name-${i}" placeholder="Player ${i + 1}" value="${mpPlayerNames[i]}">
    `;
  }
}

// ===== Multiplayer Game =====
function renderMultiplayer() {
  app.innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="btn btn-ghost btn-small" id="btn-back-mp">Back</button>
        <h2 id="mp-title">Round 1/${mpRounds}</h2>
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">Moves</span>
            <span class="info-value" id="mp-move-count">0</span>
          </div>
        </div>
      </div>

      <div class="robot-selector" id="robot-selector"></div>

      <div class="canvas-container" id="canvas-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div id="mp-phase-area"></div>

      <div class="game-controls" id="mp-controls" style="display:none;">
        <button class="btn btn-ghost btn-small" id="mp-undo">Undo</button>
        <button class="btn btn-ghost btn-small" id="mp-reset">Reset</button>
        <button class="btn btn-ghost btn-small" id="mp-fail">Give Up</button>
      </div>

      <div class="d-pad" id="d-pad" style="display:none;">
        <button class="d-pad-up">&#9650;</button>
        <button class="d-pad-left">&#9668;</button>
        <button class="d-pad-center"></button>
        <button class="d-pad-right">&#9658;</button>
        <button class="d-pad-down">&#9660;</button>
      </div>

      <div id="mp-scoreboard"></div>
    </div>
  `;

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  mpGame = new MultiplayerGame(canvas, mpPlayerNames.slice(0, mpPlayerCount), mpRounds, updateMultiplayerUI);
  mpGame.resize();

  renderRobotSelector();

  const dpad = document.getElementById('d-pad')!;
  dpad.querySelector('.d-pad-up')!.addEventListener('click', () => mpGame?.moveRobot(NORTH));
  dpad.querySelector('.d-pad-down')!.addEventListener('click', () => mpGame?.moveRobot(SOUTH));
  dpad.querySelector('.d-pad-left')!.addEventListener('click', () => mpGame?.moveRobot(WEST));
  dpad.querySelector('.d-pad-right')!.addEventListener('click', () => mpGame?.moveRobot(EAST));

  document.getElementById('btn-back-mp')!.onclick = () => {
    mpGame?.destroy();
    mpGame = null;
    currentScreen = 'menu';
    render();
  };
  document.getElementById('mp-undo')!.onclick = () => mpGame?.undo();
  document.getElementById('mp-reset')!.onclick = () => mpGame?.resetPuzzle();
  document.getElementById('mp-fail')!.onclick = () => mpGame?.failCurrentSolver();

  updateMultiplayerUI();
  window.addEventListener('resize', () => mpGame?.resize());
}

function updateMultiplayerUI() {
  if (!mpGame) return;

  document.getElementById('mp-title')!.textContent = `Round ${mpGame.round}/${mpGame.maxRounds}`;
  document.getElementById('mp-move-count')!.textContent = String(mpGame.moves.length);

  const controlsEl = document.getElementById('mp-controls')!;
  const dpadEl = document.getElementById('d-pad')!;
  const phaseArea = document.getElementById('mp-phase-area')!;

  document.querySelectorAll('.robot-btn').forEach(btn => {
    const c = (btn as HTMLElement).dataset.color;
    btn.classList.toggle('selected', c === mpGame!.selectedRobot);
  });

  switch (mpGame.phase) {
    case 'thinking': {
      controlsEl.style.display = 'none';
      dpadEl.style.display = 'none';
      const warn = mpGame.thinkingTimeLeft <= 10 ? ' warning' : '';
      phaseArea.innerHTML = `
        <div class="phase-banner">
          <p>Look at the board and think of a solution!</p>
          <div class="timer-display${warn}">${mpGame.thinkingTimeLeft}s</div>
          <button class="btn btn-ghost btn-small" id="btn-stop-timer" style="margin-top:0.5rem;">Everyone Ready</button>
        </div>
      `;
      document.getElementById('btn-stop-timer')!.onclick = () => mpGame?.stopThinkingEarly();
      break;
    }

    case 'bidding': {
      controlsEl.style.display = 'none';
      dpadEl.style.display = 'none';
      phaseArea.innerHTML = `
        <div class="phase-banner">
          <p style="margin-bottom:0.75rem;">How many moves can you do it in?</p>
          <div class="bid-form">
            ${mpGame.players.map((p, i) => `
              <div class="bid-row">
                <span class="player-name">${p.name}</span>
                <input type="number" id="bid-${i}" min="1" max="30"
                  value="${p.bid ?? ''}" placeholder="-">
                <button class="btn btn-ghost btn-small" id="bid-pass-${i}">${p.bid !== null ? 'Change' : 'Pass'}</button>
              </div>
            `).join('')}
            <button class="btn btn-secondary btn-small" id="btn-start-solve" style="margin-top:0.5rem;">
              Start Solving
            </button>
          </div>
        </div>
      `;

      mpGame.players.forEach((_, i) => {
        const input = document.getElementById(`bid-${i}`) as HTMLInputElement;
        input.onchange = () => {
          const val = parseInt(input.value);
          if (val > 0) mpGame?.submitBid(i, val);
        };
        document.getElementById(`bid-pass-${i}`)!.onclick = () => {
          const val = parseInt(input.value);
          if (val > 0) {
            mpGame?.submitBid(i, val);
          }
        };
      });

      document.getElementById('btn-start-solve')!.onclick = () => mpGame?.startSolving();
      break;
    }

    case 'solving': {
      controlsEl.style.display = 'flex';
      dpadEl.style.display = 'grid';
      const solver = mpGame.getCurrentSolver();
      const maxMoves = mpGame.getCurrentSolverMaxMoves();
      phaseArea.innerHTML = `
        <div class="phase-banner">
          <p><strong>${solver?.name}</strong> is solving (bid: ${maxMoves} moves)</p>
          <p>Moves used: ${mpGame.moves.length} / ${maxMoves}</p>
        </div>
      `;

      if (mpGame.solved) {
        phaseArea.innerHTML = `
          <div class="solved-banner">
            ${solver?.name} solved it in ${mpGame.moves.length} move${mpGame.moves.length !== 1 ? 's' : ''}!
          </div>
        `;
        controlsEl.style.display = 'none';
        dpadEl.style.display = 'none';
      }
      break;
    }

    case 'round_end': {
      controlsEl.style.display = 'none';
      dpadEl.style.display = 'none';

      if (mpGame.isGameOver()) {
        const winner = mpGame.players.reduce((a, b) => a.score > b.score ? a : b);
        phaseArea.innerHTML = `
          <div class="solved-banner">
            Game Over! ${winner.name} wins with ${winner.score} points!
          </div>
          <button class="btn btn-primary" id="btn-new-mp-game" style="margin-top:1rem;">Play Again</button>
        `;
        document.getElementById('btn-new-mp-game')?.addEventListener('click', () => {
          mpGame?.newGame();
        });
      } else {
        const roundMsg = mpGame.lastRoundWasSolved
          ? `Round ${mpGame.round} complete!`
          : `Round ${mpGame.round} complete! Nobody solved it.`;

        let bannerContent = `<p>${roundMsg}</p>`;

        if (!mpGame.lastRoundWasSolved) {
          if (mpGame.showingSolution) {
            bannerContent += `<p><em>Showing solution...</em></p>`;
          } else if (mpGame.solutionOptimalMoves === -1) {
            bannerContent += `<p><em>No solution found within search depth.</em></p>`;
          } else if (mpGame.solutionOptimalMoves !== null) {
            bannerContent += `<p><em>Solution: ${mpGame.solutionOptimalMoves} move(s).</em></p>`;
          } else {
            bannerContent += `<button class="btn btn-secondary btn-small" id="btn-show-mp-solution" style="margin-top:0.5rem;">Show Solution</button>`;
          }
        }

        const nextRoundDisabled = mpGame.showingSolution ? 'disabled' : '';
        bannerContent += `
          <button class="btn btn-primary btn-small" id="btn-next-round" style="margin-top:0.5rem;" ${nextRoundDisabled}>
            Next Round
          </button>
        `;

        phaseArea.innerHTML = `<div class="phase-banner">${bannerContent}</div>`;

        document.getElementById('btn-show-mp-solution')?.addEventListener('click', () => {
          mpGame?.showSolution();
        });
        if (!mpGame.showingSolution) {
          document.getElementById('btn-next-round')!.onclick = () => mpGame?.nextRound();
        }
      }
      break;
    }
  }

  // Scoreboard
  const scoreboardEl = document.getElementById('mp-scoreboard')!;
  scoreboardEl.innerHTML = `
    <table class="scoreboard">
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${mpGame.players.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.score}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getColorHex(color: RobotColor): string {
  const map: Record<RobotColor, string> = {
    red: '#e53e3e',
    blue: '#3182ce',
    green: '#38a169',
    yellow: '#d69e2e',
  };
  return map[color];
}

// Boot
render();
