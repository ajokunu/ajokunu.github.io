<slot />

<style>
	:global(:root) {
		--bg: #f4f3ec;
		--surface: #fbfbf6;
		--surface-2: #e9e8dd;
		--text: #23261f;
		--muted: #62665a;
		--line: #dcdace;
		--accent: #2c5c8f;
		--accent-soft: rgba(44, 92, 143, 0.11);
		--ink-blue: #9a5a2e;
		--gold: #6f8a3c;
		--topo: rgba(140, 95, 55, 0.2);
		--topo-accent: rgba(44, 92, 143, 0.4);
		--shadow: 0 1px 2px rgba(60, 40, 20, 0.04), 0 12px 32px -12px rgba(60, 40, 20, 0.14);

		--serif: 'Fraunces', Georgia, serif;
		--sans: 'Inter', -apple-system, 'Segoe UI', sans-serif;
		--mono: 'JetBrains Mono', ui-monospace, monospace;
		--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
		color-scheme: light;
	}

	:global(:root[data-theme='dark']) {
		--bg: #171a17;
		--surface: #1e221e;
		--surface-2: #272b26;
		--text: #e8eadf;
		--muted: #9ea291;
		--line: #353a33;
		--accent: #8db8e3;
		--accent-soft: rgba(141, 184, 227, 0.13);
		--ink-blue: #d49a6a;
		--gold: #a9c46e;
		--topo: rgba(212, 160, 110, 0.13);
		--topo-accent: rgba(141, 184, 227, 0.4);
		--shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 16px 40px -16px rgba(0, 0, 0, 0.6);
		color-scheme: dark;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) {
			--bg: #171a17;
			--surface: #1e221e;
			--surface-2: #272b26;
			--text: #e8eadf;
			--muted: #9ea291;
			--line: #353a33;
			--accent: #8db8e3;
			--accent-soft: rgba(141, 184, 227, 0.13);
			--ink-blue: #d49a6a;
			--gold: #a9c46e;
			--topo: rgba(212, 160, 110, 0.13);
			--topo-accent: rgba(141, 184, 227, 0.4);
			--shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 16px 40px -16px rgba(0, 0, 0, 0.6);
			color-scheme: dark;
		}
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
		-webkit-text-size-adjust: 100%;
	}

	:global(body) {
		margin: 0;
		font-family: var(--sans);
		font-size: clamp(15.5px, 0.95rem + 0.2vw, 17px);
		line-height: 1.65;
		background: var(--bg);
		color: var(--text);
		-webkit-font-smoothing: antialiased;
		transition: background-color 0.4s var(--ease), color 0.4s var(--ease);
		overflow-x: hidden;
	}

	:global(a) {
		color: inherit;
	}

	:global(::selection) {
		background: var(--accent);
		color: var(--bg);
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
		:global(*) {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}
	}
</style>
