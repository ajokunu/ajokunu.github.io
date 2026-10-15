<script>
	import { onMount } from 'svelte';
	import {
		profile, about, experience, featured, projects, sideQuests,
		writing, nessusSeries, certs, education, affiliations, toolbox
	} from '$lib/data.js';
	import Topo from '$lib/Topo.svelte';
	import Dice from '$lib/Dice.svelte';
	import Art from '$lib/Art.svelte';
	import TableTales from '$lib/TableTales.svelte';

	const sections = [
		{ id: 'about', label: 'About' },
		{ id: 'tabletales', label: 'TableTales' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'work', label: 'Work' },
		{ id: 'writing', label: 'Writing' },
		{ id: 'credentials', label: 'Credentials' },
		{ id: 'side-quests', label: 'Side quests' }
	];

	let active = 'about';
	let email = '';
	let theme = 'light';
	let localTime = '';
	let greeting = 'Hello';
	let copied = false;

	// Scroll to a section without touching the URL, so it works under any router
	function jump(e, id) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
		el.querySelector('h2')?.focus?.({ preventScroll: true });
	}

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try { localStorage.setItem('theme', theme); } catch (e) {}
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			setTimeout(() => (copied = false), 1800);
		} catch (e) {
			location.href = `mailto:${email}`;
		}
	}

	// Card spotlight: a warm glow that follows the pointer
	function spotlight(node) {
		const move = (e) => {
			const r = node.getBoundingClientRect();
			node.style.setProperty('--x', `${e.clientX - r.left}px`);
			node.style.setProperty('--y', `${e.clientY - r.top}px`);
		};
		node.addEventListener('pointermove', move);
		return { destroy: () => node.removeEventListener('pointermove', move) };
	}

	function tickClock() {
		const now = new Date();
		localTime = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
		const h = Number(now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }));
		greeting = h < 5 ? 'Up late?' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
	}

	onMount(() => {
		email = profile.emailParts.join('@');
		const stored = document.documentElement.dataset.theme;
		theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		document.documentElement.classList.add('js');

		tickClock();
		const clock = setInterval(tickClock, 30000);

		// Reveal on scroll
		const reveal = new IntersectionObserver(
			(entries) => entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add('in');
					reveal.unobserve(e.target);
				}
			}),
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);
		document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

		// Scroll spy for the nav
		const spy = new IntersectionObserver(
			(entries) => entries.forEach((e) => { if (e.isIntersecting) active = e.target.id; }),
			{ rootMargin: '-40% 0px -55% 0px' }
		);
		sections.forEach((s) => { const el = document.getElementById(s.id); if (el) spy.observe(el); });

		return () => { clearInterval(clock); reveal.disconnect(); spy.disconnect(); };
	});
</script>

<svelte:head>
	<title>Aaron Lindahl · AI and Cloud Security Engineer</title>
</svelte:head>

<Topo />

<a class="skip" href="#about" on:click={(e) => jump(e, 'about')}>Skip to content</a>

<div class="shell">
	<!-- LEFT: who I am, always in view on desktop -->
	<header class="intro">
		<div class="intro-inner">
			<div class="topline">
				<span class="clock" title="My local time">
					<span class="pulse" aria-hidden="true"></span>
					{greeting} from New York{localTime ? `, ${localTime}` : ''}
				</span>
				<button class="theme" on:click={toggleTheme} aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} mode">
					<svg viewBox="0 0 24 24" aria-hidden="true" class:dark={theme === 'dark'}>
						<circle class="sun" cx="12" cy="12" r="5" />
						<g class="rays">
							{#each Array(8) as _, i}
								<g transform="rotate({i * 45} 12 12)"><line x1="12" y1="1.5" x2="12" y2="4" /></g>
							{/each}
						</g>
						<circle class="bite" cx="17" cy="8" r="5" />
					</svg>
				</button>
			</div>

			<img class="portrait" src={profile.avatar} alt="Aaron Lindahl" width="88" height="88" />

			<h1>
				<span class="hi">Hi, I’m</span>
				{profile.name}
			</h1>
			<p class="korean" lang="ko">{profile.koreanName}</p>

			<p class="role">
				<span class="scribble">
					{profile.role}
					<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
						<path d="M3 13 C 60 5, 120 17, 180 9 S 270 6, 297 11" />
					</svg>
				</span>
				at {profile.company}
			</p>
			<p class="lede">{profile.oneLiner}</p>
			<a class="building" href="#tabletales" on:click={(e) => jump(e, 'tabletales')}>
				<span class="building-dot" aria-hidden="true"></span>
				<span>Now building <strong>TableTales</strong>, an AI Game Master</span>
				<span aria-hidden="true">→</span>
			</a>

			<nav aria-label="Sections">
				<ol>
					{#each sections as s, i}
						<li>
							<a href="#{s.id}" on:click={(e) => jump(e, s.id)} class:active={active === s.id} aria-current={active === s.id ? 'true' : undefined}>
								<span class="idx">0{i + 1}</span>
								<span class="rule" aria-hidden="true"></span>
								<span class="label">{s.label}</span>
							</a>
						</li>
					{/each}
				</ol>
			</nav>

			<div class="links">
				<a href={profile.linkedin} target="_blank" rel="noopener" class="pill">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
					LinkedIn
				</a>
				<a href={profile.github} target="_blank" rel="noopener" class="pill">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.1.83-.26.83-.58v-2.23c-3.34.73-4.04-1.41-4.04-1.41-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
					GitHub
				</a>
				<a href={profile.medium} target="_blank" rel="noopener" class="pill">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
					Medium
				</a>
				{#if email}
					<button class="pill" on:click={copyEmail}>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.2L4 7.3V17h16V7.3l-8 4.9zM5.2 7l6.8 4.1L18.8 7H5.2z"/></svg>
						{copied ? 'Copied!' : 'Email'}
					</button>
				{/if}
			</div>
		</div>
	</header>

	<!-- RIGHT: the story -->
	<main>
		<section id="about" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">About</h2>
			<div class="prose reveal">
				{#each about as para}
					<p>{para}</p>
				{/each}
			</div>
			<div class="now reveal">
				<div class="now-item">
					<span class="now-k">Day job</span>
					<span class="now-v">AI and cloud security at Capital One</span>
				</div>
				<div class="now-item">
					<span class="now-k">Building</span>
					<span class="now-v">TableTales, an AI Game Master</span>
				</div>
				<div class="now-item">
					<span class="now-k">Studying</span>
					<span class="now-v">M.Eng Cybersecurity, NYU Tandon</span>
				</div>
			</div>
		</section>

		<section id="tabletales" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">What I am building</h2>
			<div class="reveal"><TableTales /></div>
		</section>

		<section id="experience" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">Experience</h2>
			<ol class="jobs">
				{#each experience as job}
					<li class="job reveal" class:current={job.current} use:spotlight>
						<div class="job-when">
							<span>{job.dates}</span>
						</div>
						<div class="job-body">
							<h3>
								{job.title}
								<span class="at">·</span>
								<span class="company">{job.company}</span>
								{#if job.current}<span class="now-badge">Now</span>{/if}
							</h3>
							{#if job.team}<p class="team">{job.team}</p>{/if}
							<ul>
								{#each job.points as pt}
									<li>{pt}</li>
								{/each}
							</ul>
							<div class="tags">
								{#each job.tags as t}<span class="tag">{t}</span>{/each}
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>

		<section id="work" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">Selected work</h2>
			<p class="section-note reveal">Things I built on my own time, mostly to learn something the hard way.</p>
			<div class="features">
				{#each featured as p}
					<article class="feature reveal" use:spotlight>
						<div class="feature-art"><Art kind={p.art} /></div>
						<div class="feature-body">
							<p class="kicker">{p.kicker}</p>
							<h3><a href={p.url} target="_blank" rel="noopener" class="stretch">{p.name}</a></h3>
							<p class="blurb">{p.blurb}</p>
							<ul class="stats">
								{#each p.stats as s}<li>{s}</li>{/each}
							</ul>
							<div class="feature-foot">
								<div class="tags">
									{#each p.tags as t}<span class="tag">{t}</span>{/each}
								</div>
								{#if p.post}
									<a class="read" href={p.post} target="_blank" rel="noopener">Read the write-up</a>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>

			<h3 class="sub reveal">More from the workbench</h3>
			<div class="grid">
				{#each projects as p}
					<a class="mini reveal" href={p.url} target="_blank" rel="noopener" use:spotlight>
						<span class="mini-name">{p.name}<span class="arrow" aria-hidden="true">↗</span></span>
						<span class="mini-blurb">{p.blurb}</span>
						<span class="tags">{#each p.tags as t}<span class="tag">{t}</span>{/each}</span>
					</a>
				{/each}
			</div>
		</section>

		<section id="writing" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">Writing</h2>
			<p class="section-note reveal">I write on Medium about cloud security, usually after I have broken something and figured out why.</p>
			<ul class="posts">
				{#each writing as w}
					<li class="reveal">
						<a href={w.url} target="_blank" rel="noopener">
							<span class="post-topic">{w.topic}</span>
							<span class="post-title">{w.title}</span>
							{#if w.date}<span class="post-date">{w.date}</span>{/if}
						</a>
					</li>
				{/each}
			</ul>
			<a class="series reveal" href={nessusSeries.url} target="_blank" rel="noopener" use:spotlight>
				<span class="series-count">{nessusSeries.count}</span>
				<span>
					<span class="series-title">{nessusSeries.title}</span>
					<span class="series-blurb">{nessusSeries.blurb}</span>
				</span>
			</a>
		</section>

		<section id="credentials" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">Credentials</h2>
			<div class="certs reveal">
				{#each certs as c}
					<span class="cert" class:gold={c.tier === 'gold'}>
						<span class="cert-name">{c.name}</span>
						<span class="cert-org">{c.org}</span>
					</span>
				{/each}
			</div>
			<div class="two-col">
				<div class="reveal">
					<h3 class="sub">Education</h3>
					<ul class="edu">
						{#each education as e}
							<li>
								<span class="edu-degree">{e.degree}</span>
								<span class="edu-meta">{e.school} · {e.year}</span>
							</li>
						{/each}
					</ul>
					<h3 class="sub">Community</h3>
					<ul class="edu">
						{#each affiliations as a}<li><span class="edu-degree">{a}</span></li>{/each}
					</ul>
				</div>
				<div class="reveal">
					<h3 class="sub">Toolbox</h3>
					{#each toolbox as g}
						<div class="tool-row">
							<span class="tool-k">{g.label}</span>
							<span class="tool-v">{g.items.join(' · ')}</span>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section id="side-quests" class="block">
			<h2 class="eyebrow reveal" tabindex="-1">Side quests</h2>
			<p class="section-note reveal">When I am not on call, I am usually a Dungeon Master. Some of that leaks into code.</p>
			<div class="quests">
				{#each sideQuests as q, i}
					<a class="quest reveal" href={q.url} target="_blank" rel="noopener" style="--tilt:{i % 2 ? 1.2 : -1.2}deg">
						<span class="glyph" aria-hidden="true">
							{#if q.glyph === 'book'}
								<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z"/><path d="M4 19a2 2 0 012-2h13"/><path d="M9 8h6"/></svg>
							{:else if q.glyph === 'ring'}
								<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="8" ry="6"/><ellipse cx="12" cy="13" rx="5" ry="3.4"/><path d="M9 6l3-3 3 3"/></svg>
							{:else if q.glyph === 'cube'}
								<svg viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/></svg>
							{:else if q.glyph === 'disc'}
								<svg viewBox="0 0 24 24"><ellipse cx="12" cy="10" rx="9" ry="4"/><path d="M3 10v2c0 2.2 4 4 9 4s9-1.8 9-4v-2"/><path d="M8 19l-1 3M16 19l1 3"/></svg>
							{:else}
								<svg viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></svg>
							{/if}
						</span>
						<span class="quest-name">{q.name}</span>
						<span class="quest-blurb">{q.blurb}</span>
					</a>
				{/each}
			</div>
		</section>

		<footer class="foot">
			<div class="foot-cta reveal">
				<h2>Let’s talk.</h2>
				<p>I am always happy to chat about AI security, cloud architecture, zero trust, or your next campaign’s villain. If you want to see what an AI Game Master can do, <a href="https://app.tabletalesai.com/" target="_blank" rel="noopener">pull up a chair at TableTales</a>.</p>
				<div class="links">
					<a class="pill solid" href={profile.linkedin} target="_blank" rel="noopener">Message me on LinkedIn</a>
					{#if email}<a class="pill" href="mailto:{email}">{email}</a>{/if}
				</div>
			</div>
			<Dice />
			<p class="colophon">
				Set in Fraunces and Inter. The map behind this page is generated live, and it moves when you do.
				Built with SvelteKit, hosted on GitHub Pages.
			</p>
		</footer>
	</main>
</div>

<style>
	.skip {
		position: absolute;
		left: -9999px;
		top: 8px;
		z-index: 10;
		background: var(--text);
		color: var(--bg);
		padding: 8px 14px;
		border-radius: 8px;
	}
	.skip:focus { left: 8px; }

	.shell {
		position: relative;
		z-index: 1;
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 clamp(20px, 5vw, 56px);
		display: grid;
		grid-template-columns: minmax(300px, 0.9fr) 1.35fr;
		gap: clamp(32px, 6vw, 96px);
	}

	/* ---------- Intro (left column) ---------- */
	.intro {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100dvh;
		display: flex;
		padding: 48px 0;
		overflow-y: auto;
		scrollbar-width: none;
	}
	.intro::-webkit-scrollbar { display: none; }
	.intro-inner { margin-block: auto; }
	.intro-inner { width: 100%; }


	.topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 36px;
	}
	.clock {
		font: 500 12.5px var(--mono);
		color: var(--muted);
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #4a9d6b;
		box-shadow: 0 0 0 0 rgba(74, 157, 107, 0.5);
		animation: pulse 2.4s ease-out infinite;
	}
	@keyframes pulse { 70% { box-shadow: 0 0 0 8px rgba(74, 157, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(74, 157, 107, 0); } }

	.theme {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--text);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: border-color 0.3s, transform 0.3s var(--ease);
	}
	.theme:hover { border-color: var(--accent); transform: rotate(-12deg); }
	.theme svg { width: 20px; height: 20px; overflow: visible; }
	.sun { fill: currentColor; transition: r 0.5s var(--ease); }
	.rays line { stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
	.rays { transition: opacity 0.4s, transform 0.5s var(--ease); transform-origin: 12px 12px; }
	.bite { fill: var(--surface); transform: translate(8px, -8px); transition: transform 0.5s var(--ease); }
	.dark .sun { r: 8; }
	.dark .rays { opacity: 0; transform: scale(0.5) rotate(45deg); }
	.dark .bite { transform: translate(0, 0); }

	.portrait {
		width: 88px;
		height: 88px;
		border-radius: 28px;
		object-fit: cover;
		display: block;
		margin-bottom: 22px;
		box-shadow: var(--shadow);
		transform: rotate(-3deg);
		transition: transform 0.5s var(--ease), border-radius 0.5s var(--ease);
	}
	.portrait:hover { transform: rotate(2deg) scale(1.04); border-radius: 50%; }

	h1 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(2.6rem, 1.8rem + 3vw, 4.1rem);
		line-height: 1.02;
		letter-spacing: -0.025em;
		margin: 0;
		font-variation-settings: 'SOFT' 50, 'opsz' 144;
	}
	.hi {
		display: block;
		font-size: 0.42em;
		font-style: italic;
		font-weight: 400;
		color: var(--muted);
		letter-spacing: 0;
		margin-bottom: 6px;
	}
	.korean { margin: 8px 0 0; font-size: 14px; color: var(--muted); letter-spacing: 0.08em; }

	.role {
		margin: 22px 0 10px;
		font-size: 1.12rem;
		font-weight: 500;
	}
	.scribble { position: relative; display: inline-block; color: var(--accent); }
	.scribble svg {
		position: absolute;
		left: -2%;
		bottom: -9px;
		width: 104%;
		height: 12px;
		overflow: visible;
	}
	.scribble path {
		fill: none;
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-dasharray: 320;
		stroke-dashoffset: 320;
		animation: draw 1.1s 0.5s var(--ease) forwards;
		opacity: 0.55;
	}
	@keyframes draw { to { stroke-dashoffset: 0; } }

	.lede { color: var(--muted); max-width: 42ch; margin: 18px 0 0; }
	.building {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
		padding: 6px 12px 6px 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--gold) 45%, var(--line));
		background: color-mix(in srgb, var(--gold) 8%, var(--surface));
		font-size: 13.5px;
		text-decoration: none;
		transition: transform 0.3s var(--ease), border-color 0.3s;
	}
	.building strong { font-weight: 600; color: var(--accent); }
	.building:hover { transform: translateX(3px); border-color: var(--accent); }
	.building-dot { width: 8px; height: 8px; border-radius: 2px; background: var(--gold); transform: rotate(45deg); animation: glint 2.6s ease-in-out infinite; }
	@keyframes glint { 50% { transform: rotate(225deg) scale(0.7); } }

	nav { margin: 40px 0 36px; }
	nav ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
	nav a {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 5px 0;
		text-decoration: none;
		color: var(--muted);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		transition: color 0.25s;
	}
	.idx { font: 500 11px var(--mono); opacity: 0.7; }
	.rule { width: 28px; height: 1.5px; background: currentColor; transition: width 0.35s var(--ease); opacity: 0.6; }
	nav a:hover, nav a.active { color: var(--text); }
	nav a:hover .rule, nav a.active .rule { width: 60px; opacity: 1; }
	nav a.active .rule { background: var(--accent); }

	.links { display: flex; flex-wrap: wrap; gap: 8px; }
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--text);
		font: 500 13.5px var(--sans);
		text-decoration: none;
		cursor: pointer;
		transition: border-color 0.25s, transform 0.25s var(--ease), color 0.25s;
	}
	.pill svg { width: 15px; height: 15px; fill: currentColor; }
	.pill:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
	.pill:hover svg { animation: boop 0.45s var(--ease); }
	@keyframes boop { 40% { transform: rotate(-14deg) scale(1.15); } }
	.pill.solid { background: var(--text); color: var(--bg); border-color: var(--text); }
	.pill.solid:hover { background: var(--accent); border-color: var(--accent); color: var(--bg); }

	/* ---------- Main (right column) ---------- */
	main { padding: 96px 0 64px; min-width: 0; }
	.block { scroll-margin-top: 40px; margin-bottom: 112px; }

	.eyebrow {
		font: 500 12.5px var(--mono);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--accent);
		margin: 0 0 22px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.eyebrow::after { content: ''; flex: 1; height: 1px; background: var(--line); }

	.section-note { color: var(--muted); margin: -8px 0 28px; max-width: 56ch; }

	.prose p { margin: 0 0 1.1em; max-width: 62ch; }
	.prose p:first-child {
		font-family: var(--serif);
		font-size: 1.32rem;
		line-height: 1.5;
		font-weight: 400;
		letter-spacing: -0.005em;
	}

	.now {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid var(--line);
		border-radius: 16px;
		background: color-mix(in srgb, var(--surface) 80%, transparent);
		backdrop-filter: blur(6px);
		margin-top: 28px;
	}
	.now-item { padding: 16px 18px; display: grid; gap: 4px; }
	.now-item + .now-item { border-left: 1px solid var(--line); }
	.now-k { font: 500 11px var(--mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
	.now-v { font-size: 14.5px; font-weight: 500; line-height: 1.4; }

	/* Cards share this warm spotlight */
	.job, .feature, .mini, .series {
		position: relative;
		isolation: isolate;
	}
	.job::before, .feature::before, .mini::before, .series::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), var(--accent-soft), transparent 55%);
		opacity: 0;
		transition: opacity 0.35s;
		z-index: -1;
		pointer-events: none;
	}
	@media (hover: hover) {
		.job:hover::before, .feature:hover::before, .mini:hover::before, .series:hover::before { opacity: 1; }
	}

	/* Experience */
	.jobs { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
	.job {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 20px;
		padding: 22px;
		margin: 0 -22px;
		border-radius: 16px;
		border: 1px solid transparent;
		transition: border-color 0.3s, background-color 0.3s, opacity 0.3s;
	}
	@media (hover: hover) {
		.jobs:hover .job:not(:hover) { opacity: 0.55; }
		.job:hover { border-color: var(--line); background: color-mix(in srgb, var(--surface) 70%, transparent); }
	}
	.job-when { font: 500 12.5px var(--mono); color: var(--muted); padding-top: 4px; }
	.job h3 { margin: 0; font-size: 1.05rem; font-weight: 600; line-height: 1.4; }
	.at { color: var(--muted); margin: 0 4px; font-weight: 400; }
	.company { color: var(--accent); }
	.now-badge {
		display: inline-block;
		margin-left: 8px;
		padding: 1px 9px;
		border-radius: 999px;
		font: 600 10.5px var(--mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background: var(--accent-soft);
		color: var(--accent);
		vertical-align: 2px;
	}
	.team { margin: 2px 0 0; color: var(--muted); font-size: 14px; }
	.job ul { margin: 10px 0 12px; padding-left: 1.1em; color: var(--muted); font-size: 15px; }
	.job li { margin-bottom: 5px; }
	.job li::marker { color: var(--accent); }

	.tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.tag {
		font: 500 11.5px var(--mono);
		padding: 3px 9px;
		border-radius: 999px;
		background: var(--surface-2);
		color: var(--muted);
		white-space: nowrap;
	}

	/* Featured work */
	.features { display: grid; gap: 20px; margin-bottom: 64px; }
	.feature {
		display: grid;
		grid-template-columns: 170px 1fr;
		gap: 24px;
		padding: 24px;
		border: 1px solid var(--line);
		border-radius: 22px;
		background: color-mix(in srgb, var(--surface) 88%, transparent);
		backdrop-filter: blur(6px);
		box-shadow: var(--shadow);
		transition: transform 0.4s var(--ease), border-color 0.3s;
	}
	.feature:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
	.feature-art {
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 10px;
		aspect-ratio: 16 / 11;
		align-self: start;
	}
	.kicker { font: 500 11.5px var(--mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin: 0 0 4px; }
	.feature h3 { margin: 0 0 8px; font-family: var(--serif); font-size: 1.55rem; font-weight: 600; letter-spacing: -0.01em; }
	.feature h3 a { text-decoration: none; }
	.stretch::after { content: ''; position: absolute; inset: 0; border-radius: 22px; z-index: 0; }
	.feature h3 a:hover { color: var(--accent); }
	.blurb { margin: 0 0 14px; color: var(--muted); font-size: 15px; }
	.stats { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 18px; }
	.stats li { font-family: var(--serif); font-weight: 600; font-size: 15px; color: var(--text); }
	.stats li::before { content: '✦'; color: var(--gold); margin-right: 7px; font-size: 11px; vertical-align: 2px; }
	.feature-foot { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
	.read {
		position: relative;
		z-index: 1;
		font-size: 14px;
		font-weight: 500;
		color: var(--accent);
		text-decoration: none;
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1.5px no-repeat;
		transition: background-size 0.35s var(--ease);
	}
	.read:hover { background-size: 100% 1.5px; }
	.read::after { content: ' →'; }

	.sub {
		font-family: var(--serif);
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0 0 16px;
	}
	.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
	.mini {
		display: grid;
		gap: 6px;
		align-content: start;
		padding: 18px;
		border-radius: 16px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--surface) 80%, transparent);
		text-decoration: none;
		transition: transform 0.35s var(--ease), border-color 0.3s;
	}
	.mini:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
	.mini-name { font-weight: 600; display: flex; justify-content: space-between; gap: 8px; }
	.arrow { color: var(--muted); transition: transform 0.3s var(--ease), color 0.3s; }
	.mini:hover .arrow { transform: translate(3px, -3px); color: var(--accent); }
	.mini-blurb { font-size: 14px; color: var(--muted); line-height: 1.5; margin-bottom: 4px; }

	/* Writing */
	.posts { list-style: none; margin: 0 0 20px; padding: 0; border-top: 1px solid var(--line); }
	.posts li { border-bottom: 1px solid var(--line); }
	.posts a {
		display: grid;
		grid-template-columns: 96px 1fr auto;
		gap: 16px;
		align-items: baseline;
		padding: 14px 4px;
		text-decoration: none;
		transition: padding-left 0.35s var(--ease), color 0.25s;
	}
	.posts a:hover { padding-left: 14px; color: var(--accent); }
	.post-topic { font: 500 11.5px var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
	.post-title { font-weight: 500; }
	.post-date { font: 500 12px var(--mono); color: var(--muted); white-space: nowrap; }

	.series {
		display: flex;
		gap: 18px;
		align-items: center;
		padding: 18px 20px;
		border-radius: 16px;
		border: 1px dashed var(--line);
		text-decoration: none;
		transition: border-color 0.3s;
	}
	.series:hover { border-color: var(--accent); }
	.series-count {
		font-family: var(--serif);
		font-size: 2.4rem;
		font-weight: 600;
		color: var(--accent);
		line-height: 1;
		min-width: 1.4em;
		text-align: center;
	}
	.series-title { display: block; font-weight: 600; }
	.series-blurb { display: block; font-size: 14px; color: var(--muted); }

	/* Credentials */
	.certs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
	.cert {
		display: inline-flex;
		flex-direction: column;
		padding: 10px 14px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--surface) 85%, transparent);
		transition: transform 0.3s var(--ease);
	}
	.cert:hover { transform: translateY(-2px) rotate(-1deg); }
	.cert.gold { border-color: color-mix(in srgb, var(--gold) 55%, var(--line)); background: color-mix(in srgb, var(--gold) 9%, var(--surface)); }
	.cert-name { font-weight: 600; font-size: 14px; }
	.cert-org { font: 500 11px var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }

	.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
	.edu { list-style: none; margin: 0 0 28px; padding: 0; display: grid; gap: 12px; }
	.edu li { display: grid; }
	.edu-degree { font-weight: 500; }
	.edu-meta { font-size: 14px; color: var(--muted); }
	.tool-row { display: grid; gap: 2px; margin-bottom: 14px; }
	.tool-k { font: 500 11px var(--mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); }
	.tool-v { font-size: 14.5px; color: var(--muted); line-height: 1.55; }

	/* Side quests: parchment cards, slightly askew */
	.quests { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
	.quest {
		display: grid;
		gap: 6px;
		align-content: start;
		padding: 18px;
		border-radius: 14px;
		text-decoration: none;
		background: color-mix(in srgb, var(--gold) 8%, var(--surface));
		border: 1px solid color-mix(in srgb, var(--gold) 30%, var(--line));
		transform: rotate(var(--tilt));
		transition: transform 0.45s var(--ease), box-shadow 0.35s;
	}
	.quest:hover { transform: rotate(0) translateY(-4px) scale(1.02); box-shadow: var(--shadow); }
	.glyph { width: 34px; height: 34px; color: var(--accent); }
	.glyph svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
	.quest:hover .glyph svg { animation: boop 0.5s var(--ease); }
	.quest-name { font-family: var(--serif); font-weight: 600; font-size: 1.1rem; }
	.quest-blurb { font-size: 14px; color: var(--muted); line-height: 1.5; }

	/* Footer */
	.foot { border-top: 1px solid var(--line); padding-top: 56px; display: grid; gap: 40px; }
	.foot-cta h2 {
		font-family: var(--serif);
		font-size: clamp(2rem, 1.5rem + 2vw, 3rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin: 0 0 8px;
	}
	.foot-cta p { color: var(--muted); margin: 0 0 20px; max-width: 54ch; }
	.foot-cta p a { color: var(--accent); text-underline-offset: 3px; }
	.colophon { font-size: 13px; color: var(--muted); margin: 0; max-width: 60ch; }

	/* Scroll reveal: content is fully visible without JS */
	:global(.js) .reveal {
		opacity: 0;
		transform: translateY(18px);
		transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
	}
	:global(.js) .reveal:global(.in) { opacity: 1; transform: none; }
	:global(.js) .quest.reveal:global(.in) { transform: rotate(var(--tilt)); }
	:global(.js) .quest.reveal:global(.in):hover { transform: rotate(0) translateY(-4px) scale(1.02); }

	/* ---------- Responsive ---------- */
	@media (max-width: 960px) {
		.shell { grid-template-columns: 1fr; gap: 0; }
		.intro { position: relative; height: auto; padding: 40px 0 8px; }
		nav { display: none; }
		.intro .links { margin-top: 26px; }
		main { padding-top: 56px; }
		.block { margin-bottom: 80px; }
	}
	@media (max-width: 640px) {
		.now { grid-template-columns: 1fr; }
		.now-item + .now-item { border-left: 0; border-top: 1px solid var(--line); }
		.job { grid-template-columns: 1fr; gap: 6px; padding: 16px; margin: 0 -16px; }
		.feature { grid-template-columns: 1fr; padding: 18px; }
		.feature-art { max-width: 220px; }
		.grid, .two-col { grid-template-columns: 1fr; }
		.two-col { gap: 8px; }
		.posts a { grid-template-columns: 1fr auto; gap: 4px 12px; }
		.post-topic { grid-column: 1 / -1; }
	}

	@media (min-width: 961px) and (max-height: 940px) {
		.intro { padding: 24px 0; }
		h1 { font-size: clamp(2.4rem, 1.6rem + 2.4vw, 3.4rem); }
		.korean { display: none; }
		.topline { margin-bottom: 20px; }
		.portrait { width: 68px; height: 68px; border-radius: 22px; margin-bottom: 14px; }
		.role { margin-top: 14px; }
		.lede { margin-top: 12px; }
		nav { margin: 22px 0 22px; }
		nav a { padding: 2px 0; }
	}
	@media (min-width: 961px) and (max-height: 820px) {
		.lede, .portrait { display: none; }
		.topline { margin-bottom: 14px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.scribble path { animation: none; stroke-dashoffset: 0; }
		.pulse { animation: none; }
		:global(.js) .reveal { opacity: 1; transform: none; }
	}
</style>
