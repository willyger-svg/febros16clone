"use client";

import React, { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import AssessmentPage from '../components/AssessmentPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'assessment'>('home');

  // Handle URL hash or direct path if available
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/login' || hash === '#login') {
        setCurrentPage('login');
      } else if (path === '/signup' || hash === '#signup') {
        setCurrentPage('signup');
      } else if (path === '/assessment' || hash === '#assessment') {
        setCurrentPage('assessment');
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

  const navigateTo = (page: 'home' | 'login' | 'signup' | 'assessment') => {
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
      />
    );
  }

  return (
    <LandingPage
      onNavigateLogin={() => navigateTo('login')}
      onNavigateSignup={() => navigateTo('signup')}
    />
  );
}
