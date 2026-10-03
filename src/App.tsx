"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../app/page';
import DiscoverPage from '../app/discover/page';
import KnowledgePage from '../app/knowledge/page';
import LearnPage from '../app/learn/page';
import ResearchPage from '../app/research/page';
import ResourcesPage from '../app/resources/page';
import OpportunitiesPage from '../app/opportunities/page';
import CampaignsPage from '../app/campaigns/page';
import SearchModal from '../components/SearchModal';
import AuthModal from '../components/AuthModal';

export type AppRoute =
  | '/'
  | '/discover'
  | '/knowledge'
  | '/learn'
  | '/research'
  | '/resources'
  | '/opportunities'
  | '/campaigns';

export default function App() {
  const getInitialRoute = (): AppRoute => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname as AppRoute;
      const hash = window.location.hash.replace('#', '');
      const validRoutes: AppRoute[] = [
        '/',
        '/discover',
        '/knowledge',
        '/learn',
        '/research',
        '/resources',
        '/opportunities',
        '/campaigns',
      ];
      if (validRoutes.includes(path)) return path;
      if (hash && validRoutes.includes(`/${hash}` as AppRoute)) {
        return `/${hash}` as AppRoute;
      }
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Intercept Next.js Link clicks inside the client environment to provide SPA routing
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.getAttribute('href')?.startsWith('/')) {
        const href = target.getAttribute('href') as AppRoute;
        const validRoutes: AppRoute[] = [
          '/',
          '/discover',
          '/knowledge',
          '/learn',
          '/research',
          '/resources',
          '/opportunities',
          '/campaigns',
        ];
        const routeBase = href.split('#')[0].split('?')[0] as AppRoute;
        if (validRoutes.includes(routeBase)) {
          e.preventDefault();
          setCurrentRoute(routeBase);
          window.history.pushState({}, '', href);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Global search shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Next.js App Router Root Navbar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        activePath={currentRoute}
      />

      {/* Main Content Router for Next.js App Router Pages */}
      <main className="flex-1">
        {currentRoute === '/' && <HomePage />}
        {currentRoute === '/discover' && <DiscoverPage />}
        {currentRoute === '/knowledge' && <KnowledgePage />}
        {currentRoute === '/learn' && <LearnPage />}
        {currentRoute === '/research' && <ResearchPage />}
        {currentRoute === '/resources' && <ResourcesPage />}
        {currentRoute === '/opportunities' && <OpportunitiesPage />}
        {currentRoute === '/campaigns' && <CampaignsPage />}
      </main>

      {/* Next.js App Router Root Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
