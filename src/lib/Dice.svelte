<script>
	// A d20 in the footer. Roll it. A natural 20 opens my character sheet.
	import { onMount, tick } from 'svelte';

	let value = 20;
	let rolling = false;
	let rolls = 0;
	let message = 'Roll for initiative';
	let sheetOpen = false;
	let dialog;
	let reduce = false;
	let confettiEl;

	const lines = {
		1: 'Natural 1. The firewall wins this round.',
		2: 'Rough. Maybe patch Tuesday will be kinder.',
		10: 'Perfectly average. Very SOC 2.',
		13: 'Unlucky? Not with defense in depth.',
		19: 'So close. One more?'
	};

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	async function roll() {
		if (rolling) return;
		rolls++;
		// After a few honest rolls, the dice quietly start to like you
		const final = rolls >= 4 && Math.random() < 0.5 ? 20 : 1 + Math.floor(Math.random() * 20);
		if (reduce) {
			value = final;
		} else {
			rolling = true;
			for (let i = 0; i < 12; i++) {
				value = 1 + Math.floor(Math.random() * 20);
				await new Promise((r) => setTimeout(r, 40 + i * 12));
			}
			value = final;
			rolling = false;
		}
		if (final === 20) {
			message = 'Natural 20! You found the character sheet.';
			burst();
			await tick();
			sheetOpen = true;
			await tick();
			dialog?.showModal?.();
		} else {
			message = lines[final] || `You rolled a ${final}. ${rolls >= 3 ? 'Keep going, fortune favors the persistent.' : 'Try again?'}`;
		}
	}

	function close() {
		dialog?.close?.();
		sheetOpen = false;
	}

	function burst() {
		if (reduce || !confettiEl) return;
		const colors = ['var(--accent)', 'var(--ink-blue)', 'var(--gold)', 'var(--text)'];
		for (let i = 0; i < 60; i++) {
			const s = document.createElement('span');
			const angle = Math.random() * Math.PI * 2;
			const dist = 80 + Math.random() * 180;
			s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
			s.style.setProperty('--dy', `${Math.sin(angle) * dist - 120}px`);
			s.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
			s.style.background = colors[i % colors.length];
			s.style.animationDelay = `${Math.random() * 80}ms`;
			confettiEl.appendChild(s);
			setTimeout(() => s.remove(), 1400);
		}
	}
</script>

<div class="dice-wrap">
	<button class="d20" class:rolling on:click={roll} aria-label="Roll a twenty-sided die">
		<svg viewBox="0 0 100 100" aria-hidden="true">
			<polygon points="50,4 91,27 91,73 50,96 9,73 9,27" class="face" />
			<polygon points="50,24 75,66 25,66" class="inner" />
			<path d="M50 4 L50 24 M91 27 L75 66 M91 73 L75 66 M50 96 L75 66 M50 96 L25 66 M9 73 L25 66 M9 27 L25 66 M9 27 L50 24 M91 27 L50 24" class="edges" />
		</svg>
		<span class="num" class:nat20={value === 20 && rolls > 0}>{value}</span>
	</button>
	<p class="dice-msg" aria-live="polite">{message}</p>
	<div class="confetti" bind:this={confettiEl} aria-hidden="true"></div>
</div>

{#if sheetOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<dialog bind:this={dialog} class="sheet" on:close={() => (sheetOpen = false)} on:click|self={close}>
		<div class="sheet-inner">
			<header>
				<p class="eyebrow">Character sheet</p>
				<h3>Aaron Lindahl</h3>
				<p class="klass">Level 7 AI and Cloud Warden &middot; Lawful Good (mostly)</p>
			</header>
			<div class="stats">
				{#each [['STR', 12, 'Carries the on-call pager'], ['DEX', 14, 'Types faster in a crisis'], ['CON', 15, 'Survived 25 arch reviews'], ['INT', 18, 'CISSP, 11 certs'], ['WIS', 16, 'Knows when to say no'], ['CHA', 15, 'Ran Security Champions']] as [k, v, note]}
					<div class="stat">
						<span class="k">{k}</span>
						<span class="v">{v}</span>
						<span class="mod">+{Math.floor((v - 10) / 2)}</span>
						<span class="note">{note}</span>
					</div>
				{/each}
			</div>
			<dl class="traits">
				<dt>Proficiencies</dt><dd>AI security, AWS, Azure, GCP, zero trust, mTLS, threat modeling, Python, Terraform</dd>
				<dt>Languages</dt><dd>English, Korean (in progress), Rego, HCL</dd>
				<dt>Feat</dt><dd>Least Privilege: Advantage on saving throws against lateral movement.</dd>
				<dt>Background</dt><dd>Help desk to lead engineer. Gains inspiration when a design makes security invisible.</dd>
				<dt>Side quest</dt><dd>Builder of TableTales, where the Dungeon Master never cancels.</dd>
			</dl>
			<button class="close" on:click={close}>Close sheet</button>
		</div>
	</dialog>
{/if}

<style>
	.dice-wrap {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.d20 {
		position: relative;
		width: 56px;
		height: 56px;
		border: 0;
		background: none;
		cursor: pointer;
		color: var(--accent);
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
		flex-shrink: 0;
	}
	.d20:hover { transform: rotate(-14deg) scale(1.06); }
	.d20:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 8px; }
	.d20.rolling { animation: tumble 0.7s cubic-bezier(0.3, 0.7, 0.3, 1); }
	@keyframes tumble {
		0% { transform: rotate(0) translateY(0); }
		40% { transform: rotate(260deg) translateY(-14px); }
		100% { transform: rotate(720deg) translateY(0); }
	}
	svg { width: 100%; height: 100%; }
	.face { fill: var(--surface); stroke: currentColor; stroke-width: 3; stroke-linejoin: round; }
	.inner { fill: var(--accent-soft); stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
	.edges { stroke: currentColor; stroke-width: 2; fill: none; opacity: 0.6; }
	.num {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding-top: 10px;
		font: 700 15px/1 var(--mono);
		color: var(--text);
	}
	.num.nat20 { color: var(--accent); }
	.dice-msg { font-size: 14px; color: var(--muted); margin: 0; }
	.confetti { position: absolute; left: 28px; top: 28px; pointer-events: none; }
	.confetti :global(span) {
		position: absolute;
		width: 7px;
		height: 11px;
		border-radius: 2px;
		animation: pop 1.2s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
	}
	@keyframes pop {
		0% { transform: translate(0, 0) rotate(0); opacity: 1; }
		100% { transform: translate(var(--dx), calc(var(--dy) + 260px)) rotate(var(--r)); opacity: 0; }
	}

	.sheet {
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: 0;
		background: var(--surface);
		color: var(--text);
		max-width: min(560px, calc(100vw - 32px));
		width: 100%;
		box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.35);
	}
	.sheet::backdrop { background: rgba(26, 23, 20, 0.45); backdrop-filter: blur(3px); }
	.sheet[open] { animation: unfold 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
	@keyframes unfold { from { opacity: 0; transform: translateY(16px) scale(0.97); } }
	.sheet-inner { padding: 28px; }
	.eyebrow { font: 500 12px var(--mono); text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); margin: 0 0 6px; }
	h3 { font-family: var(--serif); font-size: 30px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
	.klass { color: var(--muted); margin: 4px 0 20px; font-size: 15px; }
	.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
	.stat {
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 10px;
		text-align: center;
		display: grid;
		gap: 2px;
		background: var(--bg);
	}
	.k { font: 600 11px var(--mono); letter-spacing: 0.1em; color: var(--muted); }
	.v { font-family: var(--serif); font-size: 26px; font-weight: 600; line-height: 1.1; }
	.mod { font: 500 12px var(--mono); color: var(--accent); }
	.note { font-size: 11.5px; color: var(--muted); line-height: 1.3; }
	.traits { display: grid; grid-template-columns: auto 1fr; gap: 8px 14px; margin: 0 0 22px; font-size: 14px; }
	dt { font: 600 12px var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding-top: 2px; }
	dd { margin: 0; }
	.close {
		font: 500 14px var(--sans);
		border: 1px solid var(--line);
		background: var(--bg);
		color: var(--text);
		padding: 9px 18px;
		border-radius: 999px;
		cursor: pointer;
	}
	.close:hover { border-color: var(--accent); color: var(--accent); }
	@media (max-width: 480px) {
		.stats { grid-template-columns: repeat(2, 1fr); }
		.traits { grid-template-columns: 1fr; }
	}
	@media (prefers-reduced-motion: reduce) {
		.d20, .d20:hover { transition: none; transform: none; }
		.sheet[open] { animation: none; }
	}
</style>
