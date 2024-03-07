import React, { type ReactElement } from 'react'; // Added React and ReactElement import
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sudoku Solver (Next.js)',
  description: "Leia's demo program.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  // Added the return type ReactElement
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
