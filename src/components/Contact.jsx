import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Download, ExternalLink, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <section className="py-24 relative z-10" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="font-mono text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">
                06 // INITIATE CONVERSATION
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Let's build something exceptional together.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                I am actively open to <strong className="text-white">Quality Assurance</strong>, <strong className="text-white">Quality Engineering</strong>, <strong className="text-white">Manufacturing Digitalization</strong>, and <strong className="text-white">Python Software Automation</strong> roles in the automotive and industrial sectors.
              </p>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">DIRECT EMAIL</span>
                  <a href="mailto:nishantvashisht8@gmail.com" className="text-slate-200 hover:text-indigo-400 font-semibold transition-colors">
                    nishantvashisht8@gmail.com
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">PHONE / WHATSAPP</span>
                  <a href="tel:+918882186438" className="text-slate-200 hover:text-indigo-400 font-semibold transition-colors">
                    +91 88821 86438
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">LOCATION</span>
                  <span className="text-slate-200">Gurugram / Manesar, Haryana, India</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Access Hub */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-5">Quick Access Hub</h3>
              <div className="space-y-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:nishantvashisht8@gmail.com"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Email Message</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="nikhil_vashisht_resume.pdf"
                  download="Nikhil_Vashisht_Resume.pdf"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800/80 border border-white/10 hover:border-indigo-400 text-slate-200 font-semibold transition-all"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download Official CV (PDF)</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://linktr.ee/nikku_red"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white font-semibold transition-all"
                >
                  <span>Linktree Profile (@nikku_red)</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
