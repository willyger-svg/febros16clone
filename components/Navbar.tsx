"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'features', 'categories', 'research-workflow', 'ecosystem'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Discover', href: '#features', id: 'features' },
    { name: 'Knowledge', href: '#categories', id: 'categories' },
    { name: 'Research', href: '#research-workflow', id: 'research-workflow' },
    { name: 'Campaigns', href: '#ecosystem', id: 'ecosystem' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
            aria-label="FEBROS16 Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              FEBROS16
            </span>
          </a>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
              aria-label="Search (Press Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline text-slate-400">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Sign In */}
            <button
              onClick={() => onOpenAuth?.('signin')}
              type="button"
              className="px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Create Account */}
            <button
              onClick={() => onOpenAuth?.('signup')}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-900/30 transition-all cursor-pointer"
            >
              <span>Create Account</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60 rounded-lg cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-slate-950/98 backdrop-blur-xl border-b border-slate-800 px-5 py-6 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="py-2.5 px-3 text-base font-medium rounded-lg text-slate-200 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('signup');
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md cursor-pointer"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('signin');
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
