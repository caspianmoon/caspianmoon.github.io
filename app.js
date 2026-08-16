(() => {
  'use strict';

  const contactEndpoint = 'https://knwn.app/api/personal-contact';
  const buffer = document.getElementById('buffer');
  const output = document.getElementById('output');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('command');
  const boot = document.getElementById('boot');
  const bootLog = document.getElementById('boot-log');
  const menu = document.getElementById('menu');
  const menuButtons = Array.from(menu.querySelectorAll('button[data-command]'));
  const commandHistory = [];
  let historyIndex = 0;
  let menuIndex = 0;

  const links = {
    github: 'https://github.com/caspianmoon',
    memoripy: 'https://github.com/caspianmoon/memoripy',
    replyhold: 'https://github.com/caspianmoon/replyhold',
    jsonpaws: 'https://github.com/caspianmoon/jsonpaws',
    knwn: 'https://knwn.app',
    source: 'https://github.com/caspianmoon/caspianmoon.github.io'
  };

  const screens = {
    home: `
      <div class="line dim">last login: ${new Date().toDateString()} from web</div>
      <div class="blank"></div>
      <div class="line name">Khazar Ayaz</div>
      <div class="line">I build KNWN and maintain Memoripy.</div>
      <div class="blank"></div>
      <div class="line bright">current work</div>
      <div class="line row"><span>knwn.app</span><span class="tag">company</span><span class="description">MCP servers and ChatGPT apps</span></div>
      <div class="line row"><span>memoripy</span><span class="tag">open source</span><span class="description">memory library for AI applications</span></div>
      <div class="line row"><span>replyhold</span><span class="tag">open source</span><span class="description">waits for message bursts before an agent replies</span></div>
      <div class="line row"><span>jsonpaws</span><span class="tag">open source</span><span class="description">structured JSON generation for language models</span></div>
      <div class="blank"></div>
      <div class="line dim">type <button class="inline-command" data-command="help">help</button>, type <button class="inline-command" data-command="contact">contact</button>, or press → to use the menu.</div>`,

    about: `
      <div class="line dim">guest@caspianmoon:~$ whoami</div>
      <div class="blank"></div>
      <div class="line name">Khazar Ayaz</div>
      <div class="line">I run KNWN.</div>
      <div class="line">I maintain Memoripy and publish small open-source tools as caspianmoon.</div>
      <div class="line">I have built software for logistics, research, AI agents, and developer tools.</div>
      <div class="blank"></div>
      <div class="line"><a href="${links.github}" target="_blank" rel="noreferrer">github.com/caspianmoon</a></div>`,

    projects: `
      <div class="line dim">guest@caspianmoon:~$ ls -la projects/</div>
      <div class="blank"></div>
      <div class="line rule">--------------------------------------------------------------------------------</div>
      <div class="line row bright"><span>name</span><span>type</span><span>link</span></div>
      <div class="line rule">--------------------------------------------------------------------------------</div>
      <div class="line row"><span>memoripy</span><span class="tag">open source</span><span class="description"><a href="${links.memoripy}" target="_blank" rel="noreferrer">github.com/caspianmoon/memoripy</a></span></div>
      <div class="line row"><span>replyhold</span><span class="tag">open source</span><span class="description"><a href="${links.replyhold}" target="_blank" rel="noreferrer">github.com/caspianmoon/replyhold</a></span></div>
      <div class="line row"><span>jsonpaws</span><span class="tag">open source</span><span class="description"><a href="${links.jsonpaws}" target="_blank" rel="noreferrer">github.com/caspianmoon/jsonpaws</a></span></div>
      <div class="line row"><span>KNWN</span><span class="tag">company</span><span class="description"><a href="${links.knwn}" target="_blank" rel="noreferrer">knwn.app</a></span></div>`,

    memoripy: `
      <div class="line dim">guest@caspianmoon:~$ cat projects/memoripy.txt</div>
      <div class="blank"></div>
      <div class="line name">Memoripy</div>
      <div class="line">A Python library for memory in AI applications.</div>
      <div class="line">It stores short-term and long-term interactions and retrieves relevant context.</div>
      <div class="blank"></div>
      <div class="line">install: <span class="bright">pip install memoripy</span></div>
      <div class="line">source: <a href="${links.memoripy}" target="_blank" rel="noreferrer">github.com/caspianmoon/memoripy</a></div>`,

    knwn: `
      <div class="line dim">guest@caspianmoon:~$ open https://knwn.app</div>
      <div class="blank"></div>
      <div class="line name">KNWN</div>
      <div class="line">We build MCP servers and ChatGPT apps for companies.</div>
      <div class="line">The work includes authentication, tools, deployment, analytics, testing, and handover.</div>
      <div class="blank"></div>
      <div class="line"><a href="${links.knwn}" target="_blank" rel="noreferrer">knwn.app</a></div>`,

    contact: `
      <div class="line dim">guest@caspianmoon:~$ contact</div>
      <div class="blank"></div>
      <div class="line bright">Send me a message.</div>
      <div class="line dim">This form sends through knwn.app. I will reply by email.</div>
      <form class="contact-form" id="contact-form" autocomplete="on">
        <div class="contact-field"><label for="contact-name">name</label><input id="contact-name" name="name" type="text" minlength="2" maxlength="120" required></div>
        <div class="contact-field"><label for="contact-email">email</label><input id="contact-email" name="email" type="email" maxlength="254" required></div>
        <div class="contact-field"><label for="contact-company">company</label><input id="contact-company" name="company" type="text" maxlength="160" placeholder="optional"></div>
        <div class="contact-field"><label for="contact-message">message</label><textarea id="contact-message" name="message" minlength="20" maxlength="4000" required></textarea></div>
        <div class="honeypot" aria-hidden="true"><label for="contact-website">website</label><input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="contact-actions"><button class="text-button" id="contact-submit" type="submit">[ send ]</button><span class="contact-status" id="contact-status" role="status" aria-live="polite"></span></div>
      </form>`,

    help: `
      <div class="line dim">guest@caspianmoon:~$ help</div>
      <div class="blank"></div>
      <div class="line row"><span>home</span><span class="tag">page</span><span class="description">start screen</span></div>
      <div class="line row"><span>about</span><span class="tag">page</span><span class="description">short bio</span></div>
      <div class="line row"><span>projects</span><span class="tag">page</span><span class="description">project links</span></div>
      <div class="line row"><span>memoripy</span><span class="tag">page</span><span class="description">Memoripy details</span></div>
      <div class="line row"><span>knwn</span><span class="tag">page</span><span class="description">KNWN details</span></div>
      <div class="line row"><span>contact</span><span class="tag">form</span><span class="description">send me a message</span></div>
      <div class="line row"><span>github</span><span class="tag">open</span><span class="description">GitHub profile</span></div>
      <div class="line row"><span>source</span><span class="tag">open</span><span class="description">this website's source</span></div>
      <div class="line row"><span>theme green</span><span class="tag">setting</span><span class="description">green terminal</span></div>
      <div class="line row"><span>theme amber</span><span class="tag">setting</span><span class="description">amber terminal</span></div>
      <div class="line row"><span>theme white</span><span class="tag">setting</span><span class="description">white terminal</span></div>
      <div class="line row"><span>clear</span><span class="tag">screen</span><span class="description">clear output</span></div>
      <div class="blank"></div>
      <div class="line dim">keyboard: press → from the prompt, use any arrow key to move, then press Enter. Escape returns to the prompt.</div>`
  };

  function render(name) {
    if (!screens[name]) return false;
    buffer.innerHTML = screens[name];
    bindInlineCommands();
    if (name === 'contact') bindContactForm();
    output.scrollTop = 0;
    history.replaceState(null, '', name === 'home' ? location.pathname : `#${name}`);
    return true;
  }

  function bindInlineCommands() {
    buffer.querySelectorAll('[data-command]').forEach((button) => {
      button.addEventListener('click', () => execute(button.dataset.command));
    });
  }

  function bindContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submit = document.getElementById('contact-submit');
    const status = document.getElementById('contact-status');
    if (!contactForm || !submit || !status) return;

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      submit.disabled = true;
      status.className = 'contact-status';
      status.textContent = 'sending...';

      const data = new FormData(contactForm);
      const payload = {
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        company: String(data.get('company') || ''),
        message: String(data.get('message') || ''),
        website: String(data.get('website') || '')
      };

      try {
        const response = await fetch(contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        let result = {};
        try { result = await response.json(); } catch { result = {}; }

        if (!response.ok || !result.ok) {
          throw new Error(result.message || `delivery failed (${response.status})`);
        }

        status.className = 'contact-status ok';
        status.textContent = result.reference ? `sent. ref ${result.reference}` : 'sent.';
        contactForm.reset();
      } catch (error) {
        status.className = 'contact-status bad';
        status.textContent = error instanceof Error ? error.message : 'delivery failed';
      } finally {
        submit.disabled = false;
      }
    });

    requestAnimationFrame(() => document.getElementById('contact-name')?.focus());
  }

  function setTheme(theme) {
    if (!['green', 'amber', 'white'].includes(theme)) return false;
    document.body.dataset.theme = theme;
    localStorage.setItem('moon-theme', theme);
    return true;
  }

  function execute(rawCommand) {
    const raw = String(rawCommand || '').trim();
    const command = raw.toLowerCase();
    if (!command) return;

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    if (render(command)) return;
    if (command === 'whoami') { render('about'); return; }
    if (command === 'ls' || command === 'work') { render('projects'); return; }
    if (command === 'github') { window.open(links.github, '_blank', 'noopener,noreferrer'); return; }
    if (command === 'source') { window.open(links.source, '_blank', 'noopener,noreferrer'); return; }
    if (command === 'clear') { buffer.innerHTML = ''; return; }
    if (command.startsWith('theme ')) {
      const theme = command.split(/\s+/)[1] || '';
      buffer.innerHTML = setTheme(theme)
        ? `<div class="line">theme set to <span class="bright">${escapeHtml(theme)}</span>.</div>`
        : '<div class="line error">valid themes: green, amber, white</div>';
      return;
    }

    buffer.innerHTML = `<div class="line dim">guest@caspianmoon:~$ ${escapeHtml(raw)}</div><div class="line error">command not found</div><div class="line dim">type help</div>`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function selectMenu(index) {
    menuIndex = (index + menuButtons.length) % menuButtons.length;
    menuButtons.forEach((button, buttonIndex) => button.classList.toggle('selected', buttonIndex === menuIndex));
    menuButtons[menuIndex].focus();
  }

  function leaveMenu() {
    menuButtons.forEach((button) => button.classList.remove('selected'));
    input.focus();
  }

  menuButtons.forEach((button, index) => {
    button.addEventListener('focus', () => {
      menuIndex = index;
      menuButtons.forEach((item, itemIndex) => item.classList.toggle('selected', itemIndex === menuIndex));
    });
    button.addEventListener('blur', () => {
      if (!menu.contains(document.activeElement)) button.classList.remove('selected');
    });
    button.addEventListener('click', () => {
      execute(button.dataset.command);
      leaveMenu();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    execute(value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandHistory.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || '';
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!commandHistory.length) return;
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || '';
    } else if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && input.value === '') {
      event.preventDefault();
      selectMenu(event.key === 'ArrowRight' ? 0 : menuButtons.length - 1);
    }
  });

  menu.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') { leaveMenu(); return; }
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    selectMenu(menuIndex + delta);
  });

  document.addEventListener('keydown', (event) => {
    const active = document.activeElement;
    const editing = active && ['INPUT', 'TEXTAREA'].includes(active.tagName);
    if (event.key === 'Escape' && active !== input) {
      event.preventDefault();
      leaveMenu();
      return;
    }
    if (!editing && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      selectMenu(menuIndex + delta);
    }
  });

  const bootLines = [
    'CONNECT caspianmoon.github.io:23',
    'NEGOTIATING moonOS 0.4',
    'AUTH guest',
    'OK'
  ];
  let bootIndex = 1;
  const bootTimer = setInterval(() => {
    if (bootIndex < bootLines.length) {
      bootLog.textContent += `\n${bootLines[bootIndex]}`;
      bootIndex += 1;
      return;
    }
    clearInterval(bootTimer);
    setTimeout(() => {
      boot.classList.add('done');
      input.focus();
    }, 120);
  }, 115);

  const storedTheme = localStorage.getItem('moon-theme');
  if (storedTheme) setTheme(storedTheme);
  const initialScreen = location.hash.slice(1);
  render(screens[initialScreen] ? initialScreen : 'home');
})();
