"use client";

import { useRouter } from 'next/navigation';
import LandingPage from '../components/LandingPage';

export default function HomePage() {
  const router = useRouter();

  return (
    <LandingPage
      onNavigateLogin={() => router.push('/login')}
      onNavigateSignup={() => router.push('/signup')}
      onNavigateDashboard={() => router.push('/dashboard')}
    />
  );
}
