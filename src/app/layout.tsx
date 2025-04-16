import './globals.css'
import { Metadata } from 'next'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'متجر جذور | Roots Store',
  description: 'متجر للمنتجات الطبيعية والعضوية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-tajawal bg-gray-50 min-h-screen">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}