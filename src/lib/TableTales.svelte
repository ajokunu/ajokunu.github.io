<script>
	// The flagship. A tiny playable scene shows what an AI Game Master feels like.
	// The scene is scripted for this page; the real thing lives at app.tabletalesai.com.
	import { onMount, tick } from 'svelte';
	import { tableTales as tt } from '$lib/data.js';

	const opening = {
		who: 'gm',
		text: 'The rope bridge over the Chasm of Whispers creaks under your boots. On the far side, something large shifts in the fog and exhales. What do you do?'
	};

	const actions = [
		{
			id: 'sneak', label: 'Sneak past it', skill: 'Stealth', mod: 5, dc: 13,
			player: 'Mira the rogue drops low and edges along the ropes.',
			win: 'Your steps are silent. The shape is a sleeping owlbear, curled around a rusted strongbox. You are close enough to touch the lock.',
			lose: 'A plank snaps. Two amber eyes open in the fog. The owlbear rises, and it looks personally offended.'
		},
		{
			id: 'talk', label: 'Talk to it', skill: 'Persuasion', mod: 3, dc: 15,
			player: 'Bram the bard clears his throat and offers a friendly greeting.',
			win: 'A deep voice answers: "Finally, someone polite." The fog parts to reveal an ancient bronze dragon who has been waiting a very long time for company.',
			lose: 'The fog goes silent. Then, very slowly, something starts to laugh. It is not a friendly laugh.'
		},
		{
			id: 'look', label: 'Study the fog', skill: 'Arcana', mod: 4, dc: 12,
			player: 'Sera the wizard narrows her eyes and reads the weave of the mist.',
			win: 'This fog is an illusion, and a sloppy one. Behind it, a nervous kobold works a bellows and a very large puppet.',
			lose: 'The mist feels old and wrong, like a ward drawn by someone who hates visitors. Your head starts to ache.'
		}
	];

	let log = [opening];
	let busy = false;
	let played = new Set();
	let die = null;
	let logEl;
	let reduce = false;

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

	async function scroll() {
		await tick();
		logEl?.scrollTo({ top: logEl.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
	}

	async function act(a) {
		if (busy) return;
		busy = true;
		played.add(a.id);
		played = played;
		log = [...log, { who: 'player', text: a.player }];
		await scroll();
		await wait(450);

		// Roll with a little suspense
		const roll = 1 + Math.floor(Math.random() * 20);
		die = { value: 1, skill: a.skill, rolling: true };
		for (let i = 0; i < 9; i++) {
			die = { ...die, value: 1 + Math.floor(Math.random() * 20) };
			await wait(55 + i * 10);
		}
		const total = roll + a.mod;
		const ok = roll === 20 || (roll !== 1 && total >= a.dc);
		die = { value: roll, skill: a.skill, rolling: false };
		log = [...log, { who: 'roll', text: `${a.skill} check: ${roll} + ${a.mod} = ${total} vs DC ${a.dc}`, ok }];
		await scroll();
		await wait(600);

		log = [...log, { who: 'gm', text: roll === 20 ? 'Natural 20! ' + a.win : ok ? a.win : a.lose }];
		await scroll();
		busy = false;
	}

	function reset() {
		log = [opening];
		played = new Set();
		die = null;
	}
</script>

<div class="tt">
	<div class="copy">
		<p class="eyebrow-small">Flagship project · live</p>
		<h3 class="name">
			<span class="table">Table</span><span class="tales">Tales</span>
		</h3>
		<p class="tagline">{tt.tagline}</p>
		<p class="pitch">{tt.pitch}</p>

		<div class="chips" aria-label="Supported game systems">
			{#each tt.systems as s}<span class="chip">{s}</span>{/each}
		</div>
		<ul class="modes">
			{#each tt.modes as m}<li>{m}</li>{/each}
		</ul>

		<div class="ctas">
			<a class="play" href={tt.url} target="_blank" rel="noopener">
				Play TableTales
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
			</a>
			<a class="more" href={tt.post} target="_blank" rel="noopener">How I made the AI Game Master safe</a>
		</div>
	</div>

	<div class="scene" aria-label="Example scene with an AI Game Master">
		<div class="scene-head">
			<span class="dot"></span>
			<span class="scene-title">Example scene</span>
			<span class="scene-sys">D&amp;D 5e · 3 players</span>
		</div>

		<ol class="log" bind:this={logEl} aria-live="polite">
			{#each log as line, i (i)}
				<li class="line {line.who}" class:ok={line.ok === true} class:fail={line.ok === false}>
					{#if line.who === 'gm'}<span class="who">Game Master</span>{/if}
					{#if line.who === 'roll'}
						<svg class="mini-d20" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,6 90,28 90,72 50,94 10,72 10,28" /></svg>
					{/if}
					<span class="text">{line.text}</span>
				</li>
			{/each}
			{#if die?.rolling}
				<li class="line roll rolling"><span class="big-die">{die.value}</span><span class="text">Rolling {die.skill}...</span></li>
			{/if}
		</ol>

		<div class="actions">
			{#if played.size < actions.length}
				<span class="prompt">Choose an action:</span>
				{#each actions as a}
					<button on:click={() => act(a)} disabled={busy || played.has(a.id)}>{a.label}</button>
				{/each}
			{:else}
				<span class="prompt">That is the demo. The real campaign keeps going.</span>
				<button on:click={reset}>Play again</button>
				<a class="btn-link" href={tt.url} target="_blank" rel="noopener">Start a real one</a>
			{/if}
		</div>
	</div>
</div>

<div class="pillars">
	{#each tt.pillars as p}
		<div class="pillar">
			<h4>{p.k}</h4>
			<p>{p.v}</p>
		</div>
	{/each}
</div>

<style>
	.tt {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		padding: 28px;
		border-radius: 26px;
		border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line));
		background:
			radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%),
			color-mix(in srgb, var(--surface) 92%, transparent);
		backdrop-filter: blur(6px);
		box-shadow: var(--shadow);
	}
	.eyebrow-small {
		font: 500 11.5px var(--mono);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gold);
		margin: 0 0 6px;
	}
	.name {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2.4rem, 1.8rem + 2vw, 3.3rem);
		line-height: 1;
		letter-spacing: -0.03em;
		font-weight: 600;
	}
	.tales { font-style: italic; font-weight: 400; color: var(--accent); }
	.tagline {
		margin: 10px 0 14px;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.15rem;
	}
	.pitch { margin: 0 0 18px; color: var(--muted); font-size: 15.5px; max-width: 60ch; }
	.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
	.chip {
		font: 600 12px var(--mono);
		padding: 5px 11px;
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--accent);
	}
	.modes { list-style: none; margin: 0 0 22px; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 14px; }
	.modes li::before { content: '✦'; color: var(--gold); margin-right: 6px; font-size: 10px; vertical-align: 2px; }
	.ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px; }
	.play {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 11px 20px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--bg);
		font-weight: 600;
		text-decoration: none;
		transition: transform 0.3s var(--ease), box-shadow 0.3s;
	}
	.play svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.2; transition: transform 0.3s var(--ease); }
	.play:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -10px var(--accent); }
	.play:hover svg { transform: translate(2px, -2px); }
	.more {
		font-size: 14px;
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--line);
		text-underline-offset: 4px;
		transition: text-decoration-color 0.3s;
	}
	.more:hover { text-decoration-color: var(--accent); }

	/* The scene: a little felt-topped table */
	.scene {
		display: flex;
		flex-direction: column;
		border-radius: 18px;
		border: 1px solid var(--line);
		background: var(--bg);
		overflow: hidden;
		height: 380px;
	}
	.scene-head {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--line);
		font: 500 12px var(--mono);
		color: var(--muted);
	}
	.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); }
	.scene-title { color: var(--text); }
	.scene-sys { margin-left: auto; }
	.log {
		list-style: none;
		margin: 0;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		flex: 1;
		font-size: 14px;
		line-height: 1.5;
	}
	.line { max-width: 92%; animation: in 0.35s var(--ease); }
	@keyframes in { from { opacity: 0; transform: translateY(6px); } }
	.line.gm {
		align-self: flex-start;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 4px 14px 14px 14px;
		padding: 10px 12px;
		font-family: var(--serif);
		font-size: 15px;
	}
	.who { display: block; font: 600 10.5px var(--mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 3px; }
	.line.player {
		align-self: flex-end;
		background: var(--accent);
		color: var(--bg);
		border-radius: 14px 4px 14px 14px;
		padding: 9px 12px;
	}
	.line.roll {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font: 500 12.5px var(--mono);
		color: var(--muted);
		padding: 4px 12px;
		border-radius: 999px;
		border: 1px dashed var(--line);
	}
	.line.roll.ok { color: var(--gold); border-color: color-mix(in srgb, var(--gold) 50%, var(--line)); }
	.line.roll.fail { color: var(--ink-blue); }
	.mini-d20 { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 8; }
	.big-die {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--surface-2);
		color: var(--text);
		font-weight: 700;
		animation: shake 0.12s linear infinite alternate;
	}
	@keyframes shake { to { transform: rotate(14deg) scale(1.08); } }
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 12px 14px;
		border-top: 1px solid var(--line);
		background: var(--surface);
	}
	.prompt { font-size: 13px; color: var(--muted); margin-right: 4px; }
	@media (max-width: 640px) { .prompt { width: 100%; } .scene { height: 420px; } }
	.actions button, .btn-link {
		font: 500 13.5px var(--sans);
		padding: 7px 13px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--bg);
		color: var(--text);
		cursor: pointer;
		text-decoration: none;
		transition: border-color 0.25s, color 0.25s, transform 0.25s var(--ease);
	}
	.actions button:hover:not(:disabled), .btn-link:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
	.actions button:disabled { opacity: 0.4; cursor: default; }

	.pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 16px; }
	.pillar { padding: 16px 18px; border-left: 2px solid color-mix(in srgb, var(--accent) 45%, var(--line)); }
	.pillar h4 { margin: 0 0 4px; font-size: 14.5px; font-weight: 600; }
	.pillar p { margin: 0; font-size: 14px; color: var(--muted); line-height: 1.5; }

	@media (max-width: 640px) {
		.tt { padding: 18px; border-radius: 20px; }
		.pillars { grid-template-columns: 1fr; gap: 4px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.line, .big-die { animation: none; }
	}
</style>
