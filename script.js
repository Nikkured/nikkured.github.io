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

  /* ---------- NHK_RIMS Interactive Pipeline Stepper ---------- */
  (function rimsStepper() {
    var tabs = $$(".stepper-tab");
    var stages = [
      {
        eyebrow: "01 // RECEIPT CONTROL",
        headline: "Source captured before inventory is created",
        ref: "RCV-260805-014",
        material: "10.60 × 1600 · Grade A",
        state: "SOURCE LINKED",
        control: "A material balance cannot exist without an authentic supplier heat number and recorded weight."
      },
      {
        eyebrow: "02 // BUNDLE IDENTITY",
        headline: "Physical bundle bound to traceable serial",
        ref: "BND-260805-031",
        material: "Weight 214.6 kg (verified)",
        state: "TAG GENERATED",
        control: "Every bundle receives a unique barcode identity tied directly to its parent receipt ledger."
      },
      {
        eyebrow: "03 // FIFO RECOMMENDATION",
        headline: "Oldest eligible material is surfaced first",
        ref: "FIFO-Q-118",
        material: "3 eligible lots · match OK",
        state: "FIFO PRIORITY",
        control: "Algorithmic allocation prevents material aging and enforces strict FIFO compliance across shifts."
      },
      {
        eyebrow: "04 // PRODUCTION CONSUMPTION",
        headline: "Stock deducted strictly upon production record",
        ref: "CON-260806-007",
        material: "820 pcs · theo. wt applied",
        state: "BALANCE DEDUCTED",
        control: "Inventory decrements only through authorized shop-floor transactions with full backward traceability."
      },
      {
        eyebrow: "05 // AUDIT & REVERSALS",
        headline: "Corrections recorded as immutable ledger adjustments",
        ref: "ADJ-260806-002",
        material: "Reversal +4.2 kg (weighing adj)",
        state: "AUDIT LOGGED",
        control: "Silent balance overrides are prohibited; all adjustments log user, reason, and previous state."
      }
    ];

    tabs.forEach(function (tab) {
      on(tab, "click", function () {
        audio.play("click");
        var idx = parseInt(tab.getAttribute("data-stage"), 10) || 0;
        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        var data = stages[idx];
        if (!data) return;

        var eb = $("#rimsEyebrow"); if (eb) eb.textContent = data.eyebrow;
        var hl = $("#rimsHeadline"); if (hl) hl.textContent = data.headline;
        var rf = $("#rimsRef"); if (rf) rf.textContent = data.ref;
        var mt = $("#rimsMaterial"); if (mt) mt.textContent = data.material;
        var st = $("#rimsState"); if (st) st.textContent = data.state;
        var ct = $("#rimsControlText"); if (ct) ct.textContent = data.control;
      });
    });
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
       AUTHENTIC QR CODE GENERATOR (ISO/IEC 18004 STANDARD)
       ========================================================================= */
    var QR = (function () {
      // GF(256) Math
      var EXP = new Uint8Array(512);
      var LOG = new Uint8Array(256);
      var v = 1;
      for (var i = 0; i < 255; i++) {
        EXP[i] = v;
        EXP[i + 255] = v;
        LOG[v] = i;
        v <<= 1;
        if (v & 256) v ^= 0x11d;
      }

      function gmul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP[LOG[a] + LOG[b]];
      }

      function polyMul(p1, p2) {
        var r = new Uint8Array(p1.length + p2.length - 1);
        for (var i = 0; i < p1.length; i++) {
          for (var j = 0; j < p2.length; j++) {
            r[i + j] ^= gmul(p1[i], p2[j]);
          }
        }
        return r;
      }

      function polyRest(dividend, divisor) {
        var res = new Uint8Array(dividend);
        for (var i = 0; i < dividend.length - divisor.length + 1; i++) {
          var coef = res[i];
          if (coef !== 0) {
            for (var j = 1; j < divisor.length; j++) {
              res[i + j] ^= gmul(divisor[j], coef);
            }
          }
        }
        return res.subarray(dividend.length - divisor.length + 1);
      }

      function rsGenPoly(n) {
        var g = new Uint8Array([1]);
        for (var i = 0; i < n; i++) {
          g = polyMul(g, new Uint8Array([1, EXP[i]]));
        }
        return g;
      }

      // Version specs (Capacity & EC Codewords for Level M)
      // V2-M: size 25, 28 data bytes, 16 EC bytes
      // V3-M: size 29, 44 data bytes, 26 EC bytes
      // V4-M: size 33, 64 data bytes, 36 EC bytes
      // V5-M: size 37, 86 data bytes, 48 EC bytes
      function getVersion(len) {
        if (len <= 26) return { ver: 2, size: 25, dataBytes: 28, ecBytes: 16, align: [6, 18] };
        if (len <= 42) return { ver: 3, size: 29, dataBytes: 44, ecBytes: 26, align: [6, 22] };
        if (len <= 62) return { ver: 4, size: 33, dataBytes: 64, ecBytes: 36, align: [6, 26] };
        return { ver: 5, size: 37, dataBytes: 86, ecBytes: 48, align: [6, 30] };
      }

      function encode(text) {
        var utf8 = [];
        for (var i = 0; i < text.length; i++) {
          var c = text.charCodeAt(i);
          if (c < 128) utf8.push(c);
          else if (c < 2048) { utf8.push(192 | (c >> 6)); utf8.push(128 | (c & 63)); }
          else { utf8.push(224 | (c >> 12)); utf8.push(128 | ((c >> 6) & 63)); utf8.push(128 | (c & 63)); }
        }

        var spec = getVersion(utf8.length);
        var bits = [];
        function pushBits(val, len) {
          for (var b = len - 1; b >= 0; b--) {
            bits.push((val >> b) & 1);
          }
        }

        // Byte Mode (0100)
        pushBits(4, 4);
        pushBits(utf8.length, 8);
        for (var k = 0; k < utf8.length; k++) {
          pushBits(utf8[k], 8);
        }

        // Terminator (up to 4 zeroes)
        var totalDataBits = spec.dataBytes * 8;
        var diff = totalDataBits - bits.length;
        if (diff > 0) pushBits(0, Math.min(4, diff));

        // Pad to byte
        while (bits.length % 8 !== 0) bits.push(0);

        // Pad bytes (0xEC, 0x11)
        var padToggle = 0xEC;
        while (bits.length < totalDataBits) {
          pushBits(padToggle, 8);
          padToggle = (padToggle === 0xEC) ? 0x11 : 0xEC;
        }

        // Convert data bits to bytes
        var dataBytes = new Uint8Array(spec.dataBytes);
        for (var d = 0; d < spec.dataBytes; d++) {
          var byteVal = 0;
          for (var bit = 0; bit < 8; bit++) {
            byteVal = (byteVal << 1) | bits[d * 8 + bit];
          }
          dataBytes[d] = byteVal;
        }

        // Reed-Solomon Error Correction computation
        var gen = rsGenPoly(spec.ecBytes);
        var paddedData = new Uint8Array(spec.dataBytes + spec.ecBytes);
        paddedData.set(dataBytes);
        var ecBytes = polyRest(paddedData, gen);

        // Combined codeword stream
        var allBytes = new Uint8Array(spec.dataBytes + spec.ecBytes);
        allBytes.set(dataBytes);
        allBytes.set(ecBytes, spec.dataBytes);

        // Create Grid Matrix
        var size = spec.size;
        var matrix = [];
        var isReserved = [];
        for (var r = 0; r < size; r++) {
          matrix[r] = new Uint8Array(size);
          isReserved[r] = new Uint8Array(size);
        }

        // Place Finder Patterns
        function setFinder(row, col) {
          for (var y = -1; y <= 7; y++) {
            for (var x = -1; x <= 7; x++) {
              var pr = row + y;
              var pc = col + x;
              if (pr >= 0 && pr < size && pc >= 0 && pc < size) {
                var isDark = (y >= 0 && y <= 6 && (x === 0 || x === 6)) ||
                             (x >= 0 && x <= 6 && (y === 0 || y === 6)) ||
                             (y >= 2 && y <= 4 && x >= 2 && x <= 4);
                matrix[pr][pc] = isDark ? 1 : 0;
                isReserved[pr][pc] = 1;
              }
            }
          }
        }
        setFinder(0, 0);
        setFinder(0, size - 7);
        setFinder(size - 7, 0);

        // Place Alignment Patterns
        if (spec.align && spec.align.length > 1) {
          for (var a1 = 0; a1 < spec.align.length; a1++) {
            for (var a2 = 0; a2 < spec.align.length; a2++) {
              var ar = spec.align[a1];
              var ac = spec.align[a2];
              if (isReserved[ar][ac]) continue;
              for (var ay = -2; ay <= 2; ay++) {
                for (var ax = -2; ax <= 2; ax++) {
                  var isAlignDark = (Math.abs(ay) === 2 || Math.abs(ax) === 2 || (ay === 0 && ax === 0));
                  matrix[ar + ay][ac + ax] = isAlignDark ? 1 : 0;
                  isReserved[ar + ay][ac + ax] = 1;
                }
              }
            }
          }
        }

        // Place Timing Patterns
        for (var t = 8; t < size - 8; t++) {
          var tVal = (t % 2 === 0) ? 1 : 0;
          if (!isReserved[6][t]) { matrix[6][t] = tVal; isReserved[6][t] = 1; }
          if (!isReserved[t][6]) { matrix[t][6] = tVal; isReserved[t][6] = 1; }
        }

        // Dark module
        matrix[4 * spec.ver + 9][8] = 1;
        isReserved[4 * spec.ver + 9][8] = 1;

        // Reserve Format Info areas
        for (var f = 0; f < 9; f++) {
          if (f < size) { isReserved[8][f] = 1; isReserved[f][8] = 1; }
        }
        for (var f2 = 0; f2 < 8; f2++) {
          isReserved[8][size - 1 - f2] = 1;
          isReserved[size - 1 - f2][8] = 1;
        }

        // Write Codeword Data into Matrix (Zig-Zag upward/downward)
        var bitIndex = 0;
        var totalCodewordBits = allBytes.length * 8;
        var dir = -1;
        var colIdx = size - 1;

        while (colIdx > 0) {
          if (colIdx === 6) colIdx--; // Skip vertical timing column
          var rowIdx = (dir === -1) ? size - 1 : 0;
          while (rowIdx >= 0 && rowIdx < size) {
            for (var cStep = 0; cStep < 2; cStep++) {
              var currCol = colIdx - cStep;
              if (!isReserved[rowIdx][currCol]) {
                var bitToPlace = 0;
                if (bitIndex < totalCodewordBits) {
                  var bByte = Math.floor(bitIndex / 8);
                  var bBit = 7 - (bitIndex % 8);
                  bitToPlace = (allBytes[bByte] >> bBit) & 1;
                  bitIndex++;
                }
                // Mask Pattern 000: (row + col) % 2 == 0
                if ((rowIdx + currCol) % 2 === 0) {
                  bitToPlace ^= 1;
                }
                matrix[rowIdx][currCol] = bitToPlace;
              }
            }
            rowIdx += dir;
          }
          dir = -dir;
          colIdx -= 2;
        }

        // Format Info (Level M + Mask 000 = 101010000010010)
        var fmtBits = 0x5412; // 0101010000010010 with 0x5412 XOR mask = 0x0000 -> 0x5412
        for (var fb = 0; fb < 15; fb++) {
          var fbVal = (fmtBits >> fb) & 1;
          // Around top-left
          if (fb < 6) matrix[fb][8] = fbVal;
          else if (fb < 8) matrix[fb + 1][8] = fbVal;
          else matrix[8][14 - fb] = fbVal;

          // Around bottom-left and top-right
          if (fb < 8) matrix[8][size - 1 - fb] = fbVal;
          else matrix[size - 15 + fb][8] = fbVal;
        }

        return { matrix: matrix, size: size };
      }

      function draw(canvas, text) {
        if (!canvas) return;
        var qrData = encode(text);
        var ctx = canvas.getContext("2d");
        var size = qrData.size;
        var border = 4; // Standard 4-module quiet zone
        var totalDim = size + border * 2;

        var scale = Math.floor(canvas.width / totalDim);
        if (scale < 1) scale = 1;
        var realCanvasSize = totalDim * scale;
        canvas.width = realCanvasSize;
        canvas.height = realCanvasSize;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, realCanvasSize, realCanvasSize);

        ctx.fillStyle = "#0f172a";
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (qrData.matrix[r][c]) {
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

        var quiet = 12; // 12-module quiet zones
        var totalModules = modules.length + quiet * 2;
        var w = canvas.width = 340;
        var h = canvas.height = 48;
        var modWidth = w / totalModules;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#0f172a";
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

      // Realistic Human & Machine Scannable Payloads:
      // When scanned by phone camera, opens rich verifiable traceability payload
      var qrPayload = "NHK RIMS TRACEABILITY\nPart: " + pVal + "\nHeat: " + hVal + "\nSerial: " + serial + "\nWeight: " + wVal + "kg\nStatus: " + sVal + "\nQA: Nikhil Vashisht\nhttps://nikkured.github.io/";
      
      QR.draw(qrCanvas, qrPayload);
      Code128.draw(barCanvas, serial);
    }

    on(part, "input", update);
    on(heat, "input", update);
    on(weight, "input", update);
    on(status, "change", function () { update(); audio.play("click"); });
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

  /* ---------- Footer Year ---------- */
  (function footerYear() {
    var el = $("#footerYear");
    if (el) el.textContent = String(new Date().getFullYear());
  })();

})();
