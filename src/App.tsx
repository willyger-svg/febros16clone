"use client";

import React, { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import AssessmentPage from '../components/AssessmentPage';
import DashboardPage from '../components/DashboardPage';
import { DashboardTabId } from '../components/dashboard/DashboardLayout';

type PageRoute =
  | 'home'
  | 'login'
  | 'signup'
  | 'assessment'
  | 'dashboard'
  | 'dashboard/learn'
  | 'dashboard/progress'
  | 'dashboard/quick-help'
  | 'dashboard/checkin'
  | 'dashboard/library'
  | 'dashboard/research';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Handle URL hash or direct path
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      const target = path || hash;

      if (target === 'login') {
        setCurrentPage('login');
      } else if (target === 'signup') {
        setCurrentPage('signup');
      } else if (target === 'assessment') {
        setCurrentPage('assessment');
      } else if (target === 'dashboard/learn') {
        setCurrentPage('dashboard/learn');
      } else if (target === 'dashboard/progress') {
        setCurrentPage('dashboard/progress');
      } else if (target === 'dashboard/quick-help') {
        setCurrentPage('dashboard/quick-help');
      } else if (target === 'dashboard/checkin') {
        setCurrentPage('dashboard/checkin');
      } else if (target === 'dashboard/library') {
        setCurrentPage('dashboard/library');
      } else if (target === 'dashboard/research') {
        setCurrentPage('dashboard/research');
      } else if (target === 'dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        onNavigateHome={() => navigateTo('home')}
        onNavigateSignup={() => navigateTo('signup')}
        onLoginSuccess={() => navigateTo('assessment')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignUpPage
        onNavigateHome={() => navigateTo('home')}
        onNavigateLogin={() => navigateTo('login')}
        onSignUpSuccess={() => navigateTo('assessment')}
      />
    );
  }

  if (currentPage === 'assessment') {
    return (
      <AssessmentPage
        onNavigateHome={() => navigateTo('home')}
        onNavigateDashboard={() => navigateTo('dashboard')}
      />
    );
  }

  if (currentPage.startsWith('dashboard')) {
    let initialTab: DashboardTabId = 'dashboard';
    if (currentPage === 'dashboard/learn') initialTab = 'learn';
    else if (currentPage === 'dashboard/progress') initialTab = 'progress';
    else if (currentPage === 'dashboard/quick-help') initialTab = 'quick-help';
    else if (currentPage === 'dashboard/checkin') initialTab = 'checkin';
    else if (currentPage === 'dashboard/library') initialTab = 'library';
    else if (currentPage === 'dashboard/research') initialTab = 'research';

    return (
      <DashboardPage
        initialTab={initialTab}
        onNavigateHome={() => navigateTo('home')}
        onNavigateAssessment={() => navigateTo('assessment')}
        onTabChange={(tab) => {
          if (tab === 'dashboard') navigateTo('dashboard');
          else navigateTo(`dashboard/${tab}` as PageRoute);
        }}
      />
    );
  }

  return (
    <LandingPage
      onNavigateLogin={() => navigateTo('login')}
      onNavigateSignup={() => navigateTo('signup')}
      onNavigateDashboard={() => navigateTo('dashboard')}
    />
  );
}
