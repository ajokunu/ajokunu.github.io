<script>
	// Small hand-made illustrations for the featured projects.
	export let kind = 'soc';
</script>

<svg viewBox="0 0 160 110" class="art {kind}" aria-hidden="true">
	{#if kind === 'soc'}
		<!-- A radar sweep over a tiny island -->
		<g class="rings">
			<circle cx="80" cy="55" r="46" />
			<circle cx="80" cy="55" r="32" />
			<circle cx="80" cy="55" r="18" />
		</g>
		<path class="island" d="M62 60c4-9 13-14 22-12s14 8 12 14-12 9-20 8-16-3-14-10z" />
		<g class="sweep"><path d="M80 55 L80 9 A46 46 0 0 1 116 27 Z" /></g>
		<circle class="blip b1" cx="104" cy="36" r="3" />
		<circle class="blip b2" cx="56" cy="78" r="2.5" />
		<circle class="blip b3" cx="98" cy="80" r="2" />
	{:else if kind === 'ml'}
		<!-- Real names on one side, hallucinated ones on the other -->
		<path class="boundary" d="M20 96 C60 80, 70 40, 140 14" />
		{#each [[30, 30], [44, 20], [52, 44], [34, 58], [62, 26], [24, 76], [70, 16], [48, 66]] as [x, y], i}
			<circle class="dot real" cx={x} cy={y} r="4" style="--i:{i}" />
		{/each}
		{#each [[108, 70], [126, 54], [96, 90], [134, 84], [116, 96], [140, 40], [88, 74], [122, 30]] as [x, y], i}
			<rect class="dot fake" x={x - 3.5} y={y - 3.5} width="7" height="7" rx="1.5" style="--i:{i}" />
		{/each}
	{:else if kind === 'cost'}
		<!-- A cost chart with one very suspicious day -->
		<line class="axis" x1="14" y1="94" x2="148" y2="94" />
		<path class="band" d="M14 72 L148 72 L148 84 L14 84 Z" />
		{#each [22, 18, 20, 24, 19, 21, 23, 20, 70, 22, 19, 21] as hgt, i}
			<rect class="bar" class:spike={hgt > 50} x={18 + i * 11} y={94 - hgt} width="7" height={hgt} rx="2" style="--i:{i}" />
		{/each}
		<text class="flag" x="100" y="16">!</text>
	{:else}
		<!-- A goldfinch on a rising savings line -->
		<path class="grow" d="M12 92 C40 88, 52 76, 72 72 S112 54, 148 30" />
		<path class="fill" d="M12 92 C40 88, 52 76, 72 72 S112 54, 148 30 L148 100 L12 100 Z" />
		<g class="bird" transform="translate(118 20)">
			<ellipse cx="10" cy="10" rx="11" ry="8" class="body" />
			<circle cx="18" cy="5" r="5" class="body" />
			<path d="M22 5 l5 1.5 -5 1.5z" class="beak" />
			<path d="M2 9 q6 -8 13 -2 q-6 2 -13 2z" class="wing" />
			<circle cx="19" cy="4" r="0.9" class="eye" />
		</g>
	{/if}
</svg>

<style>
	.art { width: 100%; height: 100%; display: block; }
	.rings circle { fill: none; stroke: var(--line); stroke-width: 1.2; }
	.island { fill: var(--surface-2); stroke: var(--muted); stroke-width: 1; }
	.sweep { transform-origin: 80px 55px; animation: sweep 5s linear infinite; }
	.sweep path { fill: var(--accent-soft); }
	.blip { fill: var(--accent); animation: blip 5s ease-out infinite; }
	.b2 { animation-delay: 2.4s; fill: var(--ink-blue); }
	.b3 { animation-delay: 3.6s; }
	@keyframes sweep { to { transform: rotate(360deg); } }
	@keyframes blip { 0%, 60%, 100% { opacity: 0.25; } 10% { opacity: 1; } }

	.boundary { fill: none; stroke: var(--muted); stroke-width: 1.4; stroke-dasharray: 4 5; }
	.dot { transition: transform 0.5s var(--ease); transform-box: fill-box; transform-origin: center; }
	.real { fill: var(--ink-blue); }
	.fake { fill: var(--accent); }
	:global(.feature:hover) .dot { transform: scale(1.35); transition-delay: calc(var(--i) * 30ms); }

	.axis { stroke: var(--line); stroke-width: 1.4; }
	.band { fill: var(--surface-2); }
	.bar { fill: var(--muted); opacity: 0.45; transform-box: fill-box; transform-origin: bottom; transition: transform 0.5s var(--ease); }
	.bar.spike { fill: var(--accent); opacity: 1; }
	.flag { font: 700 18px var(--serif); fill: var(--accent); }
	:global(.feature:hover) .bar:not(.spike) { transform: scaleY(0.8); transition-delay: calc(var(--i) * 25ms); }

	.grow { fill: none; stroke: var(--gold); stroke-width: 2.4; stroke-linecap: round; }
	.fill { fill: var(--gold); opacity: 0.12; }
	.body { fill: var(--gold); }
	.wing { fill: var(--text); opacity: 0.8; }
	.beak { fill: var(--accent); }
	.eye { fill: var(--text); }
	.bird { animation: bob 3s ease-in-out infinite; }
	@keyframes bob { 50% { transform: translate(118px, 16px); } }

	@media (prefers-reduced-motion: reduce) {
		.sweep, .blip, .bird { animation: none; }
	}
</style>
