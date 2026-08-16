(() => {
  'use strict';

  const views = {
    home: {
      signal: 'memory',
      html: `
        <article class="page">
          <div class="eyebrow">moon://khazar/home · status 200</div>
          <h2 class="display">I build AI systems that <span class="accent">remember</span>, connect, and fail less.</h2>
          <p class="lede">I am <strong>Khazar Ayaz</strong>, founder of KNWN and creator of Memoripy. I work on the parts between a good model demo and a dependable product: memory, MCP infrastructure, tool use, state, and reliability.</p>
          <div class="command-hints">
            <button class="hint-btn" data-view="work" type="button">open /work</button>
            <button class="hint-btn" data-view="memoripy" type="button">inspect memoripy</button>
            <button class="hint-btn" data-view="knwn" type="button">connect knwn.app</button>
          </div>
        </article>`
    },
    about: {
      signal: 'identity',
      html: `
        <article class="page">
          <div class="eyebrow">moon://khazar/about</div>
          <h2 class="display">Founder first.<br><span class="soft">Engineer by necessity.</span></h2>
          <p class="lede">I have spent years turning messy operational problems into software, from logistics and research products to AI agents and developer infrastructure. I care less about impressive prototypes than systems people can understand, trust, and keep using.</p>
          <div class="facts">
            <div class="fact"><small>current company</small><strong>KNWN</strong></div>
            <div class="fact"><small>open source</small><strong>Memoripy</strong></div>
            <div class="fact"><small>location</small><strong>Istanbul</strong></div>
          </div>
        </article>`
    },
    work: {
      signal: 'projects',
      html: `
        <article class="page">
          <div class="eyebrow">moon://khazar/work · directory listing</div>
          <h2 class="display">Selected<br><span class="accent">systems.</span></h2>
          <div class="directory">
            <a class="file" href="#memoripy" data-view="memoripy"><span class="mode">drwx</span><span class="name">memoripy/</span><span class="meta">AI memory layer</span></a>
            <a class="file" href="#knwn" data-view="knwn"><span class="mode">drwx</span><span class="name">knwn.app/</span><span class="meta">MCP + ChatGPT apps</span></a>
            <a class="file" href="https://github.com/caspianmoon/replyhold" target="_blank" rel="noreferrer"><span class="mode">-rwx</span><span class="name">replyhold.py</span><span class="meta">agent message debounce</span></a>
            <a class="file" href="https://github.com/caspianmoon/jsonpaws" target="_blank" rel="noreferrer"><span class="mode">-rwx</span><span class="name">jsonpaws.py</span><span class="meta">structured model output</span></a>
          </div>
        </article>`
    },
    memoripy: {
      signal: 'memoripy',
      html: `
        <article class="page">
          <div class="eyebrow">moon://khazar/work/memoripy</div>
          <div class="project-head"><h2>Memoripy</h2><span class="project-code">pip install memoripy</span></div>
          <p class="lede">A context-aware memory layer for AI applications with short and long-term storage, semantic clustering, graph associations, retrieval, decay, and reinforcement.</p>
          <div class="facts">
            <div class="fact"><small>github stars</small><strong id="stars">loading…</strong></div>
            <div class="fact"><small>language</small><strong>Python</strong></div>
            <div class="fact"><small>license</small><strong>Apache 2.0</strong></div>
          </div>
          <div class="command-hints"><button class="hint-btn" data-open="https://github.com/caspianmoon/memoripy" type="button">open repository ↗</button></div>
        </article>`
    },
    knwn: {
      signal: 'knwn.app',
      html: `
        <article class="page">
          <div class="eyebrow">https://knwn.app · production systems</div>
          <div class="project-head"><h2>KNWN</h2><span class="project-code">KNWN.APP</span></div>
          <p class="lede">KNWN builds production MCP servers and ChatGPT apps for companies with real APIs, content, and users. The work includes authentication, tool design, analytics, testing, deployment, security, and handover.</p>
          <div class="facts">
            <div class="fact"><small>service 01</small><strong>MCP servers</strong></div>
            <div class="fact"><small>service 02</small><strong>ChatGPT apps</strong></div>
            <div class="fact"><small>site</small><strong>knwn.app</strong></div>
          </div>
          <div class="command-hints"><button class="hint-btn" data-open="https://knwn.app" type="button">visit knwn.app ↗</button><button class="hint-btn" data-open="https://knwn.app/contact" type="button">discuss a build ↗</button></div>
        </article>`
    },
    contact: {
      signal: 'contact',
      html: `
        <article class="page">
          <div class="eyebrow">moon://khazar/contact</div>
          <h2 class="display">Build something<br><span class="accent">that works.</span></h2>
          <p class="lede">For MCP servers, ChatGPT apps, AI memory, or reliability work, the clearest route is through KNWN. For open-source work, use GitHub.</p>
          <div class="contact-links">
            <a class="contact-link" href="https://knwn.app/contact" target="_blank" rel="noreferrer"><small>commercial work</small><strong>knwn.app/contact ↗</strong></a>
            <a class="contact-link" href="https://github.com/caspianmoon" target="_blank" rel="noreferrer"><small>code and open source</small><strong>github.com/caspianmoon ↗</strong></a>
          </div>
        </article>`
    }
  };

  const viewport = document.getElementById('viewport');
  const path = document.getElementById('path');
  const signal = document.getElementById('signal');
  const command = document.getElementById('command');
  const form = document.getElementById('terminal-form');
  const nav = document.getElementById('nav');
  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  const mobileMenu = document.getElementById('mobile-menu');
  const tip = document.getElementById('tip');
  let activeView = 'home';
  const commandHistory = [];
  let historyIndex = 0;

  function render(name, pushHash = true) {
    const view = views[name];
    if (!view) return false;
    activeView = name;
    viewport.innerHTML = view.html;
    path.textContent = `moon://khazar/${name}`;
    signal.textContent = view.signal;
    navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === name));
    if (pushHash && location.hash !== `#${name}`) window.history.replaceState(null, '', `#${name}`);
    nav.classList.remove('open');
    bindDynamicControls();
    if (name === 'memoripy') loadStars();
    return true;
  }

  function bindDynamicControls() {
    viewport.querySelectorAll('[data-view]').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        render(element.dataset.view);
      });
    });
    viewport.querySelectorAll('[data-open]').forEach(element => {
      element.addEventListener('click', () => window.open(element.dataset.open, '_blank', 'noopener,noreferrer'));
    });
  }

  async function loadStars() {
    const target = document.getElementById('stars');
    if (!target) return;
    try {
      const response = await fetch('https://api.github.com/repos/caspianmoon/memoripy');
      if (!response.ok) throw new Error('github unavailable');
      const data = await response.json();
      target.textContent = new Intl.NumberFormat('en').format(data.stargazers_count);
    } catch {
      target.textContent = '693+';
    }
  }

  function execute(raw) {
    const value = raw.trim();
    const normalized = value.toLowerCase();
    if (!value) return;
    commandHistory.push(value);
    historyIndex = commandHistory.length;

    const aliases = {
      h: 'home', home: 'home', '/': 'home',
      a: 'about', about: 'about', whoami: 'about',
      w: 'work', work: 'work', projects: 'work', ls: 'work',
      m: 'memoripy', memoripy: 'memoripy',
      k: 'knwn', knwn: 'knwn', 'knwn.app': 'knwn',
      c: 'contact', contact: 'contact'
    };

    if (aliases[normalized]) {
      render(aliases[normalized]);
      tip.textContent = `executed: ${value}`;
      return;
    }

    if (normalized === 'help') {
      viewport.innerHTML = `<article class="page"><div class="eyebrow">moon://khazar/help</div><h2 class="display">Available<br><span class="accent">commands.</span></h2><div class="directory"><div class="file"><span class="mode">cmd</span><span class="name">home / about / work</span><span class="meta">navigate</span></div><div class="file"><span class="mode">cmd</span><span class="name">memoripy / knwn / contact</span><span class="meta">inspect</span></div><div class="file"><span class="mode">cmd</span><span class="name">github / clear / reboot</span><span class="meta">system</span></div></div></article>`;
      path.textContent = 'moon://khazar/help';
      signal.textContent = 'help';
      navButtons.forEach(button => button.classList.remove('active'));
      return;
    }

    if (normalized === 'github') {
      window.open('https://github.com/caspianmoon', '_blank', 'noopener,noreferrer');
      return;
    }

    if (normalized === 'clear') {
      viewport.innerHTML = `<article class="page"><div class="eyebrow">terminal cleared</div><h2 class="display"><span class="accent">_</span></h2></article>`;
      path.textContent = 'moon://khazar/clear';
      signal.textContent = 'idle';
      navButtons.forEach(button => button.classList.remove('active'));
      return;
    }

    if (normalized === 'reboot') {
      location.reload();
      return;
    }

    viewport.innerHTML = `<article class="page"><div class="eyebrow error-copy">command not found</div><h2 class="display">${escapeHtml(value)}</h2><p class="lede">Type <strong>help</strong> to list valid commands.</p></article>`;
    path.textContent = 'moon://khazar/error';
    signal.textContent = '404';
    navButtons.forEach(button => button.classList.remove('active'));
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  }

  navButtons.forEach(button => button.addEventListener('click', () => render(button.dataset.view)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    execute(command.value);
    command.value = '';
  });
  command.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandHistory.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      command.value = commandHistory[historyIndex] || '';
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      command.value = commandHistory[historyIndex] || '';
    }
  });

  mobileMenu.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('keydown', event => {
    if (event.target === command) return;
    const map = { h: 'home', a: 'about', w: 'work', m: 'memoripy', k: 'knwn', c: 'contact' };
    if (map[event.key.toLowerCase()]) render(map[event.key.toLowerCase()]);
    if (event.key === '/') {
      event.preventDefault();
      command.focus();
    }
    if (event.key === 'Escape') nav.classList.remove('open');
  });

  function updateClock() {
    document.getElementById('clock').textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 1000);

  const canvas = document.getElementById('space');
  const context = canvas.getContext('2d');
  const stars = [];
  let width = 0;
  let height = 0;
  let pointerX = .5;
  let pointerY = .5;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const count = Math.min(170, Math.floor((width * height) / 7800));
    for (let index = 0; index < count; index += 1) {
      stars.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.25 + .15, a: Math.random() * .55 + .15, s: Math.random() * .08 + .015 });
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const gradient = context.createRadialGradient(width * .76, height * .32, 0, width * .76, height * .32, Math.max(width, height) * .72);
    gradient.addColorStop(0, 'rgba(22,67,57,.22)');
    gradient.addColorStop(.42, 'rgba(8,18,17,.13)');
    gradient.addColorStop(1, 'rgba(1,2,3,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    stars.forEach(star => {
      star.x -= star.s;
      if (star.x < -2) star.x = width + 2;
      context.beginPath();
      context.arc(star.x + (pointerX - .5) * star.r * 8, star.y + (pointerY - .5) * star.r * 8, star.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(207,255,237,${star.a})`;
      context.fill();
    });

    context.strokeStyle = 'rgba(157,255,215,.045)';
    context.lineWidth = 1;
    const horizon = height * .72;
    for (let x = -width; x < width * 2; x += 70) {
      context.beginPath();
      context.moveTo(width * .5, horizon);
      context.lineTo(x + (pointerX - .5) * 22, height);
      context.stroke();
    }
    for (let y = horizon; y < height; y += Math.max(10, (y - horizon) * .22 + 10)) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', event => {
    pointerX = event.clientX / Math.max(1, width);
    pointerY = event.clientY / Math.max(1, height);
    const moon = document.getElementById('moon');
    moon.style.setProperty('--mx', `${(pointerX - .5) * 12}px`);
    moon.style.setProperty('--my', `${(pointerY - .5) * 12}px`);
  });
  resize();
  draw();

  const initial = location.hash.slice(1);
  render(views[initial] ? initial : 'home', false);

  window.addEventListener('hashchange', () => {
    const requested = location.hash.slice(1);
    if (views[requested] && requested !== activeView) render(requested, false);
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('boot').classList.add('done');
      document.getElementById('shell').classList.add('ready');
    }, 1050);
  });
})();
