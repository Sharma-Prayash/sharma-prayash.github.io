/* =========================================================
   Kshitij Sharma — Portfolio · "Operator Console"
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- year ---- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- theme ---- */
  const root = document.documentElement, tgl = $("#themeToggle");
  try { const s = localStorage.getItem("kx-theme"); if (s) root.setAttribute("data-theme", s); } catch (e) {}
  tgl && tgl.addEventListener("click", () => {
    const n = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", n);
    try { localStorage.setItem("kx-theme", n); } catch (e) {}
  });

  /* ---- live clock (IST) ---- */
  const clock = $("#clock");
  function tickClock() {
    if (!clock) return;
    const now = new Date();
    // IST = UTC + 5:30
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const p = (n) => String(n).padStart(2, "0");
    clock.textContent = `${p(ist.getHours())}:${p(ist.getMinutes())}:${p(ist.getSeconds())} IST`;
  }
  tickClock(); setInterval(tickClock, 1000);

  /* ---- boot sequence ---- */
  const boot = $("#boot"), bootLog = $("#bootLog"), bootBar = $("#bootBar");
  const steps = [
    "> init secure_shell ........... <b>ok</b>",
    "> mount /dev · /sec ........... <b>ok</b>",
    "> load profile: kshitij ....... <b>ok</b>",
    "> status: <b>READY</b>",
  ];
  function runBoot() {
    if (!boot) return;
    if (RM) { finishBoot(); return; }
    let i = 0, pct = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        const d = document.createElement("div");
        d.innerHTML = steps[i]; bootLog.appendChild(d); i++;
      }
      pct = Math.min(100, pct + 28);
      if (bootBar) bootBar.style.width = pct + "%";
      if (i >= steps.length && pct >= 100) { clearInterval(iv); setTimeout(finishBoot, 350); }
    }, 230);
  }
  function finishBoot() {
    boot && boot.classList.add("done");
    startTerminal();
    revealFirst();
  }
  // fail-safe
  window.addEventListener("load", () => setTimeout(() => { if (boot && !boot.classList.contains("done")) finishBoot(); }, 3000));
  runBoot();

  /* ---- nav scroll state ---- */
  const bar = $("#bar");
  const onNav = () => bar && bar.classList.toggle("scrolled", window.scrollY > 36);
  onNav();

  /* ---- mobile sheet ---- */
  const burger = $("#burger"), sheet = $("#sheet");
  const closeSheet = () => { burger && burger.classList.remove("open"); sheet && sheet.classList.remove("open");
    burger && burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  if (burger && sheet) {
    burger.addEventListener("click", () => {
      const o = sheet.classList.toggle("open");
      burger.classList.toggle("open", o);
      burger.setAttribute("aria-expanded", String(o));
      document.body.style.overflow = o ? "hidden" : "";
    });
    $$("a", sheet).forEach(a => a.addEventListener("click", closeSheet));
  }

  /* ---- scramble / decode text ---- */
  const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&?/\\<>[]{}=+*".split("");
  function scramble(el) {
    const text = el.getAttribute("data-text") || el.textContent;
    if (RM) { el.textContent = text; return; }
    const dur = 620, start = performance.now();
    const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const reveal = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < reveal || text[i] === " ") out += text[i];
        else out += rand();
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = text;
    }
    requestAnimationFrame(frame);
  }

  /* ---- reveal + scramble on view ---- */
  const scrambles = $$(".scramble");
  scrambles.forEach(s => { if (!RM) s.textContent = s.getAttribute("data-text") || s.textContent; });

  function revealFirst() {
    // hero scrambles run on boot finish
    $$(".hero .scramble").forEach((s, i) => setTimeout(() => scramble(s), 120 + i * 140));
  }

  if ("IntersectionObserver" in window && !RM) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          const sc = en.target.querySelector ? en.target.querySelectorAll(".scramble") : [];
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(r => io.observe(r));

    // scramble section titles when they enter (skip hero, handled on boot)
    const so = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { scramble(en.target); so.unobserve(en.target); } });
    }, { threshold: 0.6 });
    $$(".sec .scramble").forEach(s => so.observe(s));
  } else {
    $$(".reveal").forEach(r => r.classList.add("in"));
  }

  /* ---- build ruler ticks ---- */
  const scale = $("#rulerScale");
  if (scale) {
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const tick = document.createElement("i");
      tick.style.top = (i / n * 100) + "vh";
      if (i % 5 === 0) {
        tick.className = "major";
        const b = document.createElement("b");
        b.textContent = i; b.style.top = (i / n * 100) + "vh";
        scale.appendChild(b);
      }
      scale.appendChild(tick);
    }
  }

  /* ---- steganographic hex-dump background (dossier hidden in plain sight) ---- */
  (function buildStego() {
    const el = $("#ghost"); if (!el) return;
    const secrets = [
      "KSHITIJ SHARMA",
      "ALIAS: stryver",
      "ROLE: dev + security",
      "BASE: gujarat, in",
      "FOCUS: vapt networks drm",
      "EDU: btech-mtech cse @ nfsu",
      "STATUS: open_to_work",
      ">> clearance: student"
    ];
    const rnd = () => (Math.random() * 256) | 0;
    const data = [];
    const noise = (n) => { for (let i = 0; i < n; i++) data.push({ b: rnd(), s: false }); };
    noise(22);
    secrets.forEach((s) => {
      for (let i = 0; i < s.length; i++) data.push({ b: s.charCodeAt(i), s: true });
      noise(5 + ((Math.random() * 7) | 0));
    });
    while (data.length < 64 * 16) data.push({ b: rnd(), s: false }); // fill + overflow (clipped)

    const hx = (n, w) => n.toString(16).toUpperCase().padStart(w, "0");
    const esc = (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;
    let html = "", off = 0;
    for (let i = 0; i < data.length; i += 16) {
      const row = data.slice(i, i + 16);
      let hex = "", asc = "";
      for (let j = 0; j < 16; j++) {
        hex += hx(row[j].b, 2) + (j === 7 ? "  " : " ");
        const p = row[j].b >= 32 && row[j].b <= 126;
        const ch = p ? esc(String.fromCharCode(row[j].b)) : ".";
        asc += (row[j].s && p) ? '<span class="sig">' + ch + "</span>" : ch;
      }
      html += hx(off, 5) + "  " + hex + " |" + asc + "|\n";
      off += 16;
    }
    el.innerHTML = html;
  })();

  /* ---- scroll: ruler %, active section, edge, dots ---- */
  const cursor = $("#rulerCursor"), pct = $("#rulerPct"), edge = $("#edge");
  const dots = $$(".dots a");
  const secs = $$("main section[data-label]");
  function onScroll2() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (cursor) cursor.style.top = (p * 100) + "vh";
    if (pct) pct.textContent = String(Math.round(p * 100)).padStart(3, "0");

    const mid = window.scrollY + window.innerHeight * 0.4;
    let cur = secs[0];
    secs.forEach(s => { if (s.offsetTop <= mid) cur = s; });
    if (cur) {
      const label = (cur.getAttribute("data-label") || "Index");
      if (edge) edge.textContent = label.toUpperCase();
      dots.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id));
    }
  }
  let tk = false;
  window.addEventListener("scroll", () => {
    onNav();
    if (!tk) { requestAnimationFrame(() => { onScroll2(); tk = false; }); tk = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll2);
  onScroll2();

  /* ---- crosshair follow (desktop) ---- */
  const cross = $("#hudCross");
  if (cross && window.matchMedia("(hover:hover) and (pointer:fine)").matches && !RM) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; document.body.classList.add("cross"); });
    window.addEventListener("mouseleave", () => document.body.classList.remove("cross"));
    (function loop() {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cross.style.transform = `translate(${cx - 11}px, ${cy - 11}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---- interactive terminal ---- */
  let termStarted = false;
  function startTerminal() {
    if (termStarted) return; termStarted = true;
    const body = $("#term"), out = $("#termOut"), form = $("#termForm"),
          input = $("#termIn"), term = $("#terminal"), hint = $("#termHint");
    if (!body || !out || !form || !input) return;

    // virtual filesystem
    const FS = {
      "about.txt":   "Kshitij Sharma — software developer & security student.\nIntegrated B.Tech–M.Tech CSE (Cybersecurity) @ NFSU, Gandhinagar.\nCo-Founder & CTO @ Okynus.tech. Based in Gujarat, India.",
      "focus.txt":   "Java · Computer Networks · VAPT · DRM / anti-piracy",
      "roles.txt":   "co-founder   cto   developer   builder\nOkynus.tech — DRM & anti-piracy software",
      "skills.txt":  "lang    Python  Java  C/C++  JavaScript\nsec     Burp Suite  Nmap  Wireshark  Metasploit\ntools   Git  Docker  Linux  WSL  AWS",
      "contact.txt": "email      kshitij@okynus.com\ngithub     github.com/sharma-prayash\nlinkedin   linkedin.com/in/  (coming soon)",
      "resume.pdf":  "<binary> — use the “Download résumé” button in the Contact section ↓"
    };
    const FILES = Object.keys(FS);
    const hist = []; let hp = 0;

    function echo(cmd) {
      const d = document.createElement("div");
      const p = document.createElement("span"); p.className = "pr"; p.textContent = "stryver@portfolio:~$";
      const c = document.createElement("span"); c.className = "in"; c.textContent = " " + cmd;
      d.appendChild(p); d.appendChild(c); out.appendChild(d);
    }
    function print(text, cls) {
      const d = document.createElement("div"); d.className = "ou" + (cls ? " " + cls : "");
      d.textContent = text; out.appendChild(d);
    }
    function toBottom() { body.scrollTop = body.scrollHeight; }

    const commands = {
      help() { return "available commands\n  whoami         who you’re talking to\n  ls             list files\n  cat <file>     read a file\n  clear          clear the screen\n  help           show this list\n\ntip: try  cat about.txt"; },
      whoami() { return "Kshitij Sharma · developer & security student · Co-Founder/CTO @ Okynus.tech\nrun `ls` to see files, then `cat <file>` to read one."; },
      ls() { return FILES.join("   "); },
      pwd() { return "/home/stryver"; },
      date() { return new Date().toString(); },
      sudo() { return "nice try — this incident will be reported. 😏"; },
      clear() { out.innerHTML = ""; return null; },
      cat(arg) {
        if (!arg) return "usage: cat <file>\nfiles: " + FILES.join(", ");
        if (Object.prototype.hasOwnProperty.call(FS, arg)) return FS[arg];
        return "cat: " + arg + ": No such file or directory";
      }
    };

    function run(raw) {
      const cmd = raw.trim();
      echo(cmd);
      if (cmd) {
        hist.push(cmd); hp = hist.length;
        const parts = cmd.split(/\s+/);
        const name = parts[0].toLowerCase();
        const fn = commands[name];
        const res = fn ? fn(parts.slice(1).join(" ")) : ("command not found: " + parts[0] + "   —   type `help`");
        if (res != null) print(res);
      }
      toBottom();
    }

    // interactions
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; run(v); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") { e.preventDefault(); if (hp > 0) { hp--; input.value = hist[hp] || ""; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (hp < hist.length) { hp++; input.value = hist[hp] || ""; } }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); commands.clear(); }
    });
    input.addEventListener("focus", () => hint && hint.classList.add("hide"));
    term.addEventListener("mousedown", (e) => { if (e.target !== input) { /* keep selection if dragging text */ } });
    term.addEventListener("click", (e) => { if (window.getSelection().toString() === "") input.focus(); });

    // intro: single banner line, then hand over a clean prompt
    print("portfolio shell v1.0 — type `help` for commands, `ls` to explore.", "term__muted");
    toBottom();
  }

  /* ---- smooth anchors with offset ---- */
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: RM ? "auto" : "smooth" });
  }));
})();
