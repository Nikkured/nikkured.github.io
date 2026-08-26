import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, ExternalLink, MapPin } from 'lucide-react';

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const telemetryData = [
    { value: '100%', label: 'Audit Traceability' },
    { value: '0 PPM', label: 'Label & ASN Escapes' },
    { value: '10k+', label: 'Scans & Cycles Validated' },
    { value: 'Cpk > 1.67', label: 'Process Capability Stability' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden z-10">
      {/* Subtle Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_80%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Status Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md text-xs font-mono text-slate-300 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
            <span>Available for QA &amp; Software Engineering Roles</span>
            <span className="text-slate-600">·</span>
            <span className="text-indigo-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 inline" /> Gurugram / Noida Area
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Bridging{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Manufacturing Quality
            </span>{' '}
            <br className="hidden sm:inline" />
            &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
              Python Software
            </span>{' '}
            Systems.
          </motion.h1>

          {/* Lead Bio */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10"
          >
            I am <strong className="text-slate-200">Nikhil Vashisht</strong> — Quality Assurance Executive at{' '}
            <strong className="text-slate-200">NHK Spring India Ltd.</strong> (ex-
            <strong className="text-slate-200">Hero MotoCorp</strong>). I engineer robust desktop enterprise software (
            <code className="text-indigo-300 font-mono text-sm px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
              NHK_RIMS
            </code>
            ), real-time SPC telemetry, and offline-first Python automation tools that eliminate defect escapes on the factory floor.
          </motion.p>

          {/* Magnetic Actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 flex items-center gap-2.5 transition-shadow hover:shadow-indigo-500/40"
            >
              <span>Explore Flagship Systems</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="nikhil_vashisht_resume.pdf"
              download="Nikhil_Vashisht_Resume.pdf"
              className="px-6 py-3.5 rounded-full font-semibold text-slate-200 border border-white/10 bg-slate-900/60 backdrop-blur-md hover:border-indigo-400 hover:bg-slate-800/80 flex items-center gap-2 transition-all"
            >
              <span>Download Official Resume (PDF)</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/Nikkured"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>GitHub @Nikkured</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>

          {/* Telemetry Strip */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10"
          >
            {telemetryData.map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs text-slate-400 font-medium mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
