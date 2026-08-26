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

  /* ---------- Audio Feedback Engine (Web Audio API) ---------- */
  var audio = (function () {
    var ctx = null;
    var enabled = store.get("nv-audio") === "on";
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

    function play(type) {
      if (!enabled) return;
      initCtx();
      if (!ctx) return;

      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      var now = ctx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "scan") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(980, now + 0.12);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(180, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "toggle") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    }

    return { play: play };
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
        // Smooth cubic out
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

        // Mouse attraction
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

        // Connect lines
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
    var ucl = target + 3 * sigma; // 10.45
    var lcl = target - 3 * sigma; // 9.55

    var maxPoints = 26;
    var data = [];
    var stepCount = 0;

    // Pre-populate data
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

      // Draw UCL / LCL / Centerline
      var yUCL = getY(ucl);
      var yLCL = getY(lcl);
      var yCL = getY(target);

      // Lines
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(244, 63, 94, 0.5)"; // UCL
      ctx.beginPath(); ctx.moveTo(padX, yUCL); ctx.lineTo(w - padX, yUCL); ctx.stroke();

      ctx.strokeStyle = "rgba(244, 63, 94, 0.5)"; // LCL
      ctx.beginPath(); ctx.moveTo(padX, yLCL); ctx.lineTo(w - padX, yLCL); ctx.stroke();

      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"; // Target
      ctx.beginPath(); ctx.moveTo(padX, yCL); ctx.lineTo(w - padX, yCL); ctx.stroke();
      ctx.setLineDash([]);

      // Plot data line
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

      // Plot points & checks
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
    var toast = $("#toastNotification");

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
