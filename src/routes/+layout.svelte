<slot />

<style>
  :global(*), :global(*::before), :global(*::after) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(:root) {
    --bg: #111111;
    --bg-card: #1a1a1a;
    --bg-card-hover: #1f1f1f;
    --text: #e5e5e5;
    --text-dim: #737373;
    --text-mid: #a3a3a3;
    --spine: #333333;
    --spine-glow: rgba(255, 255, 255, 0.08);
    --green: #22c55e;
    --green-dim: rgba(34, 197, 94, 0.15);
    --blue: #3b82f6;
    --blue-dim: rgba(59, 130, 246, 0.15);
    --purple: #a855f7;
    --purple-dim: rgba(168, 85, 247, 0.15);
    --font: 'Inter', -apple-system, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    position: relative;
  }

  :global(body::before) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 20%, rgba(34, 197, 94, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 30%, rgba(168, 85, 247, 0.035) 0%, transparent 55%),
      radial-gradient(ellipse 70% 50% at 50% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  :global(body > *) {
    position: relative;
    z-index: 1;
  }

  :global(::selection) {
    background: var(--blue);
    color: white;
  }
</style>
