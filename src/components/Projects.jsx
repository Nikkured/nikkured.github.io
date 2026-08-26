import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, CheckCircle, Database, ArrowRight, ShieldAlert } from 'lucide-react';

export const Projects = () => {
  // RIMS Interactive Stepper State
  const [activeStage, setActiveStage] = useState(0);
  const rimsStages = [
    {
      step: '01',
      title: 'Receive Control',
      eyebrow: '01 // RECEIPT CONTROL',
      headline: 'Source captured before inventory is created',
      ref: 'RCV-260805-014',
      material: '10.60 × 1600 · Grade A',
      state: 'SOURCE LINKED',
      control: 'A material balance cannot exist without an authentic supplier heat number and verified weight.',
    },
    {
      step: '02',
      title: 'Bundle Identity',
      eyebrow: '02 // BUNDLE IDENTITY',
      headline: 'Physical bundle bound to traceable serial',
      ref: 'BND-260805-031',
      material: 'Weight 214.6 kg (verified)',
      state: 'TAG GENERATED',
      control: 'Every bundle receives a unique barcode identity tied directly to its parent receipt ledger.',
    },
    {
      step: '03',
      title: 'FIFO Selection',
      eyebrow: '03 // FIFO RECOMMENDATION',
      headline: 'Oldest eligible material is surfaced first',
      ref: 'FIFO-Q-118',
      material: '3 eligible lots · match OK',
      state: 'FIFO PRIORITY',
      control: 'Algorithmic allocation prevents material aging and enforces strict FIFO compliance across shifts.',
    },
    {
      step: '04',
      title: 'Consumption',
      eyebrow: '04 // PRODUCTION CONSUMPTION',
      headline: 'Stock deducted strictly upon production record',
      ref: 'CON-260806-007',
      material: '820 pcs · theo. wt applied',
      state: 'BALANCE DEDUCTED',
      control: 'Inventory decrements only through authorized shop-floor transactions with full backward traceability.',
    },
    {
      step: '05',
      title: 'Audit Ledger',
      eyebrow: '05 // AUDIT & REVERSALS',
      headline: 'Corrections recorded as immutable ledger adjustments',
      ref: 'ADJ-260806-002',
      material: 'Reversal +4.2 kg (weighing adj)',
      state: 'AUDIT LOGGED',
      control: 'Silent balance overrides are prohibited; all adjustments log user, reason, and previous state.',
    },
  ];

  // SPC Waveform Streamer
  const canvasRef = useRef(null);
  const [spcMode, setSpcMode] = useState('normal');
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let target = 10.00;
    let sigma = 0.15;
    let ucl = target + 3 * sigma;
    let lcl = target - 3 * sigma;
    let maxPoints = 24;
    let data = Array.from({ length: maxPoints }, () => target + (Math.random() - 0.5) * 1.5 * sigma);
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      let val = target;
      if (spcMode === 'normal') {
        val = target + (Math.random() - 0.5) * 2 * sigma;
      } else if (spcMode === 'drift') {
        val = target + 1.5 * sigma + (Math.random() - 0.5) * 1.5 * sigma;
      } else if (spcMode === 'wear') {
        let trend = (stepCount % 12) * (sigma * 0.35);
        val = target - sigma + trend + (Math.random() - 0.5) * sigma;
      } else if (spcMode === 'spike') {
        val = target + (Math.random() > 0.5 ? 3.4 : -3.4) * sigma;
      }
      data.push(val);
      if (data.length > maxPoints) data.shift();

      // Render
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const padX = 25;
      const padY = 20;
      const plotW = w - padX * 2;
      const plotH = h - padY * 2;
      const minY = target - 4.5 * sigma;
      const maxY = target + 4.5 * sigma;

      const getY = (v) => padY + plotH - ((v - minY) / (maxY - minY)) * plotH;

      // Draw UCL / LCL / CL
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath(); ctx.moveTo(padX, getY(ucl)); ctx.lineTo(w - padX, getY(ucl)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(padX, getY(lcl)); ctx.lineTo(w - padX, getY(lcl)); ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.beginPath(); ctx.moveTo(padX, getY(target)); ctx.lineTo(w - padX, getY(target)); ctx.stroke();
      ctx.setLineDash([]);

      // Draw line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      const stepX = plotW / (maxPoints - 1);
      let breach = false;

      data.forEach((val, i) => {
        const px = padX + i * stepX;
        const py = getY(val);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Points
      data.forEach((val, i) => {
        const px = padX + i * stepX;
        const py = getY(val);
        const isOut = val > ucl || val < lcl;
        if (isOut) breach = true;

        ctx.beginPath();
        ctx.arc(px, py, isOut ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isOut ? '#f43f5e' : '#06b6d4';
        ctx.fill();
      });

      setIsBreached(breach);
    }, 1400);

    return () => clearInterval(interval);
  }, [spcMode]);

  // QR Mini Scanner Simulator
  const [qrScenario, setQrScenario] = useState('ok');
  const [qrResult, setQrResult] = useState({
    state: 'ok',
    text: 'VALID — ACCEPT',
    desc: 'Label matches the expected checksum and rule set.',
  });

  const triggerQrScan = () => {
    if (qrScenario === 'ok') {
      setQrResult({ state: 'ok', text: 'VALID — ACCEPT', desc: 'Label matches the expected checksum and rule set.' });
    } else if (qrScenario === 'duplicate') {
      setQrResult({ state: 'duplicate', text: 'DUPLICATE — HOLD', desc: 'This barcode was already logged in current shift.' });
    } else {
      setQrResult({ state: 'ng', text: 'NG — REJECT', desc: 'ASN checksum mismatch. Segregate immediately.' });
    }
  };

  return (
    <section className="py-24 relative z-10" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">
            03 // ENTERPRISE APPLICATIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Flagship Systems &amp; Live Telemetry.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Production-grade desktop software and real-time process monitoring engines engineered for zero defect escapes.
          </p>
        </div>

        {/* FLAGSHIP 1: NHK_RIMS */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-10 border-indigo-500/25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Info */}
            <div className="lg:col-span-6">
              <div className="font-mono text-xs font-bold tracking-widest text-indigo-400 mb-3">
                FLAGSHIP ENTERPRISE APPLICATION
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                NHK_RIMS — Raw Material Inventory &amp; Traceability System
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                A custom high-reliability desktop application engineered for automotive manufacturing. Tracks the complete lifecycle of steel raw materials: from supplier invoice receipt and physical bundle weighing, to FIFO age-priority lot allocation, production consumption, and immutable audit adjustments.
              </p>

              <div className="space-y-2.5 mb-8 text-sm text-slate-400">
                <div className="border-l-2 border-indigo-500 pl-3">
                  <strong className="text-slate-200">100% Offline Resilience:</strong> Zero dependency on cloud or internet; instant SQLite ACID transactions.
                </div>
                <div className="border-l-2 border-indigo-500 pl-3">
                  <strong className="text-slate-200">Physical FIFO Engine:</strong> Automated age-priority allocation eliminates material obsolescence.
                </div>
                <div className="border-l-2 border-indigo-500 pl-3">
                  <strong className="text-slate-200">Audit Ledger:</strong> All adjustments require operator authorization and reason logging.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Python 3', 'PySide6 / Tkinter', 'SQLite3', 'Zebra ZPL', 'Excel ETL'].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Process Pipeline */}
            <div className="lg:col-span-6 bg-[#04060a] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between font-mono text-xs text-slate-400 pb-3 mb-4 border-b border-white/10">
                <span>RIMS / TRACEABILITY PIPELINE</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE SIMULATION
                </span>
              </div>

              {/* Stepper Tabs */}
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-900/80 rounded-xl mb-5">
                {rimsStages.map((stage, idx) => (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className={`py-2 px-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                      activeStage === idx
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {stage.step} {stage.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Display Output */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5">
                <div className="font-mono text-[10px] text-indigo-400 tracking-wider">
                  {rimsStages[activeStage].eyebrow}
                </div>
                <h4 className="text-base font-bold text-white mt-1 mb-4">
                  {rimsStages[activeStage].headline}
                </h4>

                <div className="space-y-2 bg-[#020408] p-3 rounded-lg border border-white/5 font-mono text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ref Code:</span>
                    <strong className="text-slate-200">{rimsStages[activeStage].ref}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Material:</span>
                    <strong className="text-slate-200">{rimsStages[activeStage].material}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {rimsStages[activeStage].state}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-300">CONTROL ENFORCED:</span>
                  <p className="text-xs text-slate-400 mt-1">
                    {rimsStages[activeStage].control}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT 2: Real-Time Live SPC Telemetry */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-10 border-cyan-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="font-mono text-xs font-bold tracking-widest text-cyan-400 mb-3">
                REAL-TIME TELEMETRY
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Real-Time Statistical Process Control Streamer
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Interactive real-time X-bar / R chart plotting manufacturing samples every 1.4s. Dynamically calculates Upper Control Limit (UCL), Lower Control Limit (LCL), and sample mean, evaluating Western Electric rule breaches and alarming on out-of-control states.
              </p>

              {/* Injection Controls */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-slate-400 block">INJECT SHOP-FLOOR DISTURBANCE:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'normal', label: 'Stable' },
                    { key: 'drift', label: 'Mean Drift (+1.5σ)' },
                    { key: 'wear', label: 'Tool Wear Trend' },
                    { key: 'spike', label: 'Outlier Spike (NG)' },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setSpcMode(mode.key)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                        spcMode === mode.key
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md'
                          : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Chart */}
            <div className="lg:col-span-6 bg-[#020408] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <canvas ref={canvasRef} width={500} height={200} className="w-full h-48 rounded-lg bg-[#000205] border border-white/5" />
              <div className="grid grid-cols-4 gap-2 mt-3 font-mono text-xs">
                <div className="bg-slate-900/80 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-slate-500 block">μ TARGET</span>
                  <strong className="text-slate-200">10.00 mm</strong>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-slate-500 block">UCL (+3σ)</span>
                  <strong className="text-slate-200">10.45 mm</strong>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-white/5">
                  <span className="text-[10px] text-slate-500 block">LCL (-3σ)</span>
                  <strong className="text-slate-200">9.55 mm</strong>
                </div>
                <div className={`p-2 rounded border ${isBreached ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'}`}>
                  <span className="text-[10px] block opacity-80">STATUS</span>
                  <strong>{isBreached ? 'ALARM' : 'CONTROLLED'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DUAL PROJECTS: QR Scanner & SQL Validator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Console */}
          <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">
                AUTOMATED VERIFICATION
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                QR &amp; DataMatrix Checksum Console
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                High-speed barcode parser evaluating GS1 DataMatrix checksums, duplicate label prevention, and automatic operator decision tagging.
              </p>
            </div>

            <div className="space-y-3 bg-[#020408] p-4 rounded-xl border border-white/10">
              <div className="flex gap-2">
                {['ok', 'duplicate', 'ng'].map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setQrScenario(sc)}
                    className={`flex-1 py-1.5 rounded font-mono text-xs capitalize ${
                      qrScenario === sc ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {sc === 'ok' ? 'Valid OK' : sc}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={triggerQrScan}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono text-xs font-semibold"
              >
                Run Validation Scan →
              </button>
              <div className={`p-3 rounded-lg border font-mono text-xs flex items-center gap-3 ${
                qrResult.state === 'ok' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' :
                qrResult.state === 'duplicate' ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' :
                'border-rose-500/40 bg-rose-500/10 text-rose-300'
              }`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <strong className="block">{qrResult.text}</strong>
                  <span className="text-[11px] opacity-80">{qrResult.desc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Validator */}
          <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
                DATA INTEGRITY
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Invoice–ASN SQL Update Engine
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Validates 1-to-1 invoice-to-ASN mappings, prevents duplicate table collisions, and generates safe atomic SQL updates.
              </p>
            </div>

            <div className="bg-[#020408] border border-white/10 rounded-xl overflow-hidden font-mono text-xs">
              <div className="flex justify-between px-3 py-2 bg-white/5 border-b border-white/10 text-slate-500 text-[10px]">
                <span>VALIDATED SQL GENERATOR</span>
                <span className="text-emerald-400">OUTPUT READY</span>
              </div>
              <div className="p-4 text-slate-300 leading-relaxed">
                <p className="text-pink-400 font-semibold">UPDATE <span className="text-slate-200">TBILLTOPE</span></p>
                <p className="pl-4 text-sky-300">SET <span className="text-slate-200">TASN_NO</span> = <span className="text-emerald-400">'ASN-584102'</span></p>
                <p className="pl-4 text-purple-400">WHERE <span className="text-slate-200">BILL_PKEY</span> LIKE <span className="text-emerald-400">'%INV-260805-14%'</span>;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
