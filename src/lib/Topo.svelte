<script>
	// Living topographic map: contour lines of drifting simplex noise, drawn with
	// marching squares. The cursor raises a gentle hill so the terrain reacts to you.
	// Half fantasy cartography, half network topology.
	import { onMount } from 'svelte';

	let canvas;

	// Compact 2D simplex noise (after Stefan Gustavson), seeded
	function makeNoise(seed = 7) {
		const p = new Uint8Array(512);
		const perm = new Uint8Array(256).map((_, i) => i);
		let s = seed;
		for (let i = 255; i > 0; i--) {
			s = (s * 16807) % 2147483647;
			const j = s % (i + 1);
			[perm[i], perm[j]] = [perm[j], perm[i]];
		}
		for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
		const g = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
		const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
		return (x, y) => {
			const s0 = (x + y) * F2;
			const i = Math.floor(x + s0), j = Math.floor(y + s0);
			const t = (i + j) * G2;
			const x0 = x - (i - t), y0 = y - (j - t);
			const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
			const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
			const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
			const ii = i & 255, jj = j & 255;
			let n = 0;
			for (const [dx, dy, gi] of [
				[x0, y0, p[ii + p[jj]] & 7],
				[x1, y1, p[ii + i1 + p[jj + j1]] & 7],
				[x2, y2, p[ii + 1 + p[jj + 1]] & 7]
			]) {
				let tt = 0.5 - dx * dx - dy * dy;
				if (tt > 0) {
					tt *= tt;
					n += tt * tt * (g[gi][0] * dx + g[gi][1] * dy);
				}
			}
			return 70 * n;
		};
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const noise = makeNoise(20);
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const CELL = 14;
		const LEVELS = 11;
		let w, h, cols, rows, field, dpr;
		let mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
		let raf, running = true, t = Math.random() * 100;

		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = window.innerWidth;
			h = window.innerHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.ceil(w / CELL) + 1;
			rows = Math.ceil(h / CELL) + 1;
			field = new Float32Array(cols * rows);
		}

		function sample() {
			const sc = 0.0022;
			const r2 = 190 * 190;
			for (let j = 0; j < rows; j++) {
				for (let i = 0; i < cols; i++) {
					const x = i * CELL, y = j * CELL;
					let v = noise(x * sc + t * 0.05, y * sc - t * 0.03) * 0.75 + noise(x * sc * 2.3 - t * 0.02, y * sc * 2.3) * 0.25;
					const dx = x - mouse.x, dy = y - mouse.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < r2 * 4) v += 0.55 * Math.exp(-d2 / r2);
					field[j * cols + i] = v;
				}
			}
		}

		function draw() {
			const styles = getComputedStyle(document.documentElement);
			const ink = styles.getPropertyValue('--topo').trim() || 'rgba(120,100,80,0.18)';
			const accent = styles.getPropertyValue('--topo-accent').trim() || 'rgba(194,83,47,0.35)';
			ctx.clearRect(0, 0, w, h);
			sample();
			for (let l = 0; l < LEVELS; l++) {
				const iso = -0.9 + (l * 1.9) / (LEVELS - 1);
				ctx.beginPath();
				for (let j = 0; j < rows - 1; j++) {
					for (let i = 0; i < cols - 1; i++) {
						const a = field[j * cols + i], b = field[j * cols + i + 1];
						const c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
						const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
						if (idx === 0 || idx === 15) continue;
						const x = i * CELL, y = j * CELL;
						const top = [x + CELL * ((iso - a) / (b - a)), y];
						const right = [x + CELL, y + CELL * ((iso - b) / (c - b))];
						const bottom = [x + CELL * ((iso - d) / (c - d)), y + CELL];
						const left = [x, y + CELL * ((iso - a) / (d - a))];
						const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
						switch (idx) {
							case 1: case 14: seg(left, bottom); break;
							case 2: case 13: seg(bottom, right); break;
							case 3: case 12: seg(left, right); break;
							case 4: case 11: seg(top, right); break;
							case 5: seg(left, top); seg(bottom, right); break;
							case 6: case 9: seg(top, bottom); break;
							case 7: case 8: seg(left, top); break;
							case 10: seg(left, bottom); seg(top, right); break;
						}
					}
				}
				// Every fourth line is an "index contour", slightly bolder, like a real survey map
				const index = l % 4 === 1;
				ctx.strokeStyle = l === LEVELS - 2 ? accent : ink;
				ctx.lineWidth = index ? 1.1 : 0.6;
				ctx.stroke();
			}
		}

		function frame() {
			if (!running) return;
			mouse.x += (mouse.tx - mouse.x) * 0.08;
			mouse.y += (mouse.ty - mouse.y) * 0.08;
			t += 0.012;
			draw();
			raf = requestAnimationFrame(frame);
		}

		const onMove = (e) => {
			mouse.tx = e.clientX;
			mouse.ty = e.clientY;
			if (mouse.x < -1000) { mouse.x = e.clientX; mouse.y = e.clientY; }
		};
		const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };
		const onVis = () => {
			running = !document.hidden && !reduce;
			cancelAnimationFrame(raf);
			if (running) frame();
		};
		let rt;
		const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { resize(); draw(); }, 120); };
		const theme = new MutationObserver(() => draw());

		resize();
		draw();
		if (!reduce) {
			window.addEventListener('pointermove', onMove, { passive: true });
			document.addEventListener('pointerleave', onLeave);
			frame();
		}
		window.addEventListener('resize', onResize);
		document.addEventListener('visibilitychange', onVis);
		theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

		return () => {
			running = false;
			cancelAnimationFrame(raf);
			theme.disconnect();
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerleave', onLeave);
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<canvas bind:this={canvas} class="topo" aria-hidden="true"></canvas>

<style>
	.topo {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
</style>
