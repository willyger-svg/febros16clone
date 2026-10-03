"use client";

import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Sparkles,
  ArrowRight,
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setFormSubmitted(false);
    setAuthModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setAuthModalOpen(false);
      setFormSubmitted(false);
      setEmail('');
      setPassword('');
      setName('');
    }, 1400);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 1. Background Image — Made distinctly bright and visible with subtle atmospheric gradient */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=90"
          alt="Majestic mountain sunrise"
          className="w-full h-full object-cover object-center transform scale-100"
        />
        {/* Subtle, translucent overlay so mountain peaks, sun rays, and colors remain vibrant */}
        <div className="absolute inset-0 bg-slate-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
      </div>

      {/* 2. Top Header Floating Glass Bar — Only Logo and Login/Signup Buttons (No tabs) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="backdrop-blur-xl bg-slate-950/40 border border-white/15 rounded-2xl px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl shadow-black/30">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              FEBROS16
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-widest text-blue-300 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-md">
              febros16.com
            </span>
          </div>

          {/* Auth Buttons Only */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-md cursor-pointer backdrop-blur-md"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => openAuth('signup')}
              className="px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm font-bold text-white bg-blue-600/90 hover:bg-blue-500 border border-blue-400/40 rounded-xl transition-all shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 cursor-pointer backdrop-blur-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Content — Designed in Premium Frosted Glass Style */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center">
        {/* Main Glass Hero Container */}
        <div className="relative backdrop-blur-2xl bg-slate-950/40 border border-white/20 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-2xl shadow-black/60 overflow-hidden text-center before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent">
          {/* Subtle Ambient Glow inside glass */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Glass Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-200 text-xs sm:text-sm font-medium mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Jukwaa Kuu la Maarifa ya Kweli, Tafiti na Fursa</span>
          </div>

          {/* Primary Headline with Glass Depth */}
          <h1 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-balance">
            Where Verified Knowledge Meets Global Ambition.
          </h1>

          {/* Description Maelezo inside Glass Container */}
          <p className="relative z-10 mt-5 text-base sm:text-lg lg:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-balance">
            FEBROS16 ni mfumo huru ulioundwa kuunganisha watu na maarifa ya kweli, tafiti zilizothibitishwa, mitaala ya kisasa ya elimu, vifaa vya kidijitali, na fursa za kimataifa bila upotoshaji.
          </p>

          {/* Action Buttons inside Glass */}
          <div className="relative z-10 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm sm:text-base border border-blue-400/40 shadow-xl shadow-blue-900/60 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all cursor-pointer backdrop-blur-md"
            >
              <span>Anza Sasa (Sign Up)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-sm sm:text-base border border-white/25 hover:border-white/40 backdrop-blur-xl shadow-lg transition-all cursor-pointer"
            >
              <span>Ingia kwenye Akaunti (Log In)</span>
            </button>
          </div>
        </div>

        {/* 3 Glassmorphic Highlight Cards (Maelezo ya Ziada - Zero links) */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          {/* Card 1 */}
          <div className="relative backdrop-blur-xl bg-slate-950/40 border border-white/15 rounded-2xl p-6 shadow-xl shadow-black/40 hover:bg-slate-950/50 hover:border-white/25 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-3 text-blue-300 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white drop-shadow">Vyanzo Vilivyohakikiwa</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              Kila andiko na taarifa hupitia ukaguzi madhubuti wa uhakiki ili kuhakikisha usahihi wa kiwango cha juu.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative backdrop-blur-xl bg-slate-950/40 border border-white/15 rounded-2xl p-6 shadow-xl shadow-black/40 hover:bg-slate-950/50 hover:border-white/25 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-3 text-indigo-300 backdrop-blur-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white drop-shadow">Elimu na Mitaala Huria</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              Kuweka mazingira wazi ya kujifunzia na kupata nyenzo za kitaaluma bila vizuizi vya kibiashara.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative backdrop-blur-xl bg-slate-950/40 border border-white/15 rounded-2xl p-6 shadow-xl shadow-black/40 hover:bg-slate-950/50 hover:border-white/25 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-300 backdrop-blur-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white drop-shadow">Fursa za Kimataifa</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              Kufungua milango ya ufadhili wa masomo, ruzuku za utafiti, na programu za maendeleo duniani kote.
            </p>
          </div>
        </div>
      </main>

      {/* 4. Minimalist Glass Footer (No section links) */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-6">
        <div className="backdrop-blur-xl bg-slate-950/30 border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-200 shadow-xl">
          <p className="drop-shadow">© 2026 FEBROS16. Haki zote zimehifadhiwa.</p>
          <div className="flex items-center gap-2 font-mono drop-shadow">
            <span className="text-slate-300">Tovuti Rasmi:</span>
            <span className="text-blue-300 font-bold bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
              febros16.com
            </span>
          </div>
        </div>
      </footer>

      {/* 5. Clean Glassmorphic Modal for Log In & Sign Up */}
      {authModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in"
          onClick={() => setAuthModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md backdrop-blur-2xl bg-slate-950/80 border border-white/20 rounded-3xl p-7 sm:p-8 text-white shadow-2xl shadow-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition-colors cursor-pointer backdrop-blur-md"
              aria-label="Funga"
            >
              <X className="w-4 h-4" />
            </button>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/50 rounded-full flex items-center justify-center mx-auto text-emerald-300 backdrop-blur-md shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">
                  {authMode === 'login' ? 'Umefanikiwa Kuingia!' : 'Akaunti Imetengenezwa!'}
                </h3>
                <p className="text-xs text-slate-300">
                  Karibu kwenye FEBROS16. Mfumo unakuunganisha sasa hivi...
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-300">
                    FEBROS16 Authentication
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-white drop-shadow">
                    {authMode === 'login' ? 'Ingia kwenye Akaunti' : 'Fungua Akaunti Mpya'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    {authMode === 'login'
                      ? 'Weka barua pepe na neno la siri ili kuendelea'
                      : 'Jiunge na jamii ya watafiti na wanafunzi wa FEBROS16'}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-200 mb-1.5">
                        Jina Kamili
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Mfano: Juma Rashid"
                          className="w-full bg-slate-900/60 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Barua Pepe (Email)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jina@mfano.com"
                        className="w-full bg-slate-900/60 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Neno la Siri (Password)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900/60 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-900/50 border border-blue-400/30 transition-all cursor-pointer"
                  >
                    {authMode === 'login' ? 'Ingia (Log In)' : 'Kamilisha Usajili (Sign Up)'}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  {authMode === 'login' ? (
                    <p className="text-xs text-slate-300">
                      Huna akaunti bado?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-blue-300 hover:text-blue-200 font-semibold cursor-pointer underline ml-1"
                      >
                        Jisajili Hapa (Sign Up)
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300">
                      Tayari unayo akaunti?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-blue-300 hover:text-blue-200 font-semibold cursor-pointer underline ml-1"
                      >
                        Ingia Hapa (Log In)
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
