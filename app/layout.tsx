import type { Metadata } from 'next';
import React from 'react';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'FEBROS16',
  description: 'FEBROS16 Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className="dark">
      <body className="min-h-screen bg-slate-950 text-white antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
