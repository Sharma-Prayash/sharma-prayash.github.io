/* =========================================================
   Kshitij Sharma — Portfolio · interactions
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- year ---- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- preloader ---- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("done"), 450);
  });

  /* ---- theme ---- */
  const root = document.documentElement;
  const toggle = $("#themeToggle");
  let stored = null;
  try { stored = localStorage.getItem("kx-theme"); } catch (e) {}
  if (stored) root.setAttribute("data-theme", stored);
  if (toggle) toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("kx-theme", next); } catch (e) {}
  });

  /* ---- nav scroll state ---- */
  const nav = $("#nav");
  const onScrollNav = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); };
  onScrollNav();

  /* ---- mobile menu ---- */
  const burger = $("#burger"), menu = $("#mobilemenu");
  const closeMenu = () => { burger && burger.classList.remove("open"); menu && menu.classList.remove("open");
    burger && burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", menu).forEach(a => a.addEventListener("click", closeMenu));
  }

  /* ---- scroll reveal ---- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = Math.min(i * 60, 180) + "ms";
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add("in"));
  }

  /* ---- ruler + edge label + side index ---- */
  const indicator = $("#rulerIndicator");
  const pctEl = $("#rulerPct");
  const edge = $("#edgeLabel");
  const sections = $$("main section[data-label], #hero");
  const links = $$(".sideindex a");

  const updateScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    if (indicator) indicator.style.top = (pct * 100) + "vh";
    if (pctEl) pctEl.textContent = String(Math.round(pct * 100)).padStart(3, "0");

    // active section
    const mid = window.scrollY + window.innerHeight * 0.38;
    let current = null;
    sections.forEach(s => { if (s.offsetTop <= mid) current = s; });
    if (current) {
      const label = current.getAttribute("data-label") || "Index";
      if (edge) edge.textContent = label.toUpperCase();
      const id = current.id;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    }
  };

  let ticking = false;
  const onScroll = () => {
    onScrollNav();
    if (!ticking) { window.requestAnimationFrame(() => { updateScroll(); ticking = false; }); ticking = true; }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  /* ---- terminal typewriter ---- */
  const body = $("#terminalBody");
  if (body) {
    const lines = [
      { type: "cmd", text: "whoami" },
      { type: "out", text: "Software Developer | Security Enthusiast" },
      { type: "cmd", text: "cat focus.txt" },
      { type: "out", text: "Java • Networking • VAPT • DRM" },
      { type: "cmd", text: "ls roles/" },
      { type: "out", text: "co-founder  cto  developer" },
      { type: "cmd", text: "cat mindset.txt" },
      { type: "out", text: "understand the why, not just the how." },
    ];

    const prompt = '<span class="prompt">stryver@portfolio:~$</span> ';
    let li = 0;

    function addLine() {
      if (li >= lines.length) { loopCursor(); return; }
      const l = lines[li];
      const div = document.createElement("div");
      if (l.type === "cmd") {
        div.className = "cmd";
        div.innerHTML = prompt + '<span class="input"></span>';
        body.appendChild(div);
        typeText(div.querySelector(".input"), l.text, () => { li++; setTimeout(addLine, 350); });
      } else {
        div.className = "out";
        body.appendChild(div);
        div.textContent = l.text;
        li++; setTimeout(addLine, 260);
      }
      body.scrollTop = body.scrollHeight;
    }

    function typeText(el, text, done) {
      if (reduceMotion) { el.textContent = text; done(); return; }
      let i = 0;
      (function tick() {
        if (i <= text.length) { el.textContent = text.slice(0, i); i++; body.scrollTop = body.scrollHeight; setTimeout(tick, 42); }
        else done();
      })();
    }

    function loopCursor() {
      const div = document.createElement("div");
      div.className = "cmd";
      div.innerHTML = prompt + '<span class="cursor"></span>';
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    // start when hero is visible (or immediately)
    if ("IntersectionObserver" in window) {
      const tio = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) { tio.disconnect(); setTimeout(addLine, 600); }
      }, { threshold: 0.3 });
      tio.observe(body);
    } else { addLine(); }
  }

  /* ---- smooth anchor offset for fixed nav ---- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
