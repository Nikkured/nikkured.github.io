# Nikhil Vashisht — Portfolio Redesign · Deliverables

Live preview: `/portfolio/index.html`
Files: `index.html`, `styles.css`, `script.js` (static, no build system, no dependencies).

---

## 1. Audit summary (Keep / Improve / Remove)

**KEEP**
- Strong domain content (RIMS, QR, Dashboard, SQL cases) and the "process-first" positioning.
- Working feature set: mobile nav, active-section state, reading progress, dark/light theme, reduced-motion, RIMS explorer, QR interaction, dashboard, email/Linktree.
- Concept-visual labelling and confidentiality discipline.

**IMPROVE**
- **Metadata:** canonical now points to `https://nikkured.github.io/` (previous `nikhilvashisht.in` domain is not purchased). Added OG/Twitter tags + Person JSON-LD.
- **Progressive enhancement:** all reveal/hero states now default to *visible*; motion is gated behind an `html.anim` class added by JS, so content is fully readable if JS or animation fails.
- **Reliability:** removed `scroll-behavior:smooth` from `html` (it broke initial hash scrolling); smooth scroll for in-page links is handled defensively in JS with a fixed-header offset and focus management.
- **Typography:** editorial pairing — Fraunces (display), Archivo (UI), IBM Plex Mono (technical labels).
- **Layout:** added header nav + section labels/kickers that were missing; asymmetric grids, sticky editorial asides, audit-stamp motifs.
- **Mobile:** fixed a 375px horizontal-overflow (mono `<pre>` forcing grid tracks) via `min-width:0` on grid/flex children + `overflow-x:hidden` containment.

**REMOVE**
- The unpurchased-domain canonical.
- Any load-time keyframe reveals that could "stick" mid-animation (replaced with transition-to-visible end states).
- No Lenis / heavy libraries — kept fully vanilla per brief (no scroll hijacking).

### Technical QA of original concerns
- **JS runtime risks:** all modules wrapped in IIFEs with null-guards; every `getElementById`/`querySelector` is checked before use.
- **Duplicate listeners:** each control bound once inside its module.
- **localStorage:** wrapped in try/catch (`store.get/set`).
- **IntersectionObserver:** fallback marks everything visible if unsupported or reduced-motion.
- **Metadata:** corrected canonical; single `<h1>`.

---

## 2. Creative concept & rationale
**"Control room, set in an editorial page."** Dark charcoal foundation, warm industrial **amber** for actions/controls, controlled **cyan** for validation/data signals. Grid overlays, trace lines, audit stamps and technical labels evoke a monitored process; large Fraunces headlines keep it editorial, not SaaS. Motion is *few and meaningful* — it explains process or gives feedback, never decorates.

## 3. Information architecture
Hero → Process First (manifesto) → About (narrative) → Experience (operating context) → Selected Systems (RIMS deep case + QR deep case + Dashboard deep case + compact SQL case) → Capabilities (control stack) → Decision Simulator (revisit value) → Services → Contact → Footer.

**Recruiter View** (header/menu toggle, states: *Recruiter view* ⟷ *Full experience*): a simplified reading of the *same* page (not a separate site). It keeps the professional summary, experience, core capabilities, selected case studies and the email/Linktree contact, and hides the decision simulator and freelance services. The full experience is the default; the choice persists via safe localStorage and is announced to assistive tech via an `aria-live` status.

## 4. Design token system (CSS variables)
Colours: `--bg #0b0e13`, `--panel`, `--ink/--ink-soft/--ink-mute`, `--amber #ffb13b`, `--cyan #63dce5`, `--ok`, `--ng`. Light theme overrides the same tokens (off-white `#f1eee7`, darker amber/cyan for AA contrast). Type: `--ff-display/--ff-sans/--ff-mono`. Radius, shell width, spacing (`--pad` fluid clamp), easing `--ease`, shadow.

## 5. Motion & interaction map
- **Interactive Telemetry Canvas:** Floating particle and circuit trace mesh in the hero that reacts dynamically to cursor movements and window dimensions.
- **Dynamic Specular Spotlight & 3D Card Tilt:** Pointer-tracking radial glow (`--mouse-x`, `--mouse-y`) and smooth 3D perspective spring tilt on cards, systems panels, and telemetry boxes.
- **Real-Time Live SPC Waveform Streamer:** Interactive statistical process control chart simulating live sampling, dynamic control limits ($UCL$, $\bar{X}$, $LCL$), and disturbance injections (Stable, Mean Drift, Tool Wear Trend, Outlier Spike) with real-time rule detection.
- **Interactive 1-Click Resume Modal:** Modal dialog with accessible focus trapping, section tabs (Executive Summary, Quality & Automation Toolkit, Career Path), 1-click Markdown CV copy with toast notification, and print/PDF trigger.
- **Key Operational Telemetry Counters:** Smooth numerical roll-ups triggered via `IntersectionObserver` when entering the viewport.
- **Tactile Audio Feedback:** Web Audio API sound synthesizer for clicks, scans, and alert tones (disabled by default with an interactive header toggle and localStorage persistence).
- **RIMS Traceability Atlas:** Tab/card driven state (panel text, active node, route length, pulse) with full keyboard navigation.
- **QR Validation Console:** Scenario segmented control + laser scan line + audio feedback + decision states (OK/Duplicate/NG) + session log.
- **Rejection Dashboard:** Animated Pareto bar transitions on view change + RCA re-ordering.
- **Decision Simulator:** 4-round disposition scenarios demonstrating quality engineering reasoning with instant feedback and scoreboard.
- All motion and audio respect `prefers-reduced-motion` and user privacy (zero tracking, zero external dependencies).

## 9. QA checklist (verified)
- No horizontal overflow at 375/430/768/1024/1440 (measured scrollWidth == innerWidth).
- One `<h1>`, semantic landmarks, skip link, `:focus-visible`.
- Keyboard-operable atlas/QR/dashboard/simulator; 44px targets.
- Mobile nav closes via link, outside tap, Escape, desktop resize.
- Theme persists via safe localStorage; reduced-motion keeps all content visible.
- Sticky asides work; no console errors; contact email + Linktree wrap safely.

---

## 10. Replace the files on GitHub Pages

Your site is the GitHub **user site** `nikkured/nikkured.github.io`, deployed from the **repository root** on the **`main`** branch. Keep the three files in the root — `index.html` links to `styles.css` and `script.js` by relative path. No build step, no other files needed.

**Option A — GitHub web UI (easiest)**
1. Open `https://github.com/nikkured/nikkured.github.io` and make sure you are on the **`main`** branch.
2. For each of `index.html`, `styles.css`, `script.js`: open the file → pencil (**Edit**) → select-all → paste the new contents → **Commit changes** directly to `main`.
3. For a file that does not exist yet, use **Add file → Create new file**, name it exactly (`styles.css` / `script.js`), paste, and commit to `main`.
4. Wait ~1 minute for Pages to rebuild, then hard-refresh `https://nikkured.github.io/`.

**Option B — Git command line**
```bash
git clone https://github.com/nikkured/nikkured.github.io.git
cd nikkured.github.io
git checkout main
# copy the three new files into the repo ROOT, overwriting the old ones
cp /path/to/index.html /path/to/styles.css /path/to/script.js .
git add index.html styles.css script.js
git commit -m "Redesign: control-room editorial portfolio + recruiter view"
git push origin main
```

**Verify GitHub Pages settings** (once): repo **Settings → Pages** → Source = *Deploy from a branch*, Branch = **`main`**, Folder = **`/ (root)`**.

> Note: the canonical URL is set to `https://nikkured.github.io/`. When you buy and connect `nikhilvashisht.in`, update the `<link rel="canonical">` and the Open Graph `og:url` in `index.html`.
