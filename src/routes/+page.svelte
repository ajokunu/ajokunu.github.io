<script>
  import { onMount } from 'svelte';
  import { profile, timeline, skills, branchConfig, branchOrder, getBranches } from '$lib/data.js';
  import SocGame from '$lib/SocGame.svelte';

  const branches = getBranches(timeline);
  let nodeEls = {};
  let visible = {};
  let expanded = {};
  let heroReady = false;
  let hubVisible = false;
  let branchesRevealed = {};
  let typedText = '';
  let showCursor = true;
  let avatarHovered = false;
  let scrollHintVisible = true;
  let expandedCount = 0;
  let svgEl;
  let treeEl;

  const phrases = [
    'Security Engineer @ Mastercard',
    'NYU Engineering Student',
    'Cloud Security + AI Builder',
    'AWS Community Builder',
    'Dungeon Master (the other kind)',
    'Threat Model Enthusiast'
  ];
  let phraseIdx = 0;

  function nodeKey(type, i) { return `${type}-${i}`; }

  function getColor(type) {
    return branchConfig[type]?.color || 'blue';
  }

  function getTypeLabel(type) {
    return branchConfig[type]?.label || 'Project';
  }

  function getClickHint(type) {
    if (type === 'job') return 'tap for the backstory';
    if (type === 'dnd') return 'tap to roll for initiative';
    return 'tap to inspect payload';
  }

  async function typePhrase(phrase) {
    typedText = '';
    for (let i = 0; i < phrase.length; i++) {
      typedText = phrase.slice(0, i + 1);
      await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
    }
    await new Promise(r => setTimeout(r, 2500));
    for (let i = phrase.length; i >= 0; i--) {
      typedText = phrase.slice(0, i);
      await new Promise(r => setTimeout(r, 20));
    }
    await new Promise(r => setTimeout(r, 400));
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typePhrase(phrases[phraseIdx]);
  }

  function toggleExpand(key) {
    if (!expanded[key]) expandedCount++;
    expanded[key] = !expanded[key];
    expanded = expanded;
    // Recalculate connectors after card expand animation
    setTimeout(updateConnectors, 550);
  }

  function updateConnectors() {
    if (!svgEl || !treeEl) return;
    const treeRect = treeEl.getBoundingClientRect();
    const hubNode = document.querySelector('.hub-node');
    if (!hubNode) return;
    const hubRect = hubNode.getBoundingClientRect();
    const hubCx = hubRect.left + hubRect.width / 2 - treeRect.left;
    const hubCy = hubRect.bottom - treeRect.top;

    let paths = '';

    branchOrder.forEach((type, branchIdx) => {
      const items = branches[type];
      const color = `var(--${branchConfig[type].color})`;
      const firstEl = nodeEls[nodeKey(type, 0)];
      if (!firstEl) return;

      // Get branch header dot position
      const branchHeader = firstEl.closest('.tree-branch')?.querySelector('.branch-dot');
      if (!branchHeader) return;
      const headerRect = branchHeader.getBoundingClientRect();
      const hx = headerRect.left + headerRect.width / 2 - treeRect.left;
      const hy = headerRect.top + headerRect.height / 2 - treeRect.top;

      // Fork line from hub to branch header
      const midY = hubCy + (hy - hubCy) * 0.5;
      paths += `<path d="M ${hubCx} ${hubCy} C ${hubCx} ${midY}, ${hx} ${midY}, ${hx} ${hy}"
        stroke="${color}" stroke-width="2" fill="none" opacity="0.4"
        class="fork-line fork-${type} ${branchesRevealed[type] ? 'drawn' : ''}" />`;

      // Node-to-node connectors within branch
      for (let i = 0; i < items.length; i++) {
        const el = nodeEls[nodeKey(type, i)];
        if (!el) continue;
        const dot = el.querySelector('.node-connector-dot');
        if (!dot) continue;
        const dotRect = dot.getBoundingClientRect();
        const dx = dotRect.left + dotRect.width / 2 - treeRect.left;
        const dy = dotRect.top + dotRect.height / 2 - treeRect.top;

        if (i === 0) {
          // Connect branch header to first node
          paths += `<line x1="${hx}" y1="${hy + 8}" x2="${dx}" y2="${dy - 8}"
            stroke="${color}" stroke-width="2" fill="none" opacity="0.25" />`;
        }

        if (i < items.length - 1) {
          const nextEl = nodeEls[nodeKey(type, i + 1)];
          if (!nextEl) continue;
          const nextDot = nextEl.querySelector('.node-connector-dot');
          if (!nextDot) continue;
          const ndRect = nextDot.getBoundingClientRect();
          const nx = ndRect.left + ndRect.width / 2 - treeRect.left;
          const ny = ndRect.top + ndRect.height / 2 - treeRect.top;
          paths += `<line x1="${dx}" y1="${dy + 8}" x2="${nx}" y2="${ny - 8}"
            stroke="${color}" stroke-width="2" fill="none" opacity="0.2" />`;
        }
      }
    });

    svgEl.innerHTML = paths;
  }

  // Photo fallback
  let photoSrc = profile.avatar;

  onMount(() => {
    // Check for local photo
    const testImg = new Image();
    testImg.onload = () => { photoSrc = '/photo.jpg'; };
    testImg.src = '/photo.jpg';

    setTimeout(() => { heroReady = true; }, 200);
    setTimeout(() => { hubVisible = true; }, 800);
    setTimeout(() => typePhrase(phrases[0]), 1200);
    setInterval(() => { showCursor = !showCursor; }, 530);

    // Reveal branches with stagger
    branchOrder.forEach((type, i) => {
      setTimeout(() => {
        branchesRevealed[type] = true;
        branchesRevealed = branchesRevealed;
        setTimeout(updateConnectors, 100);
      }, 1200 + i * 300);
    });

    // IntersectionObserver for nodes
    const observer = new IntersectionObserver((entries) => {
      let delay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.key;
          if (key && !visible[key]) {
            setTimeout(() => {
              visible[key] = true;
              visible = visible;
              requestAnimationFrame(updateConnectors);
            }, delay);
            delay += 120;
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    Object.values(nodeEls).forEach(el => {
      if (el) observer.observe(el);
    });

    // Scroll hint
    const handleScroll = () => {
      if (window.scrollY > 100) scrollHintVisible = false;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateConnectors, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial connector draw
    setTimeout(updateConnectors, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<svelte:head>
  <title>{profile.name} — {profile.title}</title>
</svelte:head>

<!-- HERO -->
<header class="hero" class:ready={heroReady}>
  <div class="hero-greeting">Hey, I'm</div>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    src={photoSrc}
    alt={profile.name}
    class="hero-avatar"
    class:hovered={avatarHovered}
    on:mouseenter={() => avatarHovered = true}
    on:mouseleave={() => avatarHovered = false}
  />
  {#if avatarHovered}
    <div class="avatar-tooltip">yes, that's really me</div>
  {/if}

  <h1>{profile.name}</h1>
  <p class="hero-korean">{profile.koreanName}</p>

  <div class="hero-typer">
    <span class="typer-text">{typedText}</span><span class="typer-cursor" class:blink={showCursor}>|</span>
  </div>

  <p class="hero-bio">{profile.tagline}</p>

  <div class="hero-badges">
    <span class="hero-badge nyu">NYU Engineering</span>
    <span class="hero-badge aws">AWS Community Builder</span>
  </div>

  <div class="hero-stats">
    <span class="stat">{profile.followers} followers</span>
    <span class="stat-sep">&bull;</span>
    <span class="stat">{profile.connections} connections</span>
  </div>

  <div class="hero-links">
    <a href={profile.github} target="_blank" rel="noopener" class="link-btn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      {profile.githubHandle}
    </a>
    <a href={profile.linkedin} target="_blank" rel="noopener" class="link-btn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      LinkedIn
    </a>
    <a href={profile.medium} target="_blank" rel="noopener" class="link-btn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
      Blog
    </a>
    <a href={profile.awsCommunity} target="_blank" rel="noopener" class="link-btn link-btn-aws">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.374 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.549.549 0 01-.312.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.272-.15.328-.064.048-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.415-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.878.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/></svg>
      AWS
    </a>
  </div>

  <div class="scroll-hint" class:hidden={!scrollHintVisible}>
    <span class="scroll-arrow">&#8595;</span>
    scroll to explore the skill tree
  </div>
</header>

<!-- SOCIAL EMBEDS -->
<section class="social-embeds">
  <a href={profile.github} target="_blank" rel="noopener" class="embed-card">
    <div class="embed-icon github-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
    </div>
    <div class="embed-content">
      <span class="embed-platform">GitHub</span>
      <span class="embed-handle">@{profile.githubHandle}</span>
      <span class="embed-desc">Security tools, AI dungeon masters, and cloud projects</span>
    </div>
    <span class="embed-arrow">&rarr;</span>
  </a>
  <a href={profile.medium} target="_blank" rel="noopener" class="embed-card">
    <div class="embed-icon medium-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
    </div>
    <div class="embed-content">
      <span class="embed-platform">Medium</span>
      <span class="embed-handle">Blog</span>
      <span class="embed-desc">Writing about cloud security, threat modeling, and engineering</span>
    </div>
    <span class="embed-arrow">&rarr;</span>
  </a>
  <a href={profile.linkedin} target="_blank" rel="noopener" class="embed-card">
    <div class="embed-icon linkedin-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </div>
    <div class="embed-content">
      <span class="embed-platform">LinkedIn</span>
      <span class="embed-handle">{profile.name}</span>
      <span class="embed-desc">{profile.followers} followers &middot; {profile.connections} connections</span>
    </div>
    <span class="embed-arrow">&rarr;</span>
  </a>
</section>

<!-- HUB NODE -->
<div class="skill-tree-hub">
  <div class="hub-spine"></div>
  <div class="hub-node" class:visible={hubVisible}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
  </div>
  <div class="hub-labels" class:visible={hubVisible}>
    {#each branchOrder as type}
      <span class="hub-label {branchConfig[type].color}">{branchConfig[type].label}</span>
    {/each}
  </div>
</div>

<!-- SKILL TREE -->
<section class="skill-tree" bind:this={treeEl}>
  <svg class="tree-connectors" bind:this={svgEl}></svg>

  <div class="tree-columns">
    {#each branchOrder as type}
      {@const items = branches[type]}
      {@const config = branchConfig[type]}
      <div class="tree-branch branch-{config.color}" class:revealed={branchesRevealed[type]}>
        <div class="branch-header">
          <div class="branch-dot {config.color}"></div>
          <h3 class="branch-title">{config.label}</h3>
          <span class="branch-count">{items.length}</span>
        </div>

        {#each items as item, i}
          {@const key = nodeKey(type, i)}
          <div
            class="tree-node {type}"
            class:visible={visible[key]}
            bind:this={nodeEls[key]}
            data-key={key}
          >
            <div class="node-connector-dot {config.color}"></div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="node-card" class:expanded={expanded[key]} on:click={() => toggleExpand(key)} role="button" tabindex="0">
              {#if item.current}
                <div class="node-current">Active Role</div>
              {/if}
              <span class="node-date">{item.date}</span>
              <span class="node-type {config.color}">{getTypeLabel(item.type)}</span>
              {#if item.isNew}
                <span class="node-new">NEW</span>
              {/if}
              <h3>
                {#if item.url}
                  <a href={item.url} target="_blank" rel="noopener" class="node-title-link" on:click|stopPropagation>{item.title}</a>
                {:else}
                  {item.title}
                {/if}
              </h3>
              <p class="node-subtitle">{item.subtitle}</p>
              {#if !expanded[key]}
                <p class="click-hint">{getClickHint(item.type)}</p>
              {/if}
              <div class="node-detail">{item.detail}</div>
              {#if item.tags && item.tags.length > 0}
                <div class="node-tags">
                  {#each item.tags as tag}
                    <span class="node-tag">{tag}</span>
                  {/each}
                </div>
              {/if}
              {#if item.stars}
                <div class="node-stars">
                  <svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                  {item.stars} {item.stars === 1 ? 'star' : 'stars'}
                </div>
              {/if}
              {#if item.url && expanded[key]}
                <a href={item.url} target="_blank" rel="noopener" class="node-repo-link" on:click|stopPropagation>
                  View on GitHub &rarr;
                </a>
              {/if}
            </div>
          </div>
        {/each}

        <div class="branch-end {config.color}">
          <div class="branch-end-dot"></div>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- SKILLS -->
<section class="skills-section">
  <div class="skills-header">
    <h2>Technical Arsenal</h2>
    <p class="skills-sub">things I break and build with</p>
  </div>
  <div class="skills-grid">
    {#each skills as skill}
      <div class="skill-item">
        <h4>{skill.category}</h4>
        <p>{skill.items}</p>
      </div>
    {/each}
  </div>
</section>

<!-- MINI-GAME -->
<SocGame />

<!-- TIMELINE END -->
<div class="timeline-end">
  <p>
    {#if expandedCount >= 5}
      You actually read all that? Hire me.
    {:else if expandedCount >= 2}
      Curious one, aren't you?
    {:else}
      The journey continues...
    {/if}
  </p>
</div>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-cta">
    <h4>Let's build something secure.</h4>
    <p>Open to Senior Security Engineer & Security Architecture opportunities.</p>
  </div>
  <div class="footer-links">
    <a href={profile.github} target="_blank" rel="noopener">GitHub</a>
    <a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
    <a href={profile.linkedin} target="_blank" rel="noopener" class="footer-email">Get in touch</a>
  </div>
  <p class="footer-colophon">Built with Svelte &middot; Designed with spite and coffee</p>
</footer>

<style>
  /* ─── HERO ─── */
  .hero {
    text-align: center;
    padding: 4rem 2rem 2rem;
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .hero.ready {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-greeting {
    font-family: var(--mono);
    font-size: 0.85rem;
    color: var(--text-dim);
    margin-bottom: 1.25rem;
    letter-spacing: 0.02em;
  }

  .hero-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--spine);
    margin-bottom: 1.5rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }

  .hero-avatar.hovered {
    border-color: var(--green);
    transform: scale(1.08) rotate(2deg);
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
  }

  .avatar-tooltip {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    background: var(--bg-card);
    border: 1px solid #333;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -0.75rem;
    white-space: nowrap;
    animation: tooltipIn 0.2s ease;
    z-index: 10;
  }

  @keyframes tooltipIn {
    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .hero h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.25rem;
  }

  .hero-korean {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 1rem;
  }

  .hero-typer {
    font-family: var(--mono);
    font-size: 0.9rem;
    color: var(--green);
    height: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .typer-cursor { color: var(--green); opacity: 0; transition: opacity 0.1s; }
  .typer-cursor.blink { opacity: 1; }

  .hero-bio {
    font-size: 0.9rem;
    color: var(--text-dim);
    max-width: 480px;
    margin: 0 auto 1rem;
    font-style: italic;
    line-height: 1.6;
  }

  .hero-badges {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .hero-badge {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.25rem 0.7rem;
    border-radius: 50px;
  }

  .hero-badge.nyu {
    background: rgba(87, 6, 140, 0.15);
    color: #b47adf;
    border: 1px solid rgba(87, 6, 140, 0.25);
  }

  .hero-badge.aws {
    background: rgba(255, 153, 0, 0.1);
    color: #ff9900;
    border: 1px solid rgba(255, 153, 0, 0.2);
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-bottom: 1.5rem;
  }

  .stat-sep { color: var(--spine); }

  .hero-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .link-btn {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border: 1px solid #333;
    border-radius: 8px;
    transition: all 0.2s;
    background: transparent;
  }

  .link-btn:hover {
    color: var(--text);
    border-color: var(--green);
    background: rgba(34, 197, 94, 0.05);
  }

  .link-btn :global(svg) { width: 14px; height: 14px; }

  .link-btn-aws:hover {
    border-color: #ff9900 !important;
    background: rgba(255, 153, 0, 0.05) !important;
  }

  .scroll-hint {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    opacity: 1;
    transition: opacity 0.5s;
  }

  .scroll-hint.hidden { opacity: 0; pointer-events: none; }

  .scroll-arrow {
    display: block;
    animation: bounce 2s ease infinite;
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(6px); }
    60% { transform: translateY(3px); }
  }

  /* ─── SOCIAL EMBEDS ─── */
  .social-embeds {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem 1.5rem 0;
    flex-wrap: wrap;
  }

  .embed-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-card);
    border: 1px solid #262626;
    border-radius: 10px;
    padding: 0.7rem 1rem;
    text-decoration: none;
    color: var(--text);
    transition: all 0.25s;
    flex: 1;
    min-width: 220px;
    max-width: 280px;
  }

  .embed-card:hover {
    background: var(--bg-card-hover);
    border-color: #444;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .embed-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .embed-icon :global(svg) { width: 18px; height: 18px; }

  .github-icon { background: rgba(255, 255, 255, 0.08); color: var(--text); }
  .medium-icon { background: rgba(255, 255, 255, 0.08); color: var(--text); }
  .linkedin-icon { background: rgba(10, 102, 194, 0.15); color: #0a66c2; }

  .embed-card:hover .github-icon { background: rgba(255, 255, 255, 0.12); }
  .embed-card:hover .medium-icon { background: rgba(255, 255, 255, 0.12); }
  .embed-card:hover .linkedin-icon { background: rgba(10, 102, 194, 0.2); }

  .embed-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .embed-platform {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-mid);
  }

  .embed-handle {
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .embed-desc {
    font-size: 0.65rem;
    color: var(--text-dim);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .embed-arrow {
    font-size: 0.9rem;
    color: var(--text-dim);
    transition: transform 0.2s, color 0.2s;
    flex-shrink: 0;
  }

  .embed-card:hover .embed-arrow {
    transform: translateX(3px);
    color: var(--text);
  }

  /* ─── HUB NODE ─── */
  .skill-tree-hub {
    text-align: center;
    position: relative;
    padding: 0 0 1.5rem;
  }

  .hub-spine {
    width: 3px;
    height: 60px;
    background: linear-gradient(to bottom, transparent, var(--spine));
    margin: 0 auto;
  }

  .hub-node {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--spine);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    z-index: 3;
  }

  .hub-node.visible {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.06);
    border-color: var(--text-dim);
  }

  .hub-node :global(svg) { width: 22px; height: 22px; }

  .hub-labels {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    opacity: 0;
    transition: opacity 0.5s ease 0.3s;
  }

  .hub-labels.visible { opacity: 1; }

  .hub-label {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .hub-label.green { color: var(--green); }
  .hub-label.blue { color: var(--blue); }
  .hub-label.purple { color: var(--purple); }

  /* ─── SKILL TREE ─── */
  .skill-tree {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1rem 2rem;
  }

  .tree-connectors {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .tree-columns {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    position: relative;
    z-index: 2;
  }

  /* ─── BRANCH ─── */
  .tree-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .tree-branch.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .branch-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .branch-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .branch-dot.green { background: var(--green); box-shadow: 0 0 12px rgba(34, 197, 94, 0.4); }
  .branch-dot.blue { background: var(--blue); box-shadow: 0 0 12px rgba(59, 130, 246, 0.4); }
  .branch-dot.purple { background: var(--purple); box-shadow: 0 0 12px rgba(168, 85, 247, 0.4); }

  .branch-title {
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-mid);
  }

  .branch-count {
    font-family: var(--mono);
    font-size: 0.55rem;
    color: var(--text-dim);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.15rem 0.4rem;
    border-radius: 50px;
  }

  .branch-end {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  .branch-end-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--spine);
    opacity: 0.4;
    animation: endPulse 3s ease infinite;
  }

  .branch-end.green .branch-end-dot { background: var(--green); }
  .branch-end.blue .branch-end-dot { background: var(--blue); }
  .branch-end.purple .branch-end-dot { background: var(--purple); }

  @keyframes endPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.15; transform: scale(0.7); }
  }

  /* ─── TREE NODE ─── */
  .tree-node {
    width: 100%;
    max-width: 340px;
    margin-bottom: 1.25rem;
    position: relative;
    opacity: 0;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .tree-node.job { transform: translateX(-30px); }
  .tree-node.project { transform: translateY(20px); }
  .tree-node.dnd { transform: translateX(30px); }

  .tree-node.visible {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }

  .node-connector-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 auto 0.5rem;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .node-connector-dot.green { background: var(--green); box-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
  .node-connector-dot.blue { background: var(--blue); box-shadow: 0 0 8px rgba(59, 130, 246, 0.3); }
  .node-connector-dot.purple { background: var(--purple); box-shadow: 0 0 8px rgba(168, 85, 247, 0.3); }

  .tree-node:hover .node-connector-dot {
    transform: scale(1.5);
  }

  .tree-node:hover .node-connector-dot.green { box-shadow: 0 0 16px rgba(34, 197, 94, 0.5); }
  .tree-node:hover .node-connector-dot.blue { box-shadow: 0 0 16px rgba(59, 130, 246, 0.5); }
  .tree-node:hover .node-connector-dot.purple { box-shadow: 0 0 16px rgba(168, 85, 247, 0.5); }

  /* ─── CARD ─── */
  .node-card {
    background: var(--bg-card);
    border: 1px solid #262626;
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: left;
  }

  .node-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .node-card:hover {
    background: var(--bg-card-hover);
    border-color: #333;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .node-card:hover::before { opacity: 1; }

  .tree-node.job .node-card::before { background: linear-gradient(90deg, var(--green), transparent); }
  .tree-node.project .node-card::before { background: linear-gradient(90deg, var(--blue), transparent); }
  .tree-node.dnd .node-card::before { background: linear-gradient(90deg, var(--purple), transparent); }

  .node-date {
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
    display: block;
  }

  .node-type {
    font-family: var(--mono);
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 50px;
    display: inline-block;
    margin-bottom: 0.75rem;
  }

  .node-type.green { background: var(--green-dim); color: var(--green); }
  .node-type.blue { background: var(--blue-dim); color: var(--blue); }
  .node-type.purple { background: var(--purple-dim); color: var(--purple); }

  .node-new {
    font-family: var(--mono);
    font-size: 0.5rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    padding: 0.15rem 0.5rem;
    border-radius: 50px;
    background: rgba(249, 115, 22, 0.15);
    color: #f97316;
    margin-left: 0.5rem;
    animation: newPulse 2s ease infinite;
  }

  @keyframes newPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .node-card h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    letter-spacing: -0.01em;
  }

  .node-title-link {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
  }

  .node-title-link:hover { color: var(--blue); }

  .node-subtitle {
    font-size: 0.8rem;
    color: var(--text-mid);
    margin-bottom: 0.25rem;
  }

  .click-hint {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    opacity: 0;
    transition: opacity 0.3s;
    margin-top: 0.25rem;
    letter-spacing: 0.03em;
  }

  .node-card:hover .click-hint { opacity: 0.7; }

  .node-detail {
    font-size: 0.8rem;
    color: var(--text-dim);
    line-height: 1.7;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease, opacity 0.3s;
    opacity: 0;
  }

  .node-card.expanded .node-detail {
    max-height: 200px;
    opacity: 1;
    margin-top: 0.75rem;
  }

  .node-tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .node-tag {
    font-family: var(--mono);
    font-size: 0.55rem;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--text-dim);
    transition: all 0.2s;
  }

  .node-card:hover .node-tag,
  .node-card.expanded .node-tag {
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--text-mid);
  }

  .node-stars {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    margin-top: 0.5rem;
  }

  .node-stars :global(svg) { width: 12px; height: 12px; fill: #f59e0b; }

  .node-repo-link {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--blue);
    text-decoration: none;
    margin-top: 0.75rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 6px;
    transition: all 0.2s;
  }

  .node-repo-link:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: var(--blue);
  }

  .node-current {
    font-family: var(--mono);
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--green);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .node-current::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  }

  /* ─── SKILLS ─── */
  .skills-section {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 2rem;
  }

  .skills-header {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
  }

  .skills-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .skills-sub {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 0.25rem;
    letter-spacing: 0.03em;
  }

  .skills-header::before,
  .skills-header::after {
    content: '';
    position: absolute;
    top: 30%;
    width: 60px;
    height: 1px;
    background: var(--spine);
  }
  .skills-header::before { right: calc(50% + 8rem); }
  .skills-header::after { left: calc(50% + 8rem); }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .skill-item {
    background: var(--bg-card);
    border: 1px solid #262626;
    border-radius: 10px;
    padding: 1.25rem;
    text-align: center;
    transition: all 0.3s;
  }

  .skill-item:hover {
    background: var(--bg-card-hover);
    border-color: #333;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .skill-item h4 {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 0.5rem;
  }

  .skill-item p {
    font-size: 0.85rem;
    color: var(--text-mid);
    line-height: 1.5;
  }

  /* ─── TIMELINE END ─── */
  .timeline-end {
    text-align: center;
    padding: 3rem 2rem 1rem;
  }

  .timeline-end p {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
    transition: all 0.3s;
  }

  /* ─── FOOTER ─── */
  .footer {
    text-align: center;
    padding: 3rem 2rem;
    border-top: 1px solid #1a1a1a;
    margin-top: 2rem;
  }

  .footer-cta h4 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }

  .footer-cta p {
    font-size: 0.85rem;
    color: var(--text-mid);
    margin-bottom: 1.5rem;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .footer-links a {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #333;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .footer-links a:hover {
    color: var(--text);
    border-color: var(--green);
  }

  .footer-email {
    color: var(--green) !important;
    border-color: rgba(34, 197, 94, 0.3) !important;
  }

  .footer-email:hover {
    background: rgba(34, 197, 94, 0.1) !important;
  }

  .footer-colophon {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: #444;
    letter-spacing: 0.05em;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    .tree-columns {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .tree-branch {
      padding: 0 1rem;
    }

    .tree-node {
      max-width: 100%;
    }

    .tree-node.job,
    .tree-node.project,
    .tree-node.dnd {
      transform: translateY(20px);
    }

    .tree-connectors { display: none; }

    .social-embeds { flex-direction: column; align-items: center; }
    .embed-card { max-width: 100%; min-width: 0; }

    .hub-labels { gap: 1rem; font-size: 0.5rem; }

    .skills-header::before, .skills-header::after { display: none; }
  }

  @media (max-width: 480px) {
    .hero h1 { font-size: 2rem; }
    .skills-grid { grid-template-columns: 1fr; }
    .hub-labels { flex-direction: column; gap: 0.25rem; }
  }
</style>
