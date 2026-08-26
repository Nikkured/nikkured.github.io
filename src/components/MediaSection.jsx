import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Play, ArrowUpRight, Sparkles, Video } from 'lucide-react';

export const MediaSection = () => {
  return (
    <section className="py-24 relative z-10" id="media">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs font-semibold tracking-widest text-pink-400 uppercase mb-3">
            04 // CONTENT CREATION &amp; AI
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            NV AI Studio &amp; Tech Reviews.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Sharing practical tutorials on AI coding workflows, industrial automation tools, and modern desktop engineering on YouTube.
          </p>
        </div>

        {/* Media Bento Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border-rose-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-rose-950/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Channel Info */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold mb-4">
                <Youtube className="w-3.5 h-3.5" />
                <span>YOUTUBE CREATOR</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                NV AI Studio <span className="text-rose-400 font-mono text-lg font-normal">@nvaistudio</span>
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                On <strong className="text-white">@nvaistudio</strong>, I produce high-impact videos exploring AI technology, automated coding workflows, practical Python desktop tools, and productivity stacks for engineers and modern creators.
              </p>

              {/* Channel Stats */}
              <div className="flex gap-8 mb-8 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xl font-bold text-white font-mono">Tech &amp; AI</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Core Niche</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono">Automation</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Workflows &amp; Code</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono">HD / 4K</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Production Quality</div>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.youtube.com/@nvaistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all"
              >
                <span>Visit @nvaistudio on YouTube</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Glowing Video Preview Cards */}
            <div className="lg:col-span-6 space-y-4">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
              >
                <div className="w-36 aspect-video rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white">
                    10:45
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-white leading-snug mb-1">
                    Automating Engineering Reports with Python &amp; SQLite
                  </h4>
                  <p className="text-xs text-slate-400">
                    Step-by-step tutorial on building zero-dependency reporting tools.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
              >
                <div className="w-36 aspect-video rounded-xl bg-gradient-to-br from-emerald-950 to-blue-950 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white">
                    08:20
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-white leading-snug mb-1">
                    Next-Gen AI Tools &amp; Workflow Automation Breakdown
                  </h4>
                  <p className="text-xs text-slate-400">
                    Comprehensive review of state-of-the-art AI assistant workflows.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
