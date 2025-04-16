'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { Tajawal } from 'next/font/google';
import MobileMenu from '@/components/MobileMenu';
import CartSidebar from '@/components/CartSidebar';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Listen for cart open events from child components
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => {
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  return (
    <div className={`${tajawal.className} min-h-screen bg-gray-50 text-gray-900 flex flex-col`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#102c21] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center">
          {/* Three-column layout for proper centering */}
          <div className="flex-1 flex justify-start">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="فتح القائمة"
            >
              <FaBars className="h-6 w-6" />
            </button>
            
            {/* Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              <Link
                href="/"
                className="relative text-white hover:text-white/90 transition-all duration-300 font-medium text-lg group px-3 py-2"
              >
                <span className="relative z-10">الرئيسية</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                href="/products"
                className="relative text-white hover:text-white/90 transition-all duration-300 font-medium text-lg group px-3 py-2"
              >
                <span className="relative z-10">المنتجات</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                href="/about"
                className="relative text-white hover:text-white/90 transition-all duration-300 font-medium text-lg group px-3 py-2"
              >
                <span className="relative z-10">من نحن</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                href="/contact"
                className="relative text-white hover:text-white/90 transition-all duration-300 font-medium text-lg group px-3 py-2"
              >
                <span className="relative z-10">اتصل بنا</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </nav>
          </div>
          
          {/* Logo - Centered column */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex-shrink-0">
              <div className="relative w-32 h-12">
                <Image
                  src="/images/logo.png"
                  alt="جذور"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Cart Button - Right column */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
              aria-label="عرض السلة"
            >
              <span>السلة</span>
              <FaShoppingCart className="h-5 w-5" />
              <span className="bg-red-500 text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Main Content with proper spacing for header */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#102c21] text-white pt-12 pb-6 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">متجر طبيعي</h3>
              <p className="text-gray-100 mb-4">نوفر منتجات طبيعية عالية الجودة مباشرة من المزارع المحلية.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-100 hover:text-white transition-colors">الرئيسية</Link></li>
                <li><Link href="/products" className="text-gray-100 hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/about" className="text-gray-100 hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="text-gray-100 hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="/admin" className="text-gray-100 hover:text-white transition-colors">لوحة التحكم</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">تواصل معنا</h3>
              <ul className="space-y-2">
                <li className="text-gray-100">support@example.com</li>
                <li className="text-gray-100">+123 456 7890</li>
                <li className="text-gray-100">الجزائر</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">تابعنا</h3>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1a4534] pt-4 text-center">
            <p className="text-sm text-gray-300">© {new Date().getFullYear()} متجر طبيعي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 