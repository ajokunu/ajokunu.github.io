<script>
  import { onMount, onDestroy } from 'svelte';

  // ─── GAME CONFIG ───
  const GRID_COLS = 4;
  const GRID_ROWS = 3;
  const TILE_COUNT = GRID_COLS * GRID_ROWS;
  const GAME_DURATION = 60;

  const ALERT_TYPES = {
    critical: {
      color: '#ef4444',
      points: 15,
      missPoints: -25,
      duration: 3000,
      labels: ['MALWARE DETECTED', 'BRUTE FORCE', 'DATA EXFIL', 'RANSOMWARE', 'C2 BEACON']
    },
    medium: {
      color: '#eab308',
      points: 10,
      missPoints: -10,
      duration: 4000,
      labels: ['SUSPICIOUS LOGIN', 'PORT SCAN', 'PRIV ESCALATION', 'UNUSUAL TRAFFIC']
    },
    noise: {
      color: '#22c55e',
      points: -15,
      missPoints: 0,
      duration: 4500,
      labels: ['WINDOWS UPDATE', 'SCHEDULED SCAN', 'BACKUP JOB', 'PATCH TUESDAY', 'CEO GOOGLED BITCOIN']
    }
  };

  const GAME_OVER_MESSAGES = [
    { min: -Infinity, max: 0, msg: "You've been demoted to help desk." },
    { min: 0, max: 100, msg: "Alert fatigue is real. Try coffee." },
    { min: 100, max: 250, msg: "Acceptable. The SOC won't page you... today." },
    { min: 250, max: 400, msg: "Solid triage. You might survive on-call." },
    { min: 400, max: Infinity, msg: "You ARE the SIEM. Someone give this person a raise." }
  ];

  // ─── STATE ───
  let gameState = 'idle'; // idle | playing | gameover
  let score = 0;
  let timeLeft = GAME_DURATION;
  let threatsNeutralized = 0;
  let breaches = 0;
  let tiles = Array(TILE_COUNT).fill(null).map((_, i) => ({
    id: i,
    alert: null,
    flash: null // 'success' | 'fail' | 'breach' | null
  }));

  let spawnInterval;
  let timerInterval;
  let tickInterval;
  let difficultyPhase = 0;

  // ─── DIFFICULTY SCALING ───
  function getSpawnDelay() {
    if (timeLeft > 45) return 1800;
    if (timeLeft > 30) return 1300;
    if (timeLeft > 15) return 900;
    return 550;
  }

  function getAlertType() {
    const roll = Math.random();
    const phase = GAME_DURATION - timeLeft;
    // More noise (green) as game progresses to trick you
    const noiseChance = phase > 30 ? 0.35 : phase > 15 ? 0.25 : 0.15;
    const critChance = phase > 30 ? 0.40 : phase > 15 ? 0.35 : 0.30;
    if (roll < noiseChance) return 'noise';
    if (roll < noiseChance + critChance) return 'critical';
    return 'medium';
  }

  function pickLabel(type) {
    const labels = ALERT_TYPES[type].labels;
    return labels[Math.floor(Math.random() * labels.length)];
  }

  // ─── GAME ACTIONS ───
  function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    threatsNeutralized = 0;
    breaches = 0;
    tiles = tiles.map(t => ({ ...t, alert: null, flash: null }));
    gameState = 'playing';

    // Timer countdown
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    // Alert ticker - checks for expired alerts
    tickInterval = setInterval(() => {
      tiles = tiles.map(t => {
        if (!t.alert) return t;
        t.alert.elapsed += 100;
        if (t.alert.elapsed >= t.alert.duration) {
          // Alert expired
          if (t.alert.type !== 'noise') {
            // Missed a real threat = breach
            score += ALERT_TYPES[t.alert.type].missPoints;
            breaches++;
            return { ...t, alert: null, flash: 'breach' };
          }
          // Noise auto-cleared (good)
          return { ...t, alert: null, flash: null };
        }
        return { ...t };
      });
      clearFlashes();
    }, 100);

    // Spawn alerts
    scheduleSpawn();
  }

  function scheduleSpawn() {
    if (gameState !== 'playing') return;
    const delay = getSpawnDelay();
    spawnInterval = setTimeout(() => {
      spawnAlert();
      scheduleSpawn();
    }, delay + (Math.random() * 400 - 200));
  }

  function spawnAlert() {
    if (gameState !== 'playing') return;
    // Find empty tiles
    const empty = tiles.filter(t => !t.alert && !t.flash);
    if (empty.length === 0) return;

    const tile = empty[Math.floor(Math.random() * empty.length)];
    const type = getAlertType();
    const duration = ALERT_TYPES[type].duration + (Math.random() * 800 - 400);

    tiles = tiles.map(t => {
      if (t.id === tile.id) {
        return {
          ...t,
          alert: {
            type,
            label: pickLabel(type),
            duration,
            elapsed: 0
          },
          flash: null
        };
      }
      return t;
    });
  }

  function handleTileClick(tileId) {
    if (gameState !== 'playing') return;
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || !tile.alert) return;

    const type = tile.alert.type;
    const points = ALERT_TYPES[type].points;
    score += points;

    let flash;
    if (type === 'noise') {
      flash = 'fail'; // Clicked a false positive
    } else {
      flash = 'success';
      threatsNeutralized++;
    }

    tiles = tiles.map(t => {
      if (t.id === tileId) {
        return { ...t, alert: null, flash };
      }
      return t;
    });
    clearFlashes();
  }

  let flashTimeout;
  function clearFlashes() {
    clearTimeout(flashTimeout);
    flashTimeout = setTimeout(() => {
      tiles = tiles.map(t => t.flash ? { ...t, flash: null } : t);
    }, 600);
  }

  function endGame() {
    gameState = 'gameover';
    clearInterval(timerInterval);
    clearInterval(tickInterval);
    clearTimeout(spawnInterval);
    tiles = tiles.map(t => ({ ...t, alert: null, flash: null }));
  }

  function getGameOverMessage() {
    return GAME_OVER_MESSAGES.find(m => score >= m.min && score < m.max)?.msg || '';
  }

  function getAlertProgress(alert) {
    if (!alert) return 0;
    return 1 - (alert.elapsed / alert.duration);
  }

  // ─── LIFECYCLE ───
  onDestroy(() => {
    clearInterval(timerInterval);
    clearInterval(tickInterval);
    clearTimeout(spawnInterval);
    clearTimeout(flashTimeout);
  });
</script>

<section class="soc-game">
  <div class="game-header">
    <h3 class="game-title">SOC_ANALYST.exe</h3>
    <p class="game-subtitle">can you survive a 60-second shift?</p>
  </div>

  {#if gameState === 'playing'}
    <div class="hud">
      <div class="hud-item">
        <span class="hud-label">SCORE</span>
        <span class="hud-value" class:negative={score < 0}>{score}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">NEUTRALIZED</span>
        <span class="hud-value green">{threatsNeutralized}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">BREACHES</span>
        <span class="hud-value red">{breaches}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">TIME</span>
        <span class="hud-value" class:urgent={timeLeft <= 10}>{timeLeft}s</span>
      </div>
    </div>
  {/if}

  <div class="grid" class:idle={gameState === 'idle'} class:gameover={gameState === 'gameover'}>
    {#each tiles as tile (tile.id)}
      <button
        class="tile"
        class:has-alert={tile.alert}
        class:critical={tile.alert?.type === 'critical'}
        class:medium={tile.alert?.type === 'medium'}
        class:noise={tile.alert?.type === 'noise'}
        class:flash-success={tile.flash === 'success'}
        class:flash-fail={tile.flash === 'fail'}
        class:flash-breach={tile.flash === 'breach'}
        disabled={gameState !== 'playing'}
        on:click={() => handleTileClick(tile.id)}
      >
        <div class="tile-inner">
          {#if tile.alert}
            <div class="alert-progress" style="--progress: {getAlertProgress(tile.alert)}"></div>
            <span class="alert-severity">
              {tile.alert.type === 'critical' ? 'CRITICAL' : tile.alert.type === 'medium' ? 'MEDIUM' : 'LOW'}
            </span>
            <span class="alert-label">{tile.alert.label}</span>
          {:else if tile.flash === 'breach'}
            <span class="breach-text">BREACH</span>
          {:else if tile.flash === 'fail'}
            <span class="false-pos-text">FALSE +</span>
          {:else if tile.flash === 'success'}
            <span class="resolved-text">RESOLVED</span>
          {:else}
            <span class="tile-idle-text">—</span>
          {/if}
        </div>
      </button>
    {/each}

    {#if gameState === 'idle'}
      <div class="overlay">
        <div class="overlay-content">
          <p class="overlay-icon">&#9781;</p>
          <p class="overlay-title">SOC_ANALYST.exe</p>
          <p class="overlay-desc">Alerts incoming. Click threats.<br/>Ignore the noise. Don't let breaches through.</p>
          <p class="overlay-legend">
            <span class="legend-dot red-dot"></span> CRITICAL — click fast
            <span class="legend-dot yellow-dot"></span> MEDIUM — click to triage
            <span class="legend-dot green-dot"></span> LOW — don't touch
          </p>
          <button class="start-btn" on:click={startGame}>START SHIFT</button>
        </div>
      </div>
    {/if}

    {#if gameState === 'gameover'}
      <div class="overlay">
        <div class="overlay-content">
          <p class="overlay-score">{score}</p>
          <p class="overlay-msg">{getGameOverMessage()}</p>
          <div class="overlay-stats">
            <span>{threatsNeutralized} neutralized</span>
            <span class="stat-sep">&middot;</span>
            <span>{breaches} breaches</span>
          </div>
          <button class="start-btn" on:click={startGame}>ANOTHER SHIFT</button>
        </div>
      </div>
    {/if}
  </div>

  {#if gameState === 'playing'}
    <p class="game-hint">
      Click <span class="hint-red">red</span> & <span class="hint-yellow">yellow</span> alerts &middot; Ignore <span class="hint-green">green</span> noise
    </p>
  {/if}
</section>

<style>
  .soc-game {
    max-width: 560px;
    margin: 4rem auto 2rem;
    padding: 0 1rem;
    text-align: center;
  }

  .game-header {
    margin-bottom: 1.5rem;
  }

  .game-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--green, #22c55e);
    letter-spacing: 0.05em;
    margin: 0 0 0.3rem;
  }

  .game-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-dim, #737373);
    margin: 0;
  }

  /* ─── HUD ─── */
  .hud {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-family: 'JetBrains Mono', monospace;
  }

  .hud-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .hud-label {
    font-size: 0.55rem;
    color: var(--text-dim, #737373);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .hud-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text, #e5e5e5);
    transition: color 0.2s;
  }

  .hud-value.negative { color: #ef4444; }
  .hud-value.green { color: #22c55e; }
  .hud-value.red { color: #ef4444; }
  .hud-value.urgent { color: #ef4444; animation: pulse-urgent 0.5s ease infinite alternate; }

  @keyframes pulse-urgent {
    to { opacity: 0.5; }
  }

  /* ─── GRID ─── */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    position: relative;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 6px;
  }

  /* ─── TILES ─── */
  .tile {
    aspect-ratio: 4 / 3;
    background: var(--bg-card, #1a1a1a);
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
    padding: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  .tile:active:not(:disabled) {
    transform: scale(0.95);
  }

  .tile:disabled {
    cursor: default;
  }

  /* Scanline effect */
  .tile::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.08) 2px,
      rgba(0, 0, 0, 0.08) 4px
    );
    pointer-events: none;
    z-index: 2;
  }

  .tile-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 4px;
    position: relative;
    z-index: 1;
  }

  .tile-idle-text {
    color: #2a2a2a;
    font-size: 0.9rem;
  }

  /* ─── ALERT STATES ─── */
  .tile.has-alert {
    animation: alert-pop 0.15s ease-out;
  }

  .tile.critical {
    border-color: #ef4444;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.05);
  }

  .tile.medium {
    border-color: #eab308;
    box-shadow: 0 0 12px rgba(234, 179, 8, 0.25), inset 0 0 20px rgba(234, 179, 8, 0.05);
  }

  .tile.noise {
    border-color: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.2), inset 0 0 20px rgba(34, 197, 94, 0.05);
  }

  @keyframes alert-pop {
    0% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }

  /* Alert progress bar (depleting bottom border) */
  .alert-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: currentColor;
    width: calc(var(--progress) * 100%);
    transition: width 0.1s linear;
    z-index: 3;
  }

  .critical .alert-progress { color: #ef4444; }
  .medium .alert-progress { color: #eab308; }
  .noise .alert-progress { color: #22c55e; }

  .alert-severity {
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    margin-bottom: 2px;
  }

  .critical .alert-severity { color: #ef4444; }
  .medium .alert-severity { color: #eab308; }
  .noise .alert-severity { color: #22c55e; }

  .alert-label {
    font-size: 0.55rem;
    color: var(--text-mid, #a3a3a3);
    line-height: 1.2;
    text-align: center;
    word-break: break-word;
  }

  /* ─── FLASH STATES ─── */
  .tile.flash-success {
    animation: flash-green 0.6s ease-out;
  }
  .tile.flash-fail {
    animation: flash-yellow 0.6s ease-out;
  }
  .tile.flash-breach {
    animation: flash-red 0.6s ease-out;
  }

  @keyframes flash-green {
    0% { background: rgba(34, 197, 94, 0.4); border-color: #22c55e; }
    100% { background: var(--bg-card, #1a1a1a); border-color: #2a2a2a; }
  }
  @keyframes flash-yellow {
    0% { background: rgba(234, 179, 8, 0.3); border-color: #eab308; }
    100% { background: var(--bg-card, #1a1a1a); border-color: #2a2a2a; }
  }
  @keyframes flash-red {
    0%, 25% { background: rgba(239, 68, 68, 0.5); border-color: #ef4444; }
    100% { background: var(--bg-card, #1a1a1a); border-color: #2a2a2a; }
  }

  .breach-text {
    font-size: 0.7rem;
    font-weight: 700;
    color: #ef4444;
    letter-spacing: 0.15em;
    animation: breach-fade 0.6s ease-out forwards;
  }

  .false-pos-text {
    font-size: 0.65rem;
    font-weight: 600;
    color: #eab308;
    animation: breach-fade 0.6s ease-out forwards;
  }

  .resolved-text {
    font-size: 0.6rem;
    font-weight: 600;
    color: #22c55e;
    animation: breach-fade 0.6s ease-out forwards;
  }

  @keyframes breach-fade {
    0% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0; transform: scale(0.9); }
  }

  /* ─── OVERLAY ─── */
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 10, 0.92);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    backdrop-filter: blur(2px);
  }

  .overlay-content {
    text-align: center;
    padding: 1.5rem;
  }

  .overlay-icon {
    font-size: 2rem;
    margin: 0 0 0.5rem;
    color: var(--green, #22c55e);
  }

  .overlay-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--green, #22c55e);
    margin: 0 0 0.5rem;
    letter-spacing: 0.05em;
  }

  .overlay-desc {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-dim, #737373);
    margin: 0 0 1rem;
    line-height: 1.6;
  }

  .overlay-legend {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    color: var(--text-dim, #737373);
    margin: 0 0 1.2rem;
    line-height: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .legend-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
    vertical-align: middle;
  }
  .red-dot { background: #ef4444; }
  .yellow-dot { background: #eab308; }
  .green-dot { background: #22c55e; }

  .overlay-score {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text, #e5e5e5);
    margin: 0 0 0.3rem;
  }

  .overlay-msg {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--green, #22c55e);
    margin: 0 0 0.8rem;
    font-style: italic;
  }

  .overlay-stats {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-dim, #737373);
    margin: 0 0 1.2rem;
  }

  .stat-sep {
    margin: 0 0.4rem;
  }

  .start-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #111;
    background: var(--green, #22c55e);
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.5rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .start-btn:hover {
    background: #16a34a;
    transform: translateY(-1px);
  }

  .start-btn:active {
    transform: scale(0.97);
  }

  /* ─── HINT ─── */
  .game-hint {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--text-dim, #737373);
    margin-top: 0.8rem;
  }

  .hint-red { color: #ef4444; }
  .hint-yellow { color: #eab308; }
  .hint-green { color: #22c55e; }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 480px) {
    .soc-game {
      padding: 0 0.5rem;
    }

    .hud {
      gap: 0.8rem;
    }

    .hud-value {
      font-size: 0.9rem;
    }

    .alert-severity {
      font-size: 0.45rem;
    }

    .alert-label {
      font-size: 0.48rem;
    }

    .overlay-desc {
      font-size: 0.58rem;
    }
  }
</style>
