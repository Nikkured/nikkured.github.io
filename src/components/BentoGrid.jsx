import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, Cpu, FileSpreadsheet, ShieldCheck, Github, ArrowUpRight } from 'lucide-react';

export const BentoGrid = () => {
  return (
    <section className="py-24 relative z-10" id="stack">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">
            02 // TECHNICAL ENVIRONMENT
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Bento Box Skills Grid.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            An asymmetric technical ecosystem bridging industrial quality engineering, embedded desktop software, and high-speed shop-floor automation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* CELL 1: Python & Enterprise Architecture (Spans 7 cols) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-7 glass-card rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block font-mono text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded mb-6">
                PRIMARY ARCHITECTURE
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Python &amp; Enterprise Architecture
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Architecting resilient offline desktop applications with <strong className="text-slate-200">Python 3</strong>, <strong className="text-slate-200">Tkinter</strong>, <strong className="text-slate-200">PySide6 (Qt)</strong>, and embedded <strong className="text-slate-200">SQLite</strong>. Built for zero latency, offline fault tolerance, and atomic ACID transaction ledgers.
              </p>
            </div>

            {/* Embedded Mini Terminal Preview */}
            <div className="bg-[#020408] border border-white/10 rounded-xl overflow-hidden font-mono text-xs shadow-inner">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-slate-500 text-[11px] ml-2">nhk_rims_engine.py</span>
              </div>
              <div className="p-4 text-slate-300 leading-relaxed overflow-x-auto">
                <p className="text-pink-400 font-semibold">class <span className="text-sky-300">TraceabilityEngine</span>:</p>
                <p className="pl-4 text-pink-400">def <span className="text-purple-300">commit_receipt</span>(self, heat_no, bundle_wt):</p>
                <p className="pl-8 text-slate-400">with self.db.transaction() as tx:</p>
                <p className="pl-12 text-slate-300">uid = tx.insert(<span className="text-emerald-400">"RCV_LEDGER"</span>, heat=heat_no, wt=bundle_wt)</p>
                <p className="pl-12 text-indigo-300">return self.zpl.print_tag(uid, status=<span className="text-emerald-400">"ACCEPTED"</span>)</p>
              </div>
            </div>
          </motion.div>

          {/* CELL 2: Statistical Process Control & Cpk (Spans 5 cols) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-5 glass-card rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block font-mono text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-1 rounded mb-6">
                STATISTICAL PROCESS CONTROL
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                SPC &amp; Cpk / Cpu Analysis
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Continuous capability monitoring ($C_{pk}, C_{pu}, C_{pl}$), dynamic $\bar{X} / R$ control limits ($UCL / LCL$), variation tracking, and Six-Sigma variance reduction across manufacturing lines.
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Cpk ≥ 1.67 Six-Sigma Target</span>
            </div>
          </motion.div>

          {/* CELL 3: Zebra ZPL & Laser Hardware (Spans 4 cols) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block font-mono text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded mb-6">
                HARDWARE I/O
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Zebra ZPL &amp; QR Laser Systems
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Raw network socket streaming directly to industrial Zebra barcode printers via <strong className="text-slate-200">ZPL</strong>. Sub-second 2D GS1 DataMatrix and QR code checksum verification.
              </p>
            </div>

            <div className="space-y-1.5 font-mono text-xs text-slate-400">
              <p className="flex items-center gap-2 text-indigo-300">→ Direct Socket TCP / USB ZPL</p>
              <p className="flex items-center gap-2 text-indigo-300">→ 2D Checksum Algorithm</p>
            </div>
          </motion.div>

          {/* CELL 4: Advanced Excel & VBA Automation (Spans 4 cols) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block font-mono text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded mb-6">
                ANALYTICS &amp; ETL
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Advanced Excel &amp; VBA Pipelines
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Custom VBA macro suites and automated ETL pipelines consolidating multi-shift inspection logs into real-time Pareto defect charts and management reporting decks.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/10">VBA Macros</span>
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/10">Pareto Analytics</span>
            </div>
          </motion.div>

          {/* CELL 5: Quality Standards & Auditing (Spans 4 cols) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block font-mono text-[10px] font-bold tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2.5 py-1 rounded mb-6">
                AUDIT COMPLIANCE
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                IATF 16949 &amp; 8D Root Cause
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Automotive plant audit compliance, ISO 9001/IATF standard execution, 5-Why problem-solving, test certificate preparation, and CAPA resolution.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/10">IATF 16949</span>
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/10">8D CAPA</span>
            </div>
          </motion.div>

          {/* CELL 6: Dedicated Open Source & GitHub Module (Spans 12 cols) */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-12 glass-card rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-indigo-500/20"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-white">
                <Github className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">@Nikkured on GitHub</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Open Source
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Explore open repositories, Python automation scripts, and full source code for desktop tools and web utilities.
                </p>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/Nikkured"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-sm font-semibold hover:border-indigo-400 hover:bg-slate-800 transition-all shadow-lg"
            >
              <span>Explore GitHub Repositories</span>
              <ArrowUpRight className="w-4 h-4 text-indigo-400" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
