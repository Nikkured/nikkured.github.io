/**
 * NIKHIL VASHISHT — NEXT-GEN PORTFOLIO ENGINE
 * Ultra-Performance Vanilla ES6+ Script
 * Zero Dependencies / Physics-Driven Interactions
 */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Toast Notification Helper ---------- */
  var toast = $("#toastNotification");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    toast.classList.add("is-visible");
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () { toast.hidden = true; }, 300);
    }, 2600);
  }

  /* ---------- Audio Feedback Engine (Web Audio API) ---------- */
  var audio = (function () {
    var ctx = null;
    var enabled = store.get("nv-audio") === "on";
    var profile = store.get("nv-audio-profile") || "minimal"; // default to elegant minimalist
    var toggle = $("#audioToggle");
    var label = $("#audioLabel");

    function updateUI() {
      if (toggle) {
        toggle.setAttribute("aria-pressed", enabled ? "true" : "false");
      }
      if (label) label.textContent = enabled ? "FX ON" : "FX OFF";
    }
    updateUI();

    on(toggle, "click", function () {
      enabled = !enabled;
      store.set("nv-audio", enabled ? "on" : "off");
      updateUI();
      if (enabled) play("toggle");
    });

    function initCtx() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
      }
      if (ctx && ctx.state === "suspended") ctx.resume();
    }

    function setProfile(p) {
      profile = p;
      store.set("nv-audio-profile", p);
      if (!enabled) {
        enabled = true;
        store.set("nv-audio", "on");
        updateUI();
      }
      play("toggle");
    }

    function getProfile() {
      return profile;
    }

    function play(type) {
      if (!enabled) return;
      initCtx();
      if (!ctx) return;

      var now = ctx.currentTime;

      // 1. MINIMALIST TACTILE (Apple / Linear / Figma Haptics)
      if (profile === "minimal") {
        if (type === "click") {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
          osc.start(now);
          osc.stop(now + 0.035);
        } else if (type === "scan") {
          // Double soft chime
          [520, 780].forEach(function (freq, i) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sine";
            var t = now + i * 0.06;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
            o.start(t);
            o.stop(t + 0.1);
          });
        } else if (type === "alert") {
          [320, 240].forEach(function (freq, i) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sine";
            var t = now + i * 0.08;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.05, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
            o.start(t);
            o.stop(t + 0.12);
          });
        } else if (type === "toggle") {
          [440, 660, 880].forEach(function (freq, i) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sine";
            var t = now + i * 0.04;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
            o.start(t);
            o.stop(t + 0.08);
          });
        }
      }
      // 2. INDUSTRIAL HARDWARE (Micro-relays & Shop Floor Laser)
      else if (profile === "industrial") {
        if (type === "click") {
          var oscI = ctx.createOscillator();
          var gainI = ctx.createGain();
          oscI.connect(gainI);
          gainI.connect(ctx.destination);
          oscI.type = "sine";
          oscI.frequency.setValueAtTime(680, now);
          oscI.frequency.exponentialRampToValueAtTime(320, now + 0.04);
          gainI.gain.setValueAtTime(0.04, now);
          gainI.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          oscI.start(now);
          oscI.stop(now + 0.04);
        } else if (type === "scan") {
          var oscS = ctx.createOscillator();
          var gainS = ctx.createGain();
          oscS.connect(gainS);
          gainS.connect(ctx.destination);
          oscS.type = "triangle";
          oscS.frequency.setValueAtTime(380, now);
          oscS.frequency.linearRampToValueAtTime(980, now + 0.12);
          gainS.gain.setValueAtTime(0.04, now);
          gainS.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          oscS.start(now);
          oscS.stop(now + 0.14);
        } else if (type === "alert") {
          var oscA = ctx.createOscillator();
          var gainA = ctx.createGain();
          oscA.connect(gainA);
          gainA.connect(ctx.destination);
          oscA.type = "sawtooth";
          oscA.frequency.setValueAtTime(260, now);
          oscA.frequency.setValueAtTime(180, now + 0.08);
          gainA.gain.setValueAtTime(0.04, now);
          gainA.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          oscA.start(now);
          oscA.stop(now + 0.16);
        } else if (type === "toggle") {
          var oscT = ctx.createOscillator();
          var gainT = ctx.createGain();
          oscT.connect(gainT);
          gainT.connect(ctx.destination);
          oscT.type = "sine";
          oscT.frequency.setValueAtTime(450, now);
          oscT.frequency.exponentialRampToValueAtTime(720, now + 0.08);
          gainT.gain.setValueAtTime(0.05, now);
          gainT.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          oscT.start(now);
          oscT.stop(now + 0.08);
        }
      }
      // 3. CYBERPUNK / SCI-FI (FM modulation & synth sweeps)
      else if (profile === "cyberpunk") {
        if (type === "click") {
          var oscC = ctx.createOscillator();
          var gainC = ctx.createGain();
          oscC.connect(gainC);
          gainC.connect(ctx.destination);
          oscC.type = "triangle";
          oscC.frequency.setValueAtTime(880, now);
          oscC.frequency.exponentialRampToValueAtTime(440, now + 0.06);
          gainC.gain.setValueAtTime(0.05, now);
          gainC.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          oscC.start(now);
          oscC.stop(now + 0.06);
        } else if (type === "scan") {
          var oscCS = ctx.createOscillator();
          var gainCS = ctx.createGain();
          oscCS.connect(gainCS);
          gainCS.connect(ctx.destination);
          oscCS.type = "sawtooth";
          oscCS.frequency.setValueAtTime(300, now);
          oscCS.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
          gainCS.gain.setValueAtTime(0.03, now);
          gainCS.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          oscCS.start(now);
          oscCS.stop(now + 0.15);
        } else if (type === "alert") {
          var oscCA = ctx.createOscillator();
          var gainCA = ctx.createGain();
          oscCA.connect(gainCA);
          gainCA.connect(ctx.destination);
          oscCA.type = "sawtooth";
          oscCA.frequency.setValueAtTime(400, now);
          oscCA.frequency.setValueAtTime(200, now + 0.1);
          gainCA.gain.setValueAtTime(0.05, now);
          gainCA.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
          oscCA.start(now);
          oscCA.stop(now + 0.2);
        } else if (type === "toggle") {
          [350, 700, 1050].forEach(function (f, idx) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sine";
            var t = now + idx * 0.04;
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
            o.start(t);
            o.stop(t + 0.08);
          });
        }
      }
      // 4. RETRO 8-BIT ARCADE (Square Wave nostalgic blips)
      else if (profile === "arcade") {
        if (type === "click") {
          var oscR = ctx.createOscillator();
          var gainR = ctx.createGain();
          oscR.connect(gainR);
          gainR.connect(ctx.destination);
          oscR.type = "square";
          oscR.frequency.setValueAtTime(320, now);
          oscR.frequency.setValueAtTime(480, now + 0.02);
          gainR.gain.setValueAtTime(0.03, now);
          gainR.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          oscR.start(now);
          oscR.stop(now + 0.04);
        } else if (type === "scan") {
          // Retro Coin Arpeggio
          [440, 554, 659, 880].forEach(function (f, idx) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "square";
            var t = now + idx * 0.035;
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
            o.start(t);
            o.stop(t + 0.06);
          });
        } else if (type === "alert") {
          var oscRA = ctx.createOscillator();
          var gainRA = ctx.createGain();
          oscRA.connect(gainRA);
          gainRA.connect(ctx.destination);
          oscRA.type = "square";
          oscRA.frequency.setValueAtTime(160, now);
          oscRA.frequency.setValueAtTime(110, now + 0.08);
          gainRA.gain.setValueAtTime(0.04, now);
          gainRA.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
          oscRA.start(now);
          oscRA.stop(now + 0.16);
        } else if (type === "toggle") {
          [261, 329, 392, 523].forEach(function (f, idx) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "square";
            var t = now + idx * 0.03;
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
            o.start(t);
            o.stop(t + 0.06);
          });
        }
      }
    }

    return {
      play: play,
      setProfile: setProfile,
      getProfile: getProfile
    };
  })();

  /* ---------- Theme Manager ---------- */
  (function theme() {
    var toggle = $("#themeToggle");
    var label = $("#themeLabel");
    var doc = document.documentElement;
    var saved = store.get("nv-theme") || "dark";
    doc.setAttribute("data-theme", saved);

    function apply() {
      var current = doc.getAttribute("data-theme") || "dark";
      if (label) label.textContent = current.toUpperCase();
      if (toggle) toggle.setAttribute("aria-pressed", current === "light" ? "true" : "false");
    }
    apply();

    on(toggle, "click", function () {
      audio.play("click");
      var next = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
      doc.setAttribute("data-theme", next);
      store.set("nv-theme", next);
      apply();
    });
  })();

  /* ---------- Kinetic Telemetry Cipher Scrambler Engine ---------- */
  var scrambler = (function () {
    var glyphs = "0123456789§ΔμσλABCDEFXYZ%#@&*+-/=";

    function scramble(el, customText, duration) {
      if (!el || prefersReduced.matches) return;
      var target = customText !== undefined ? customText : (el.getAttribute("data-original") || el.textContent.trim());
      if (!el.getAttribute("data-original")) el.setAttribute("data-original", target);

      var dur = duration || 440;
      var startTime = performance.now();
      el.classList.add("scramble-active");

      function step(now) {
        var elapsed = now - startTime;
        var progress = Math.min(1, elapsed / dur);
        var revealIndex = Math.floor(progress * target.length);

        var result = "";
        for (var i = 0; i < target.length; i++) {
          if (i < revealIndex || target[i] === " " || target[i] === "\n") {
            result += target[i];
          } else {
            result += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        el.textContent = result;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          el.classList.remove("scramble-active");
        }
      }
      requestAnimationFrame(step);
    }

    function init() {
      var elements = $$("[data-scramble]");
      elements.forEach(function (el) {
        if (!el.getAttribute("data-original")) el.setAttribute("data-original", el.textContent.trim());
        on(el, "mouseenter", function () {
          audio.play("hover");
          scramble(el);
        });
      });

      var items = $$("[data-scramble-item]");
      items.forEach(function (it) {
        on(it, "mouseenter", function () {
          audio.play("hover");
          var num = it.querySelector(".counter, strong, b, span");
          if (num) scramble(num);
        });
      });
    }

    setTimeout(init, 400);
    return { scramble: scramble, init: init };
  })();

  /* ---------- Mobile Navigation & Scrim ---------- */
  (function nav() {
    var toggle = $("#navToggle");
    var scrim = $("#navScrim");
    var links = $$("#primaryNav a");

    function close() {
      document.body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    on(toggle, "click", function () {
      audio.play("click");
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    on(scrim, "click", close);
    links.forEach(function (l) { on(l, "click", close); });
  })();

  /* ---------- Reading Progress Bar ---------- */
  (function progress() {
    var bar = $("#readingProgress");
    if (!bar) return;
    on(window, "scroll", function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      var pct = (window.scrollY / total) * 100;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }, { passive: true });
  })();

  /* ---------- Scroll-Triggered Reveal Engine ---------- */
  (function reveals() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window) || prefersReduced.matches) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.1 });

    els.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Specular Spotlight & 3D Tilt Physics ---------- */
  (function cardPhysics() {
    var cards = $$(".glass-card, .bento-cell, .video-preview-card");

    cards.forEach(function (card) {
      on(card, "mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");

        if (card.hasAttribute("data-tilt") && !prefersReduced.matches) {
          var centerX = rect.width / 2;
          var centerY = rect.height / 2;
          var rotateX = ((y - centerY) / centerY) * -5;
          var rotateY = ((x - centerX) / centerX) * 5;
          card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-2px)";
        }
      });

      on(card, "mouseleave", function () {
        if (card.hasAttribute("data-tilt")) {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        }
      });
    });
  })();

  /* ---------- Magnetic Button Physics ---------- */
  (function magneticButtons() {
    if (prefersReduced.matches) return;
    var btns = $$("[data-magnetic]");

    btns.forEach(function (btn) {
      on(btn, "mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + (x * 0.25) + "px, " + (y * 0.25) + "px)";
      });
      on(btn, "mouseleave", function () {
        btn.style.transform = "translate(0px, 0px)";
      });
    });
  })();

  /* ---------- Numerical Counters Animation ---------- */
  (function counters() {
    var items = $$(".counter");
    if (!items.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
      var format = el.getAttribute("data-format");
      var duration = 1400;
      var startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = progress * target;

        if (format === "k") {
          var val = Math.floor(current);
          el.textContent = val >= 1000 ? (val / 1000).toFixed(0) + "k" : val;
        } else if (decimals > 0) {
          el.textContent = current.toFixed(decimals);
        } else {
          el.textContent = Math.floor(current);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (format === "k") {
            el.textContent = (target >= 1000 ? (target / 1000).toFixed(0) + "k" : target);
          } else if (decimals > 0) {
            el.textContent = target.toFixed(decimals);
          } else {
            el.textContent = target;
          }
        }
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window) || prefersReduced.matches) {
      items.forEach(function (el) {
        el.textContent = el.getAttribute("data-target");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Interactive Hero Canvas Background ---------- */
  (function heroCanvas() {
    var canvas = $("#heroCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width, height;
    var particles = [];
    var count = 38;
    var mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    on(window, "resize", resize);

    on(canvas.parentElement, "mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    on(canvas.parentElement, "mouseleave", function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx * 0.015;
          p.y += dy * 0.015;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var djx = p.x - p2.x;
          var djy = p.y - p2.y;
          var d = Math.sqrt(djx * djx + djy * djy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(99, 102, 241, " + (0.16 * (1 - d / 110)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (!prefersReduced.matches) {
        requestAnimationFrame(render);
      }
    }
    render();
  })();

  /* ---------- NHK_RIMS Living Assembly Line & Pipeline Stepper ---------- */
  (function rimsStepper() {
    var tabs = $$(".stepper-tab");
    var coilPkt = $("#rimsCoilPkt");
    var coilTag = $("#rimsCoilTag");
    var autoBtn = $("#rimsAutoRunBtn");
    var playIcon = $("#rimsPlayIcon");
    var autoText = $("#rimsAutoText");
    var defectBtn = $("#rimsDefectBtn");
    var liveBadge = $("#rimsLiveStatusBadge");

    var currentIdx = 0;
    var isAutoRunning = false;
    var autoInterval = null;
    var isDefectActive = false;

    var positions = ["10%", "30%", "50%", "70%", "90%"];

    var stages = [
      {
        eyebrow: "01 // RECEIPT CONTROL & COIL INGEST",
        headline: "Source captured before inventory is created",
        ref: "RCV-260805-014",
        material: "10.60 × 1600 · Grade A",
        state: "SOURCE LINKED",
        tag: "INGEST · 10.60mm",
        control: "A material balance cannot exist without an authentic supplier heat number and recorded weight."
      },
      {
        eyebrow: "02 // LASER MICROMETER & BUNDLE",
        headline: "Laser gauge inspection & serial barcode binding",
        ref: "BND-260805-031",
        material: "Weight 214.6 kg (verified)",
        state: "TAG GENERATED",
        tag: "GAUGE OK · 10.602mm",
        control: "Dual-axis laser micrometer checks wire diameter against ±0.03mm tolerance before lot ID assignment."
      },
      {
        eyebrow: "03 // FIFO & SQLITE EDGE LEDGER",
        headline: "Oldest eligible material is surfaced first",
        ref: "FIFO-Q-118",
        material: "3 eligible lots · match OK",
        state: "FIFO PRIORITY",
        tag: "SQLITE · COMMITTED",
        control: "Algorithmic allocation prevents material aging and enforces strict FIFO compliance across shifts."
      },
      {
        eyebrow: "04 // PRODUCTION SPC VERIFICATION",
        headline: "Stock deducted strictly upon production record",
        ref: "CON-260806-007",
        material: "820 pcs · theo. wt applied",
        state: "BALANCE DEDUCTED",
        tag: "Cpk: 1.68 · PASS",
        control: "Inventory decrements only through authorized shop-floor transactions with full backward traceability."
      },
      {
        eyebrow: "05 // AUDIT & ZEBRA THERMAL DISPATCH",
        headline: "Corrections recorded as immutable ledger adjustments",
        ref: "ADJ-260806-002",
        material: "Reversal +4.2 kg (weighing adj)",
        state: "AUDIT LOGGED",
        tag: "ZPL PRINTED · OK",
        control: "Silent balance overrides are prohibited; all adjustments log user, reason, and previous state."
      }
    ];

    function setStage(idx) {
      currentIdx = idx;
      tabs.forEach(function (t, i) {
        if (i === idx) {
          t.classList.add("is-active");
          t.setAttribute("aria-selected", "true");
        } else {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        }
      });

      if (coilPkt) {
        coilPkt.style.left = positions[idx] || "10%";
      }

      var data = stages[idx];
      if (!data) return;

      var eb = $("#rimsEyebrow"); if (eb) eb.textContent = data.eyebrow;
      var hl = $("#rimsHeadline"); if (hl) hl.textContent = data.headline;
      var rf = $("#rimsRef");
      var mt = $("#rimsMaterial");
      var st = $("#rimsState");
      var ct = $("#rimsControlText");

      if (rf) {
        rf.textContent = data.ref;
        scrambler.scramble(rf, data.ref, 320);
      }
      if (mt) {
        mt.textContent = data.material;
      }
      if (st) {
        st.textContent = data.state;
      }
      if (ct) {
        ct.textContent = data.control;
      }

      if (coilTag && !isDefectActive) {
        coilTag.textContent = data.tag;
      }
    }

    tabs.forEach(function (tab) {
      on(tab, "click", function () {
        audio.play("click");
        if (isAutoRunning) stopAuto();
        var idx = parseInt(tab.getAttribute("data-stage"), 10) || 0;
        setStage(idx);
      });
    });

    function nextStage() {
      var next = (currentIdx + 1) % stages.length;
      audio.play("hover");
      setStage(next);
    }

    function startAuto() {
      isAutoRunning = true;
      if (playIcon) playIcon.textContent = "⏸";
      if (autoText) autoText.textContent = "Pause";
      if (autoBtn) autoBtn.classList.add("is-running");
      audio.play("toggle");
      autoInterval = setInterval(nextStage, 2200);
    }

    function stopAuto() {
      isAutoRunning = false;
      if (playIcon) playIcon.textContent = "▶";
      if (autoText) autoText.textContent = "Auto-Cycle";
      if (autoBtn) autoBtn.classList.remove("is-running");
      if (autoInterval) clearInterval(autoInterval);
    }

    on(autoBtn, "click", function () {
      if (isAutoRunning) stopAuto();
      else startAuto();
    });

    on(defectBtn, "click", function () {
      isDefectActive = true;
      audio.play("alert");
      if (coilPkt) coilPkt.classList.add("defect-state");
      if (coilTag) coilTag.textContent = "⚠️ NG: 10.82mm (OUT-OF-SPEC)";
      if (liveBadge) {
        liveBadge.textContent = "🔴 DEFECT QUARANTINED";
        liveBadge.style.color = "#f87171";
      }

      var st = $("#rimsState");
      if (st) {
        st.className = "state-pill";
        st.style.background = "rgba(239, 68, 68, 0.2)";
        st.style.color = "#f87171";
        st.textContent = "QUARANTINED (HOLD)";
      }

      showToast("⚠️ Laser Micrometer Detected Defect: Diameter 10.82mm exceeds USL (+0.03mm). Material Quarantined!");

      setTimeout(function () {
        isDefectActive = false;
        if (coilPkt) coilPkt.classList.remove("defect-state");
        if (coilTag) coilTag.textContent = stages[currentIdx].tag;
        if (liveBadge) {
          liveBadge.textContent = "🟢 STABLE RUNNING";
          liveBadge.style.color = "";
        }
        if (st) {
          st.className = "state-pill ok";
          st.style.background = "";
          st.style.color = "";
          st.textContent = stages[currentIdx].state;
        }
      }, 4200);
    });

    setStage(0);
  })();

  /* ---------- Real-Time SPC Waveform Streamer ---------- */
  (function spcStreamer() {
    var canvas = $("#spcChart");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var mode = "normal";
    var target = 10.00;
    var sigma = 0.15;
    var ucl = target + 3 * sigma;
    var lcl = target - 3 * sigma;

    var maxPoints = 26;
    var data = [];
    var stepCount = 0;

    for (var i = 0; i < maxPoints; i++) {
      data.push(target + (Math.random() - 0.5) * 1.6 * sigma);
    }

    var btns = $$(".spc-btn");
    btns.forEach(function (b) {
      on(b, "click", function () {
        audio.play("click");
        btns.forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        mode = b.getAttribute("data-mode") || "normal";
      });
    });

    function generateNext() {
      stepCount++;
      var val = target;
      if (mode === "normal") {
        val = target + (Math.random() - 0.5) * 2 * sigma;
      } else if (mode === "drift") {
        val = target + 1.5 * sigma + (Math.random() - 0.5) * 1.5 * sigma;
      } else if (mode === "wear") {
        var trend = (stepCount % 12) * (sigma * 0.35);
        val = target - sigma + trend + (Math.random() - 0.5) * sigma;
      } else if (mode === "spike") {
        val = target + (Math.random() > 0.5 ? 3.4 : -3.4) * sigma;
      }
      data.push(val);
      if (data.length > maxPoints) data.shift();
    }

    function draw() {
      var w = canvas.width = canvas.offsetWidth;
      var h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      var padX = 30;
      var padY = 24;
      var plotW = w - padX * 2;
      var plotH = h - padY * 2;

      var minY = target - 4.5 * sigma;
      var maxY = target + 4.5 * sigma;

      function getY(v) {
        return padY + plotH - ((v - minY) / (maxY - minY)) * plotH;
      }

      var yUCL = getY(ucl);
      var yLCL = getY(lcl);
      var yCL = getY(target);

      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
      ctx.beginPath(); ctx.moveTo(padX, yUCL); ctx.lineTo(w - padX, yUCL); ctx.stroke();

      ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
      ctx.beginPath(); ctx.moveTo(padX, yLCL); ctx.lineTo(w - padX, yLCL); ctx.stroke();

      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.beginPath(); ctx.moveTo(padX, yCL); ctx.lineTo(w - padX, yCL); ctx.stroke();
      ctx.setLineDash([]);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();

      var stepX = plotW / (maxPoints - 1);
      var breach = false;

      for (var j = 0; j < data.length; j++) {
        var px = padX + j * stepX;
        var py = getY(data[j]);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      for (var k = 0; k < data.length; k++) {
        var ptX = padX + k * stepX;
        var ptY = getY(data[k]);
        var isOut = data[k] > ucl || data[k] < lcl;
        if (isOut) breach = true;

        ctx.beginPath();
        ctx.arc(ptX, ptY, isOut ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isOut ? "#f43f5e" : "#06b6d4";
        ctx.fill();
        if (isOut) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      var statBox = $("#spcStatusBox");
      var statTxt = $("#spcStatusText");
      if (statBox && statTxt) {
        if (breach) {
          statBox.classList.add("is-breach");
          statTxt.textContent = "OUT OF CONTROL";
          statTxt.style.color = "var(--rose)";
        } else {
          statBox.classList.remove("is-breach");
          statTxt.textContent = "CONTROLLED";
          statTxt.style.color = "var(--emerald)";
        }
      }
    }

    setInterval(function () {
      generateNext();
      draw();
    }, 1400);

    draw();

    window.triggerSpcSpike = function () {
      mode = "spike";
      generateNext();
      draw();
      audio.play("alert");
      setTimeout(function () { mode = "normal"; }, 3000);
    };
  })();

  /* ---------- FEATURE 1: SIX-SIGMA CPK GAUSSIAN BELL CURVE LAB ---------- */
  (function cpkLab() {
    var canvas = $("#cpkCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var sMean = $("#sliderMean");
    var sSigma = $("#sliderSigma");
    var sTol = $("#sliderTol");

    var vMean = $("#valMean");
    var vSigma = $("#valSigma");
    var vTol = $("#valTol");

    var outCpk = $("#outCpk");
    var outCp = $("#outCp");
    var outCpuCpl = $("#outCpuCpl");
    var outPpm = $("#outPpm");
    var cpkTag = $("#outCpkTag");

    function erf(x) {
      // Approximation for error function
      var a1 =  0.254829592;
      var a2 = -0.284496736;
      var a3 =  1.421413741;
      var a4 = -1.453152027;
      var a5 =  1.061405429;
      var p  =  0.3275911;
      var sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      var t = 1.0 / (1.0 + p * x);
      var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return sign * y;
    }

    function stdNormCdf(z) {
      return 0.5 * (1.0 + erf(z / Math.SQRT2));
    }

    function update() {
      var mean = parseFloat(sMean.value);
      var sigma = parseFloat(sSigma.value);
      var tol = parseFloat(sTol.value);

      var nominal = 10.00;
      var usl = nominal + tol;
      var lsl = nominal - tol;

      if (vMean) vMean.textContent = mean.toFixed(2) + " mm";
      if (vSigma) vSigma.textContent = sigma.toFixed(2) + " mm";
      if (vTol) vTol.textContent = "±" + tol.toFixed(2) + " mm";

      // Math calculations
      var cp = (usl - lsl) / (6 * sigma);
      var cpu = (usl - mean) / (3 * sigma);
      var cpl = (mean - lsl) / (3 * sigma);
      var cpk = Math.min(cpu, cpl);

      // PPM Defect calculation
      var zUsl = (usl - mean) / sigma;
      var zLsl = (mean - lsl) / sigma;
      var pUpper = 1.0 - stdNormCdf(zUsl);
      var pLower = 1.0 - stdNormCdf(zLsl);
      var totalPpm = (pUpper + pLower) * 1000000;

      if (outCpk) outCpk.textContent = cpk.toFixed(2);
      if (outCp) outCp.textContent = cp.toFixed(2);
      if (outCpuCpl) outCpuCpl.textContent = cpu.toFixed(2) + " / " + cpl.toFixed(2);
      
      if (outPpm) {
        if (totalPpm < 1) outPpm.textContent = "< 1 PPM";
        else if (totalPpm > 50000) outPpm.textContent = Math.round(totalPpm).toLocaleString() + " PPM (HIGH)";
        else outPpm.textContent = Math.round(totalPpm).toLocaleString() + " PPM";
      }

      if (cpkTag) {
        cpkTag.className = "cpk-status-tag";
        if (cpk >= 1.67) {
          cpkTag.textContent = "SIX-SIGMA (1.67+)";
          cpkTag.classList.add("six-sigma");
        } else if (cpk >= 1.33) {
          cpkTag.textContent = "CAPABLE (1.33+)";
        } else {
          cpkTag.textContent = "INCAPABLE (<1.33)";
          cpkTag.classList.add("warning");
        }
      }

      // Draw Normal Distribution Curve
      var w = canvas.width = canvas.offsetWidth;
      var h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      var minX = nominal - 1.0;
      var maxX = nominal + 1.0;
      var padY = 20;
      var plotH = h - padY * 2;

      function getPx(xVal) {
        return ((xVal - minX) / (maxX - minX)) * w;
      }

      function gaussian(xVal) {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xVal - mean) / sigma, 2));
      }

      var maxG = gaussian(mean);
      if (maxG < 2) maxG = 2;

      function getPy(yVal) {
        return h - padY - (yVal / (maxG * 1.15)) * plotH;
      }

      // Draw Shaded Out-of-Spec Regions
      var steps = 140;
      var dx = (maxX - minX) / steps;

      ctx.fillStyle = "rgba(244, 63, 94, 0.35)";
      // Left tail (< LSL)
      ctx.beginPath();
      ctx.moveTo(getPx(minX), h - padY);
      for (var x = minX; x <= lsl; x += dx) {
        ctx.lineTo(getPx(x), getPy(gaussian(x)));
      }
      ctx.lineTo(getPx(lsl), h - padY);
      ctx.closePath();
      ctx.fill();

      // Right tail (> USL)
      ctx.beginPath();
      ctx.moveTo(getPx(usl), h - padY);
      for (var x2 = usl; x2 <= maxX; x2 += dx) {
        ctx.lineTo(getPx(x2), getPy(gaussian(x2)));
      }
      ctx.lineTo(getPx(maxX), h - padY);
      ctx.closePath();
      ctx.fill();

      // Draw In-Spec Accept Fill (Indigo/Cyan)
      ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
      ctx.beginPath();
      ctx.moveTo(getPx(lsl), h - padY);
      for (var xi = lsl; xi <= usl; xi += dx) {
        ctx.lineTo(getPx(xi), getPy(gaussian(xi)));
      }
      ctx.lineTo(getPx(usl), h - padY);
      ctx.closePath();
      ctx.fill();

      // Draw Bell Curve Line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#38bdf8";
      for (var i = 0; i <= steps; i++) {
        var xPlot = minX + i * dx;
        var yPlot = gaussian(xPlot);
        if (i === 0) ctx.moveTo(getPx(xPlot), getPy(yPlot));
        else ctx.lineTo(getPx(xPlot), getPy(yPlot));
      }
      ctx.stroke();

      // Draw Specification Limit Marker Lines
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);

      // LSL
      ctx.strokeStyle = "#f43f5e";
      ctx.beginPath(); ctx.moveTo(getPx(lsl), 10); ctx.lineTo(getPx(lsl), h - padY); ctx.stroke();
      ctx.fillStyle = "#f43f5e";
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillText("LSL: " + lsl.toFixed(2), getPx(lsl) - 25, padY - 5);

      // USL
      ctx.beginPath(); ctx.moveTo(getPx(usl), 10); ctx.lineTo(getPx(usl), h - padY); ctx.stroke();
      ctx.fillText("USL: " + usl.toFixed(2), getPx(usl) - 25, padY - 5);

      // Mean line
      ctx.strokeStyle = "#818cf8";
      ctx.beginPath(); ctx.moveTo(getPx(mean), 15); ctx.lineTo(getPx(mean), h - padY); ctx.stroke();
      ctx.fillStyle = "#818cf8";
      ctx.fillText("μ: " + mean.toFixed(2), getPx(mean) - 15, h - 5);

      ctx.setLineDash([]);
    }

    on(sMean, "input", function () { update(); audio.play("click"); });
    on(sSigma, "input", function () { update(); audio.play("click"); });
    on(sTol, "input", function () { update(); audio.play("click"); });
    on(window, "resize", update);

    update();
  })();

  /* ---------- FEATURE 3: ZEBRA ZPL INDUSTRIAL STUDIO (REAL SCANNABLE BARCODES) ---------- */
  (function zplStudio() {
    var part = $("#zplPart");
    var heat = $("#zplHeat");
    var weight = $("#zplWeight");
    var status = $("#zplStatus");
    var codeOut = $("#zplCodeOut");
    var copyBtn = $("#copyZplBtn");

    var lblPart = $("#lblPart");
    var lblHeat = $("#lblHeat");
    var lblSerial = $("#lblSerial");
    var lblWeight = $("#lblWeight");
    var lblDate = $("#lblDate");
    var lblStamp = $("#lblStamp");
    var lblBarcodeHuman = $("#lblBarcodeHuman");
    var qrCanvas = $("#qrCanvasPreview");
    var barCanvas = $("#barcodeCanvas1D");

    /* =========================================================================
       GOLD-STANDARD QR CODE GENERATOR (ISO/IEC 18004 COMPLIANT)
       ========================================================================= */
    var QRGenerator = (function () {
      function QR8BitByte(data) {
        this.mode = 4;
        this.data = data;
      }
      QR8BitByte.prototype = {
        getLength: function () { return this.data.length; },
        write: function (buffer) {
          for (var i = 0; i < this.data.length; i++) {
            buffer.put(this.data.charCodeAt(i), 8);
          }
        }
      };

      function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
      }
      QRCodeModel.prototype = {
        addData: function (data) {
          this.dataList.push(new QR8BitByte(data));
          this.dataCache = null;
        },
        isDark: function (row, col) {
          return this.modules[row][col];
        },
        getModuleCount: function () {
          return this.moduleCount;
        },
        make: function () {
          if (this.typeNumber < 1) {
            var typeNumber = 1;
            for (typeNumber = 1; typeNumber < 40; typeNumber++) {
              var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
              var buffer = new QRBitBuffer();
              var totalDataCount = 0;
              for (var i = 0; i < rsBlocks.length; i++) {
                totalDataCount += rsBlocks[i].dataCount;
              }
              for (var j = 0; j < this.dataList.length; j++) {
                var d = this.dataList[j];
                buffer.put(d.mode, 4);
                buffer.put(d.getLength(), QRUtil.getLengthInBits(d.mode, typeNumber));
                d.write(buffer);
              }
              if (buffer.getLengthInBits() <= totalDataCount * 8) break;
            }
            this.typeNumber = typeNumber;
          }
          this.makeImpl(false, this.getBestMaskPattern());
        },
        makeImpl: function (test, maskPattern) {
          this.moduleCount = this.typeNumber * 4 + 17;
          this.modules = new Array(this.moduleCount);
          for (var row = 0; row < this.moduleCount; row++) {
            this.modules[row] = new Array(this.moduleCount);
            for (var col = 0; col < this.moduleCount; col++) {
              this.modules[row][col] = null;
            }
          }
          this.setupPositionProbePattern(0, 0);
          this.setupPositionProbePattern(this.moduleCount - 7, 0);
          this.setupPositionProbePattern(0, this.moduleCount - 7);
          this.setupPositionAdjustPattern();
          this.setupTimingPattern();
          this.setupTypeInfo(test, maskPattern);
          if (this.typeNumber >= 7) {
            this.setupTypeNumber(test);
          }
          if (this.dataCache == null) {
            this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
          }
          this.mapData(this.dataCache, maskPattern);
        },
        setupPositionProbePattern: function (row, col) {
          for (var r = -1; r <= 7; r++) {
            if (row + r <= -1 || this.moduleCount <= row + r) continue;
            for (var c = -1; c <= 7; c++) {
              if (col + c <= -1 || this.moduleCount <= col + c) continue;
              if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        },
        getBestMaskPattern: function () {
          var minLostPoint = 0;
          var pattern = 0;
          for (var i = 0; i < 8; i++) {
            this.makeImpl(true, i);
            var lostPoint = QRUtil.getLostPoint(this);
            if (i == 0 || minLostPoint > lostPoint) {
              minLostPoint = lostPoint;
              pattern = i;
            }
          }
          return pattern;
        },
        setupTimingPattern: function () {
          for (var r = 8; r < this.moduleCount - 8; r++) {
            if (this.modules[r][6] !== null) continue;
            this.modules[r][6] = (r % 2 == 0);
          }
          for (var c = 8; c < this.moduleCount - 8; c++) {
            if (this.modules[6][c] !== null) continue;
            this.modules[6][c] = (c % 2 == 0);
          }
        },
        setupPositionAdjustPattern: function () {
          var pos = QRUtil.getPatternPosition(this.typeNumber);
          for (var i = 0; i < pos.length; i++) {
            for (var j = 0; j < pos.length; j++) {
              var row = pos[i];
              var col = pos[j];
              if (this.modules[row][col] !== null) continue;
              for (var r = -2; r <= 2; r++) {
                for (var c = -2; c <= 2; c++) {
                  if (Math.abs(r) == 2 || Math.abs(c) == 2 || (r == 0 && c == 0)) {
                    this.modules[row + r][col + c] = true;
                  } else {
                    this.modules[row + r][col + c] = false;
                  }
                }
              }
            }
          }
        },
        setupTypeInfo: function (test, maskPattern) {
          var data = (this.errorCorrectLevel << 3) | maskPattern;
          var bits = QRUtil.getBCHTypeInfo(data);
          for (var i = 0; i < 15; i++) {
            var mod = (!test && ((bits >> i) & 1) == 1);
            if (i < 6) this.modules[i][8] = mod;
            else if (i < 8) this.modules[i + 1][8] = mod;
            else this.modules[this.moduleCount - 15 + i][8] = mod;

            if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
            else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
            else this.modules[8][15 - i - 1] = mod;
          }
          this.modules[this.moduleCount - 8][8] = !test;
        },
        setupTypeNumber: function (test) {
          var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
          for (var i = 0; i < 18; i++) {
            var mod = (!test && ((bits >> i) & 1) == 1);
            this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
            this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
          }
        },
        mapData: function (data, maskPattern) {
          var inc = -1;
          var row = this.moduleCount - 1;
          var bitIndex = 7;
          var byteIndex = 0;
          var maskFunc = QRUtil.getMaskFunction(maskPattern);
          for (var col = this.moduleCount - 1; col > 0; col -= 2) {
            if (col == 6) col--;
            while (true) {
              for (var c = 0; c < 2; c++) {
                if (this.modules[row][col - c] === null) {
                  var dark = false;
                  if (byteIndex < data.length) {
                    dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                  }
                  var mask = maskFunc(row, col - c);
                  if (mask) dark = !dark;
                  this.modules[row][col - c] = dark;
                  bitIndex--;
                  if (bitIndex == -1) {
                    byteIndex++;
                    bitIndex = 7;
                  }
                }
              }
              row += inc;
              if (row < 0 || this.moduleCount <= row) {
                row -= inc;
                inc = -inc;
                break;
              }
            }
          }
        }
      };

      QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        var buffer = new QRBitBuffer();
        for (var i = 0; i < dataList.length; i++) {
          var data = dataList[i];
          buffer.put(data.mode, 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
          data.write(buffer);
        }
        var totalDataCount = 0;
        for (var k = 0; k < rsBlocks.length; k++) {
          totalDataCount += rsBlocks[k].dataCount;
        }
        if (buffer.getLengthInBits() > totalDataCount * 8) {
          throw new Error("QR length overflow: " + buffer.getLengthInBits() + " > " + totalDataCount * 8);
        }
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
        while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
        while (true) {
          if (buffer.getLengthInBits() >= totalDataCount * 8) break;
          buffer.put(0xEC, 8);
          if (buffer.getLengthInBits() >= totalDataCount * 8) break;
          buffer.put(0x11, 8);
        }
        return QRCodeModel.createBytes(buffer, rsBlocks);
      };

      QRCodeModel.createBytes = function (buffer, rsBlocks) {
        var offset = 0;
        var maxDcCount = 0;
        var maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
          var dcCount = rsBlocks[r].dataCount;
          var ecCount = rsBlocks[r].totalCount - dcCount;
          maxDcCount = Math.max(maxDcCount, dcCount);
          maxEcCount = Math.max(maxEcCount, ecCount);
          dcdata[r] = new Array(dcCount);
          for (var i = 0; i < dcdata[r].length; i++) {
            dcdata[r][i] = 0xff & buffer.buffer[i + offset];
          }
          offset += dcCount;
          var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
          var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
          var modPoly = rawPoly.mod(rsPoly);
          ecdata[r] = new Array(rsPoly.getLength() - 1);
          for (var j = 0; j < ecdata[r].length; j++) {
            var modIndex = j + modPoly.getLength() - ecdata[r].length;
            ecdata[r][j] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
          }
        }
        var totalCodeCount = 0;
        for (var m = 0; m < rsBlocks.length; m++) totalCodeCount += rsBlocks[m].totalCount;
        var data = new Array(totalCodeCount);
        var index = 0;
        for (var p = 0; p < maxDcCount; p++) {
          for (var q = 0; q < rsBlocks.length; q++) {
            if (p < dcdata[q].length) data[index++] = dcdata[q][p];
          }
        }
        for (var p2 = 0; p2 < maxEcCount; p2++) {
          for (var q2 = 0; q2 < rsBlocks.length; q2++) {
            if (p2 < ecdata[q2].length) data[index++] = ecdata[q2][p2];
          }
        }
        return data;
      };

      function QRPolynomial(num, shift) {
        var offset = 0;
        while (offset < num.length && num[offset] == 0) offset++;
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
      }
      QRPolynomial.prototype = {
        get: function (index) { return this.num[index]; },
        getLength: function () { return this.num.length; },
        multiply: function (e) {
          var num = new Array(this.getLength() + e.getLength() - 1);
          for (var i = 0; i < this.getLength(); i++) {
            for (var j = 0; j < e.getLength(); j++) {
              num[i + j] ^= QRMath.gmult(this.get(i), e.get(j));
            }
          }
          return new QRPolynomial(num, 0);
        },
        mod: function (e) {
          if (this.getLength() - e.getLength() < 0) return this;
          var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
          var num = new Array(this.getLength());
          for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
          for (var j = 0; j < e.getLength(); j++) {
            num[j] ^= QRMath.gexp(QRMath.glog(e.get(j)) + ratio);
          }
          return new QRPolynomial(num, 0).mod(e);
        }
      };

      var QRMath = {
        glog: function (n) { return QRMath.LOG_TABLE[n]; },
        gexp: function (n) {
          while (n < 0) n += 255;
          while (n >= 256) n -= 255;
          return QRMath.EXP_TABLE[n];
        },
        gmult: function (a, b) {
          if (a == 0 || b == 0) return 0;
          return QRMath.gexp(QRMath.glog(a) + QRMath.glog(b));
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
      };
      for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
      for (var i2 = 8; i2 < 256; i2++) QRMath.EXP_TABLE[i2] = QRMath.EXP_TABLE[i2 - 4] ^ QRMath.EXP_TABLE[i2 - 5] ^ QRMath.EXP_TABLE[i2 - 6] ^ QRMath.EXP_TABLE[i2 - 8];
      for (var i3 = 0; i3 < 255; i3++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i3]] = i3;

      function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount;
        this.dataCount = dataCount;
      }
      QRRSBlock.RS_BLOCK_TABLE = [
        [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
        [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
        [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
        [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
        [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
        [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
        [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
        [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
        [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]
      ];
      QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
        var mapping = { 1: 0, 0: 1, 3: 2, 2: 3 }; // L=1 -> 0, M=0 -> 1, Q=3 -> 2, H=2 -> 3
        var offset = mapping[errorCorrectLevel] !== undefined ? mapping[errorCorrectLevel] : 0;
        var table = QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + offset];
        var length = table.length / 3;
        var list = [];
        for (var idx = 0; idx < length; idx++) {
          var count = table[idx * 3 + 0];
          var totalCount = table[idx * 3 + 1];
          var dataCount = table[idx * 3 + 2];
          for (var j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
        }
        return list;
      };

      function QRBitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      QRBitBuffer.prototype = {
        get: function (index) {
          var bufIndex = Math.floor(index / 8);
          return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
        },
        put: function (num, length) {
          for (var i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) == 1);
        },
        getLengthInBits: function () { return this.length; },
        putBit: function (bit) {
          var bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) this.buffer.push(0);
          if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
          this.length++;
        }
      };

      var QRUtil = {
        PATTERN_POSITION_TABLE: [
          [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
          [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
        ],
        G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
        G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
        G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
        getBCHTypeInfo: function (data) {
          var d = data << 10;
          while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
          }
          return ((data << 10) | d) ^ QRUtil.G15_MASK;
        },
        getBCHTypeNumber: function (data) {
          var d = data << 12;
          while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
          }
          return (data << 12) | d;
        },
        getBCHDigit: function (data) {
          var digit = 0;
          while (data != 0) {
            digit++;
            data >>>= 1;
          }
          return digit;
        },
        getPatternPosition: function (typeNumber) {
          return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [];
        },
        getMaskFunction: function (maskPattern) {
          switch (maskPattern) {
            case 0: return function (i, j) { return (i + j) % 2 == 0; };
            case 1: return function (i, j) { return i % 2 == 0; };
            case 2: return function (i, j) { return j % 3 == 0; };
            case 3: return function (i, j) { return (i + j) % 3 == 0; };
            case 4: return function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; };
            case 5: return function (i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
            case 6: return function (i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 == 0; };
            case 7: return function (i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 == 0; };
            default: throw new Error("bad maskPattern:" + maskPattern);
          }
        },
        getErrorCorrectPolynomial: function (errorCorrectLength) {
          var a = new QRPolynomial([1], 0);
          for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
          }
          return a;
        },
        getLengthInBits: function (mode, type) {
          if (1 <= type && type < 10) {
            switch (mode) {
              case 1: return 10;
              case 2: return 9;
              case 4: return 8;
              case 8: return 8;
              default: throw new Error("mode:" + mode);
            }
          } else {
            switch (mode) {
              case 1: return 12;
              case 2: return 11;
              case 4: return 16;
              case 8: return 10;
              default: throw new Error("mode:" + mode);
            }
          }
        },
        getLostPoint: function (qrCode) {
          var moduleCount = qrCode.getModuleCount();
          var lostPoint = 0;
          for (var row = 0; row < moduleCount; row++) {
            for (var col = 0; col < moduleCount; col++) {
              var sameCount = 0;
              var dark = qrCode.isDark(row, col);
              for (var r = -1; r <= 1; r++) {
                if (row + r < 0 || moduleCount <= row + r) continue;
                for (var c = -1; c <= 1; c++) {
                  if (col + c < 0 || moduleCount <= col + c) continue;
                  if (r == 0 && c == 0) continue;
                  if (dark == qrCode.isDark(row + r, col + c)) sameCount++;
                }
              }
              if (sameCount > 5) lostPoint += (3 + sameCount - 5);
            }
          }
          return lostPoint;
        }
      };

      function draw(canvas, text) {
        if (!canvas) return;
        var qr = new QRCodeModel(0, 1); // Auto version, Level L (1)
        qr.addData(text);
        qr.make();

        var count = qr.getModuleCount();
        var border = 4; // Standard 4-module quiet zone
        var totalDim = count + border * 2;

        var scale = 7; // High-resolution crisp rendering
        var realPx = totalDim * scale;
        canvas.width = realPx;
        canvas.height = realPx;

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, realPx, realPx);

        ctx.fillStyle = "#000000";
        for (var r = 0; r < count; r++) {
          for (var c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect((c + border) * scale, (r + border) * scale, scale, scale);
            }
          }
        }
      }

      return { draw: draw };
    })();

    /* =========================================================================
       AUTHENTIC 1D CODE 128-B BARCODE GENERATOR (ISO/IEC 15417 STANDARD)
       ========================================================================= */
    var Code128 = (function () {
      var PATTERNS = [
        "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
        "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
        "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
        "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
        "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
        "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
        "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
        "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
        "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
        "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
        "114131","311141","411131","211412","211214","211232","2331112"
      ];

      function draw(canvas, text) {
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var clean = text.replace(/[^A-Za-z0-9\-_.]/g, "");
        if (!clean) clean = "BND-260826-004";

        var codes = [104]; // Start Code B
        var checksum = 104;

        for (var i = 0; i < clean.length; i++) {
          var val = clean.charCodeAt(i) - 32;
          if (val < 0 || val > 95) val = 0;
          codes.push(val);
          checksum += val * (i + 1);
        }

        codes.push(checksum % 103);
        codes.push(106); // Stop Code

        var modules = [];
        for (var c = 0; c < codes.length; c++) {
          var pat = PATTERNS[codes[c]];
          if (!pat) continue;
          var isBar = true;
          for (var p = 0; p < pat.length; p++) {
            var width = parseInt(pat[p], 10);
            for (var w = 0; w < width; w++) {
              modules.push(isBar ? 1 : 0);
            }
            isBar = !isBar;
          }
        }

        var quiet = 14;
        var totalModules = modules.length + quiet * 2;
        var w = canvas.width = 380;
        var h = canvas.height = 48;
        var modWidth = w / totalModules;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#000000";
        for (var m = 0; m < modules.length; m++) {
          if (modules[m] === 1) {
            ctx.fillRect((m + quiet) * modWidth, 0, modWidth + 0.3, h);
          }
        }
      }

      return { draw: draw };
    })();

    function update() {
      var pVal = part ? part.value : "10.60 x 1600mm Gr-A";
      var hVal = heat ? heat.value : "HT-260826-09";
      var wVal = weight ? weight.value : "214.6";
      var sVal = status ? status.value : "ACCEPTED";
      var qrTypeSelect = $("#zplQrType");
      var qrType = qrTypeSelect ? qrTypeSelect.value : "text";

      var serial = "BND-260826-" + Math.abs((hVal.length * 17) % 900 + 100);

      if (lblPart) lblPart.textContent = pVal;
      if (lblHeat) lblHeat.textContent = hVal;
      if (lblSerial) lblSerial.textContent = serial;
      if (lblWeight) lblWeight.textContent = parseFloat(wVal || 0).toFixed(2) + " kg";
      if (lblBarcodeHuman) lblBarcodeHuman.textContent = "*" + serial + "*";

      if (lblStamp) {
        lblStamp.textContent = sVal;
        lblStamp.className = "label-stamp " + (sVal === "ACCEPTED" ? "stamp-accepted" : sVal === "HOLD" ? "stamp-hold" : "stamp-rejected");
      }

      // Generate raw ZPL string
      var zpl = [
        "^XA",
        "^FO30,30^A0N,28,28^FDNHK SPRING INDIA LTD^FS",
        "^FO30,65^A0N,20,20^FDMAT: " + pVal + "^FS",
        "^FO30,95^A0N,20,20^FDHEAT: " + hVal + "^FS",
        "^FO30,125^A0N,20,20^FDWT: " + wVal + " KG  DISP: " + sVal + "^FS",
        "^FO30,155^BCN,40,Y,N,N^FD" + serial + "^FS",
        "^FO320,30^BXN,6,200^FD" + hVal + "|" + wVal + "|" + sVal + "^FS",
        "^XZ"
      ].join("\n");

      if (codeOut) codeOut.textContent = zpl;

      var qrPayload = "";
      if (qrType === "url") {
        // Web Verification Mode (Opens verified digital certificate on the portfolio)
        qrPayload = "https://nikkured.github.io/?trace=" + encodeURIComponent(serial) + "&heat=" + encodeURIComponent(hVal) + "&mat=" + encodeURIComponent(pVal) + "&wt=" + encodeURIComponent(wVal) + "&disp=" + encodeURIComponent(sVal);
      } else {
        // Direct Plain-Text Traceability Tag (Displays raw specification directly in phone scanner)
        qrPayload = [
          "NHK SPRING INDIA LTD.",
          "RAW MATERIAL TRACEABILITY TAG",
          "",
          "PART SPEC: " + pVal,
          "HEAT NO: " + hVal,
          "SERIAL: " + serial,
          "GROSS WT: " + parseFloat(wVal || 0).toFixed(2) + " kg",
          "DATE/SHIFT: 2026-08-26 / Shift-A",
          "STATUS: " + sVal
        ].join("\n");
      }
      
      QRGenerator.draw(qrCanvas, qrPayload);
      Code128.draw(barCanvas, serial);
    }

    on(part, "input", update);
    on(heat, "input", update);
    on(weight, "input", update);
    on(status, "change", function () { update(); audio.play("click"); });
    on($("#zplQrType"), "change", function () { update(); audio.play("scan"); });
    on(window, "resize", update);

    on(copyBtn, "click", function () {
      audio.play("scan");
      if (codeOut && navigator.clipboard) {
        navigator.clipboard.writeText(codeOut.textContent).then(function () {
          showToast("✓ Raw ZPL Code copied to clipboard!");
        });
      }
    });

    update();
  })();

  /* ---------- URL Traceability Record Auto-Opener ---------- */
  (function traceUrlChecker() {
    var params = new URLSearchParams(window.location.search);
    if (params.has("trace") || params.has("heat")) {
      var modal = $("#traceModal");
      if (!modal) return;

      var serial = params.get("trace") || "BND-260826-304";
      var heat = params.get("heat") || "HT-260826-09";
      var mat = params.get("mat") || "10.60 x 1600mm Gr-A";
      var wt = params.get("wt") || "214.60";
      var disp = params.get("disp") || "ACCEPTED";
      var date = params.get("date") || "2026-08-26 / Shift-A";

      var cSer = $("#certSerial"); if (cSer) cSer.textContent = serial;
      var cHeat = $("#certHeat"); if (cHeat) cHeat.textContent = heat;
      var cMat = $("#certMat"); if (cMat) cMat.textContent = mat;
      var cWeight = $("#certWeight"); if (cWeight) cWeight.textContent = wt + " kg";
      var cDate = $("#certDate"); if (cDate) cDate.textContent = date;
      var cStatus = $("#certStatus"); if (cStatus) cStatus.textContent = disp + " (RELEASED)";

      setTimeout(function () {
        if (typeof modal.showModal === "function") modal.showModal();
        else modal.setAttribute("open", "");
        audio.play("scan");
      }, 450);
    }

    var closeBtn = $("#closeTraceModal");
    var closeAck = $("#closeTraceBtn");
    var modalEl = $("#traceModal");
    function closeTrace() {
      if (!modalEl) return;
      if (typeof modalEl.close === "function") modalEl.close();
      else modalEl.removeAttribute("open");
      audio.play("click");
    }
    on(closeBtn, "click", closeTrace);
    on(closeAck, "click", closeTrace);
    on(modalEl, "click", function (e) { if (e.target === modalEl) closeTrace(); });
  })();

  /* ---------- FEATURE 5: DEVELOPER COMMAND PALETTE (CTRL + K) ---------- */
  (function cmdPalette() {
    var modal = $("#cmdPaletteModal");
    var input = $("#cmdInput");
    var list = $("#cmdResultsList");
    var btnTrigger = $("#cmdPaletteBtn");

    var commands = [
      { id: "rims", title: "Flagship System: NHK_RIMS", tag: "PROJECT", icon: "🚀", action: function () { window.location.hash = "nhk-rims"; } },
      { id: "cpk", title: "Interactive Six-Sigma Cpk Lab", tag: "LAB", icon: "📊", action: function () { window.location.hash = "cpk-lab"; } },
      { id: "zpl", title: "Zebra ZPL Label Studio", tag: "HARDWARE", icon: "🏷️", action: function () { window.location.hash = "zpl-designer"; } },
      { id: "spc", title: "Live SPC Telemetry Streamer", tag: "TELEMETRY", icon: "📈", action: function () { window.location.hash = "spc-streamer"; } },
      { id: "yt", title: "NV AI Studio (@nvaistudio)", tag: "YOUTUBE", icon: "🎬", action: function () { window.location.hash = "media"; } },
      { id: "resume", title: "Inspect Interactive CV Modal", tag: "CAREER", icon: "📄", action: function () { var rm = $("#resumeModal"); if (rm) rm.showModal(); } },
      { id: "pdf", title: "Download Official Resume PDF", tag: "DOWNLOAD", icon: "↓", action: function () { window.open("nikhil_vashisht_resume.pdf", "_blank"); } },
      { id: "email", title: "Copy Direct Email Address", tag: "CONTACT", icon: "📋", action: function () { if (navigator.clipboard) { navigator.clipboard.writeText("nishantvashisht8@gmail.com"); showToast("✓ Email copied to clipboard: nishantvashisht8@gmail.com"); } } },
      { id: "audio-prof-minimal", title: "Sound Profile: Minimalist Tactile (Apple/Linear Style)", tag: "AUDIO PROFILE", icon: "🍏", action: function () { audio.setProfile("minimal"); showToast("✓ Audio Profile: Minimalist Tactile activated!"); } },
      { id: "audio-prof-industrial", title: "Sound Profile: Industrial Hardware (Plant Relays & Lasers)", tag: "AUDIO PROFILE", icon: "🏭", action: function () { audio.setProfile("industrial"); showToast("✓ Audio Profile: Industrial Hardware activated!"); } },
      { id: "audio-prof-cyberpunk", title: "Sound Profile: Cyberpunk Sci-Fi (Synthesizer Chimes)", tag: "AUDIO PROFILE", icon: "🌆", action: function () { audio.setProfile("cyberpunk"); showToast("✓ Audio Profile: Cyberpunk Sci-Fi activated!"); } },
      { id: "audio-prof-arcade", title: "Sound Profile: 8-Bit Retro Arcade (Square Wave Blips)", tag: "AUDIO PROFILE", icon: "👾", action: function () { audio.setProfile("arcade"); showToast("✓ Audio Profile: 8-Bit Retro Arcade activated!"); } },
      { id: "sound-test-click", title: "Test Sound: Button Click FX", tag: "SOUND TEST", icon: "🎵", action: function () { audio.play("click"); } },
      { id: "sound-test-scan", title: "Test Sound: Laser Barcode Scan FX", tag: "SOUND TEST", icon: "⚡", action: function () { audio.play("scan"); } },
      { id: "sound-test-alert", title: "Test Sound: Warning Defect Alarm FX", tag: "SOUND TEST", icon: "🚨", action: function () { audio.play("alert"); } },
      { id: "spike", title: "Trigger Outlier Spike Test in SPC", tag: "SIMULATION", icon: "⚡", action: function () { if (window.triggerSpcSpike) window.triggerSpcSpike(); showToast("⚡ Injected shop-floor outlier spike into SPC chart!"); } },
      { id: "theme", title: "Toggle Dark / Light Theme", tag: "UI", icon: "🌓", action: function () { var tt = $("#themeToggle"); if (tt) tt.click(); } },
      { id: "audio", title: "Toggle Tactile Audio Sound FX (ON / OFF)", tag: "AUDIO", icon: "🔊", action: function () { var at = $("#audioToggle"); if (at) at.click(); } },
      { id: "github", title: "Visit GitHub Profile (@Nikkured)", tag: "EXTERNAL", icon: "🐙", action: function () { window.open("https://github.com/Nikkured", "_blank"); } }
    ];

    var selectedIdx = 0;
    var filtered = commands.slice();

    function renderList() {
      if (!list) return;
      list.innerHTML = "";
      if (filtered.length === 0) {
        list.innerHTML = '<div style="padding:16px; text-align:center; color:var(--text-muted); font-size:13px;">No matching commands found</div>';
        return;
      }

      filtered.forEach(function (cmd, idx) {
        var el = document.createElement("div");
        el.className = "cmd-item" + (idx === selectedIdx ? " is-selected" : "");
        el.innerHTML = '<div class="cmd-item-left"><span class="cmd-item-icon">' + cmd.icon + '</span><span class="cmd-item-title">' + cmd.title + '</span></div><span class="cmd-item-tag">' + cmd.tag + '</span>';
        on(el, "click", function () {
          execute(cmd);
        });
        list.appendChild(el);
      });
    }

    function execute(cmd) {
      audio.play("scan");
      close();
      if (cmd && typeof cmd.action === "function") {
        cmd.action();
      }
    }

    function open() {
      audio.play("click");
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      if (input) {
        input.value = "";
        input.focus();
      }
      filtered = commands.slice();
      selectedIdx = 0;
      renderList();
    }

    function close() {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    }

    on(btnTrigger, "click", open);

    on(window, "keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (modal.hasAttribute("open")) close();
        else open();
      }
      if (modal.hasAttribute("open")) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedIdx = (selectedIdx + 1) % filtered.length;
          renderList();
          audio.play("click");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedIdx = (selectedIdx - 1 + filtered.length) % filtered.length;
          renderList();
          audio.play("click");
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filtered[selectedIdx]) execute(filtered[selectedIdx]);
        }
      }
    });

    on(input, "input", function () {
      var q = input.value.toLowerCase().trim();
      filtered = commands.filter(function (c) {
        return c.title.toLowerCase().indexOf(q) !== -1 || c.tag.toLowerCase().indexOf(q) !== -1;
      });
      selectedIdx = 0;
      renderList();
    });

    on(modal, "click", function (e) {
      if (e.target === modal) close();
    });
  })();

  /* ---------- FEATURE 6: INTERACTIVE VIDEO SHOWCASE THEATER MODAL ---------- */
  (function videoTheater() {
    var modal = $("#videoModal");
    var triggers = $$(".js-video-trigger");
    var closeBtn = $("#closeVideoModal");
    var closeFooter = $("#closeVideoModalBtn");
    var banner = $("#videoScreenBanner");

    var vTitle = $("#videoModalTitle");
    var vDesc = $("#videoModalDesc");
    var vChapters = $("#videoModalChapters");
    var vLink = $("#videoModalYtLink");

    var videos = {
      "python-automation": {
        title: "Automating Engineering Reports with Python & SQLite",
        desc: "A hands-on breakdown demonstrating how to eliminate 4+ hours of manual inspection data collation daily. Shows how to structure offline SQLite tables, write automated pandas data transformations, and generate executive Pareto summaries with single-click Python scripts.",
        chapters: [
          { ts: "00:00", label: "Introduction to Shop-Floor Data Bottlenecks" },
          { ts: "02:15", label: "Designing SQLite Relational Ledger Schema" },
          { ts: "05:30", label: "Building the Automated Python Aggregation Pipeline" },
          { ts: "08:40", label: "Exporting Auto-Formatted Excel Reports with VBA" }
        ],
        url: "https://www.youtube.com/@nvaistudio"
      },
      "ai-workflows": {
        title: "Next-Gen AI Tools & Workflow Automation Breakdown",
        desc: "In-depth review and tutorial analyzing modern AI coding agents, autonomous terminal workflows, and local LLM toolsets for software developers and manufacturing automation engineers.",
        chapters: [
          { ts: "00:00", label: "State of Modern AI Engineering Tools" },
          { ts: "01:50", label: "Autonomous Coding Agents vs Static Completion" },
          { ts: "04:30", label: "Hands-On Refactoring with Terminal Integration" },
          { ts: "07:10", label: "Productivity Best Practices & Setup Guide" }
        ],
        url: "https://www.youtube.com/@nvaistudio"
      }
    };

    var currentVideo = videos["python-automation"];

    function open(key) {
      audio.play("click");
      var data = videos[key] || videos["python-automation"];
      currentVideo = data;

      if (vTitle) vTitle.textContent = data.title;
      if (vDesc) vDesc.textContent = data.desc;
      if (vLink) vLink.href = data.url;

      if (vChapters) {
        vChapters.innerHTML = "";
        data.chapters.forEach(function (ch) {
          var li = document.createElement("li");
          li.innerHTML = '<span class="ts">' + ch.ts + '</span><span>' + ch.label + '</span>';
          vChapters.appendChild(li);
        });
      }

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    }

    function close() {
      audio.play("click");
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    }

    triggers.forEach(function (card) {
      on(card, "click", function () {
        var key = card.getAttribute("data-video");
        open(key);
      });
      on(card, "keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var key = card.getAttribute("data-video");
          open(key);
        }
      });
    });

    on(banner, "click", function () {
      audio.play("scan");
      window.open(currentVideo.url, "_blank");
    });

    on(closeBtn, "click", close);
    on(closeFooter, "click", close);
    on(modal, "click", function (e) {
      if (e.target === modal) close();
    });
  })();

  /* ---------- QR Scanner Mini Simulator ---------- */
  (function qrSimulator() {
    var scenarioBtns = $$(".btn-scenario");
    var runBtn = $("#runQrScanBtn");
    var resultBox = $("#qrResultBox");
    var icon = $("#qrIcon");
    var txt = $("#qrStateText");
    var desc = $("#qrStateDesc");

    var activeScenario = "ok";

    var states = {
      ok: { state: "ok", icon: "✓", text: "VALID — ACCEPT", desc: "Label matches the expected rule set. Accept unit." },
      duplicate: { state: "duplicate", icon: "!", text: "DUPLICATE — HOLD", desc: "This barcode was already logged in current shift." },
      ng: { state: "ng", icon: "✕", text: "NG — REJECT", desc: "ASN checksum mismatch. Segregate immediately." }
    };

    scenarioBtns.forEach(function (btn) {
      on(btn, "click", function () {
        audio.play("click");
        scenarioBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        activeScenario = btn.getAttribute("data-scenario") || "ok";
      });
    });

    on(runBtn, "click", function () {
      audio.play("scan");
      if (!resultBox) return;
      resultBox.style.opacity = "0.5";
      runBtn.disabled = true;

      setTimeout(function () {
        var d = states[activeScenario] || states.ok;
        resultBox.setAttribute("data-state", d.state);
        if (icon) icon.textContent = d.icon;
        if (txt) txt.textContent = d.text;
        if (desc) desc.textContent = d.desc;
        resultBox.style.opacity = "1";
        runBtn.disabled = false;
        audio.play(d.state === "ok" ? "click" : "alert");
      }, 400);
    });
  })();

  /* ---------- Interactive Resume Modal ---------- */
  (function resumeModal() {
    var modal = $("#resumeModal");
    var triggers = $$(".js-resume-trigger");
    var closeBtn = $("#closeResumeModal");
    var closeFooterBtn = $("#closeResumeModalBtn");
    var tabs = $$(".resume-tab");
    var copyBtn = $("#copyResumeBtn");

    if (!modal) return;

    function openModal() {
      audio.play("click");
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    }

    function closeModal() {
      audio.play("click");
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    }

    triggers.forEach(function (btn) { on(btn, "click", openModal); });
    on(closeBtn, "click", closeModal);
    on(closeFooterBtn, "click", closeModal);

    on(modal, "click", function (e) {
      if (e.target === modal) closeModal();
    });
    on(document, "keydown", function (e) {
      if (e.key === "Escape" && modal.hasAttribute("open")) closeModal();
    });

    tabs.forEach(function (tab) {
      on(tab, "click", function () {
        audio.play("click");
        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        var targetTab = tab.getAttribute("data-tab");
        $$(".resume-tab-pane").forEach(function (pane) {
          pane.hidden = pane.id !== "tab-" + targetTab;
        });
      });
    });

    on(copyBtn, "click", function () {
      audio.play("scan");
      var resumeText = [
        "# Nikhil Vashisht — Quality Assurance Executive & Python Developer",
        "Email: nishantvashisht8@gmail.com | Phone: +91 88821 86438 | Profile: https://linktr.ee/nikku_red",
        "Location: Gurugram / Manesar, Haryana, India\n",
        "## Professional Summary",
        "Quality Assurance Executive & Python Developer with rich experience in automotive manufacturing, outbound logistics, statistical process control, quality documentation, and desktop process automation. Skilled in Cpk/Cpu/Cpl analysis, advanced Excel dashboards, Python scripting, SQLite, and Zebra ZPL label programming.\n",
        "## Professional Experience",
        "### Quality Assurance Executive — NHK Spring India Ltd.",
        "03/2025 — Present | Manesar, Gurugram",
        "- Manage SPC activities and analyse Cpk, Cpu and Cpl for manufacturing processes.",
        "- Monitor quality trends, inspection results, and process variation to identify recurring concerns.",
        "- Prepare and maintain test certificates, inspection reports, and traceability records.",
        "- Develop Excel dashboards for quality metrics, trend analysis, and management reporting.",
        "- Automate repetitive reporting and data-consolidation activities using Python.",
        "- Develop QR-code and Zebra ZPL solutions for document traceability and label printing.",
        "- Support quality audits, ISO compliance, root cause analysis (8D / 5-Why), and corrective actions.\n",
        "### Shift In-Charge – Outbound Logistics — Hero MotoCorp Ltd.",
        "2019 — 2024 | Gurugram",
        "- Managed shift operations in Outbound Logistics for finished vehicles.",
        "- Supervised supervisors, operators, drivers, and support staff during daily dispatch activities.",
        "- Planned manpower deployment according to dispatch volume and operational priorities.",
        "- Coordinated vehicle movement, loading readiness, vehicle placement, and dispatch sequencing.\n",
        "## Education",
        "- Bachelor of Computer Applications (BCA) — Dronacharya Government College, Gurugram",
        "- Senior Secondary Education (CBSE, First Division)",
        "- Secondary Education (HBSE, First Division)\n",
        "## Skills & Competencies",
        "- Quality Systems: SPC, Cpk/Cpu/Cpl, ISO Compliance, 8D Root Cause Analysis, Test Certificates, Traceability",
        "- Automation & Software: Python 3, Tkinter, PySide6, SQLite, Advanced Excel VBA, Zebra ZPL, SQL",
        "- Operations: Outbound Logistics, Shift & Manpower Planning, Dispatch Coordination"
      ].join("\n");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(resumeText).then(function () {
          showToast("✓ Resume summary copied to clipboard!");
        }).catch(function () {
          showToast("✓ Resume copied!");
        });
      } else {
        showToast("✓ Resume summary ready!");
      }
    });
  })();

  /* ---------- Razorpay Standard Web Checkout ---------- */
  (function razorpayCheckout() {
    var payBtn = $("#payRazorpayBtn");
    var customAmountInput = $("#rzpCustomAmount");
    var presetBtns = $$(".rzp-preset-btn");
    var statusEl = $("#rzpStatusMessage");

    if (!payBtn) return;

    presetBtns.forEach(function (btn) {
      on(btn, "click", function () {
        audio.play("click");
        presetBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.style.background = "rgba(255,255,255,0.06)";
          b.style.color = "var(--text-primary)";
        });
        btn.classList.add("is-active");
        btn.style.background = "var(--accent)";
        btn.style.color = "#fff";

        var amt = btn.getAttribute("data-amount");
        if (customAmountInput) customAmountInput.value = amt;
      });
    });

    function showStatus(msg, isSuccess) {
      if (!statusEl) return;
      statusEl.style.display = "block";
      statusEl.style.color = isSuccess ? "#34d399" : "#f87171";
      statusEl.style.padding = "8px 10px";
      statusEl.style.borderRadius = "6px";
      statusEl.style.background = isSuccess ? "rgba(52, 211, 153, 0.12)" : "rgba(248, 113, 113, 0.12)";
      statusEl.style.border = "1px solid " + (isSuccess ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)");
      statusEl.innerHTML = msg;
    }

    on(payBtn, "click", async function () {
      audio.play("click");
      if (statusEl) statusEl.style.display = "none";

      var inrAmount = customAmountInput ? parseFloat(customAmountInput.value) : 500;
      var paiseAmount = Math.round(inrAmount * 100);

      if (isNaN(paiseAmount) || paiseAmount < 100) {
        showStatus("⚠️ Minimum payment amount is ₹1 (100 paise)", false);
        return;
      }

      payBtn.disabled = true;
      payBtn.innerHTML = "<span>Processing Order...</span>";

      try {
        // STEP 1: BACKEND - Create Order
        var orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: paiseAmount,
            currency: "INR",
            receipt: "rcpt_" + Date.now()
          })
        });

        var orderData = await orderRes.json();

        if (!orderRes.ok) {
          throw new Error(orderData.error || orderData.message || "Failed to create order");
        }

        var keyId = "rzp_test_TVtsyencqj0YUu";

        // STEP 2: FRONTEND - Open Razorpay Modal
        var options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Nikhil Vashisht Portfolio",
          description: "Payment / Service Retainer",
          order_id: orderData.order_id,
          handler: async function (response) {
            // STEP 3: BACKEND - Verify Payment Signature
            try {
              var verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              var verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                audio.play("scan");
                showStatus("✅ Payment Verified & Completed!<br><small>Payment ID: " + response.razorpay_payment_id + "</small>", true);
              } else {
                audio.play("alert");
                showStatus("❌ Signature Verification Failed: " + (verifyData.message || "Invalid signature"), false);
              }
            } catch (vErr) {
              audio.play("alert");
              showStatus("❌ Verification endpoint error", false);
            } finally {
              payBtn.disabled = false;
              payBtn.innerHTML = "<span>Pay with Razorpay</span> <i aria-hidden='true'>🛡️</i>";
            }
          },
          modal: {
            ondismiss: function () {
              payBtn.disabled = false;
              payBtn.innerHTML = "<span>Pay with Razorpay</span> <i aria-hidden='true'>🛡️</i>";
              showStatus("ℹ️ Payment cancelled by user.", false);
            }
          },
          theme: { color: "#6366f1" }
        };

        if (window.Razorpay) {
          var rzp = new window.Razorpay(options);
          rzp.on("payment.failed", function (resp) {
            audio.play("alert");
            showStatus("❌ Payment Failed: " + (resp.error.description || "Transaction failed"), false);
            payBtn.disabled = false;
            payBtn.innerHTML = "<span>Pay with Razorpay</span> <i aria-hidden='true'>🛡️</i>";
          });
          rzp.open();
        } else {
          throw new Error("Razorpay SDK script not loaded.");
        }
      } catch (err) {
        audio.play("alert");
        showStatus("❌ " + (err.message || "Checkout error"), false);
        payBtn.disabled = false;
        payBtn.innerHTML = "<span>Pay with Razorpay</span> <i aria-hidden='true'>🛡️</i>";
      }
    });
  })();

  /* ---------- Footer Year ---------- */
  (function footerYear() {
    var el = $("#footerYear");
    if (el) el.textContent = String(new Date().getFullYear());
  })();

})();
