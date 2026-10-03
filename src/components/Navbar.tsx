import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';

export type PageId =
  | 'home'
  | 'discover'
  | 'knowledge'
  | 'learn'
  | 'research'
  | 'resources'
  | 'opportunities'
  | 'campaigns';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  currentPage: PageId;
  onNavigatePage: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
  currentPage,
  onNavigatePage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; id: PageId }[] = [
    { name: 'Home', id: 'home' },
    { name: 'Discover', id: 'discover' },
    { name: 'Knowledge', id: 'knowledge' },
    { name: 'Learn', id: 'learn' },
    { name: 'Research', id: 'research' },
    { name: 'Resources', id: 'resources' },
    { name: 'Opportunities', id: 'opportunities' },
    { name: 'Campaigns', id: 'campaigns' },
  ];

  const handleLinkClick = (id: PageId) => {
    setMobileMenuOpen(false);
    onNavigatePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = id === 'home' ? '' : id;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || currentPage !== 'home'
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 distinct zones */}
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
            aria-label="FEBROS16 Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              FEBROS16
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-6 2xl:gap-7 text-sm font-medium text-slate-300"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
              aria-label="Search topics, articles, and research (Press Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline text-slate-400">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Sign In */}
            <button
              onClick={() => onOpenAuth('signin')}
              type="button"
              className="px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap cursor-pointer"
            >
              Sign In
            </button>

            {/* Create Account */}
            <button
              onClick={() => onOpenAuth('signup')}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-900/30 transition-all hover:shadow-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap cursor-pointer"
            >
              <span>Create Account</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="xl:hidden p-2 text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] bg-slate-950/98 backdrop-blur-xl border-b border-slate-800 px-5 py-6 shadow-2xl transition-all animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-60px)] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center justify-between py-3 px-3 text-base font-medium rounded-lg transition-colors text-left cursor-pointer ${
                  currentPage === link.id
                    ? 'text-white bg-blue-650/30 text-blue-400 font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-3 px-4 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="w-full py-3 px-4 text-center text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
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
