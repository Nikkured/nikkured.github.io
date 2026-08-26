import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Moon, Sun, Download, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedAudio = localStorage.getItem('nv-audio') === 'on';
    setAudioEnabled(savedAudio);

    const savedTheme = localStorage.getItem('nv-theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    localStorage.setItem('nv-audio', next ? 'on' : 'off');
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('nv-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Stack Bento', href: '#stack' },
    { label: 'Projects', href: '#projects' },
    { label: 'Media & AI', href: '#media' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#05070a]/75 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-3 group text-slate-100 no-underline">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            NV
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Nikhil Vashisht
            </span>
            <span className="font-mono text-[11px] text-indigo-400">
              QA Executive · Python Dev
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Tools & CTA */}
        <div className="flex items-center gap-3">
          {/* Audio FX Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
              audioEnabled
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
            title="Toggle Tactile Sound FX"
          >
            {audioEnabled ? (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-indigo-400 rounded-full animate-equalizer-1" />
                <span className="w-0.5 bg-indigo-400 rounded-full animate-equalizer-2" />
                <span className="w-0.5 bg-indigo-400 rounded-full animate-equalizer-3" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{audioEnabled ? 'FX ON' : 'FX OFF'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white transition-all"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Download Resume Button */}
          <a
            href="nikhil_vashisht_resume.pdf"
            download="Nikhil_Vashisht_Resume.pdf"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white text-xs font-mono font-semibold transition-all duration-200"
          >
            <span>CV</span>
            <Download className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0d14] border-b border-white/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-slate-300 hover:text-indigo-400 py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="nikhil_vashisht_resume.pdf"
            download="Nikhil_Vashisht_Resume.pdf"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-mono text-sm font-semibold mt-4"
          >
            <span>Download Official Resume (PDF)</span>
            <Download className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
