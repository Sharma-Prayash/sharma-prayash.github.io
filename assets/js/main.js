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

  /* ---- terminal ---- */
  let termStarted = false;
  function startTerminal() {
    if (termStarted) return; termStarted = true;
    const body = $("#term"); if (!body) return;
    const lines = [
      { t: "cmd", x: "whoami" },
      { t: "out", x: "developer · security-student" },
      { t: "cmd", x: "cat focus.txt" },
      { t: "out", x: "Java · Networks · VAPT · DRM" },
      { t: "cmd", x: "ls roles/" },
      { t: "out", x: "co-founder  cto  builder" },
      { t: "cmd", x: "echo $MINDSET" },
      { t: "out", x: "understand the why, not just the how" },
    ];
    const PR = '<span class="pr">stryver@portfolio:~$</span> ';
    let li = 0;
    function add() {
      if (li >= lines.length) { caret(); return; }
      const l = lines[li], d = document.createElement("div");
      if (l.t === "cmd") {
        d.className = "cmd"; d.innerHTML = PR + '<span class="in"></span>';
        body.appendChild(d);
        type(d.querySelector(".in"), l.x, () => { li++; setTimeout(add, 300); });
      } else {
        d.className = "ou"; d.textContent = l.x; body.appendChild(d); li++; setTimeout(add, 240);
      }
      body.scrollTop = body.scrollHeight;
    }
    function type(el, txt, done) {
      if (RM) { el.textContent = txt; done(); return; }
      let i = 0;
      (function tk2() {
        if (i <= txt.length) { el.textContent = txt.slice(0, i); i++; body.scrollTop = body.scrollHeight; setTimeout(tk2, 40); }
        else done();
      })();
    }
    function caret() {
      const d = document.createElement("div"); d.className = "cmd";
      d.innerHTML = PR + '<span class="cur"></span>'; body.appendChild(d); body.scrollTop = body.scrollHeight;
    }
    setTimeout(add, 400);
  }

  /* ---- smooth anchors with offset ---- */
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: RM ? "auto" : "smooth" });
  }));
})();
