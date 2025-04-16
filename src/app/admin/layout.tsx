'use client'

import React from 'react';
import { Tajawal } from 'next/font/google';
import '@/app/globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={tajawal.className}>
      {children}
    </div>
  );
} 