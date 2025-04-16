'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FaTimes, FaShoppingCart } from 'react-icons/fa'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCartClick: () => void
}

export default function MobileMenu({ isOpen, onClose, onCartClick }: MobileMenuProps) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCartClick = () => {
    onClose()
    onCartClick()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-[#102c21]">القائمة</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block py-3 px-4 text-lg hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                الرئيسية
              </Link>
              <Link
                href="/products"
                className="block py-3 px-4 text-lg hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                جميع المنتجات
              </Link>
              <Link
                href="/about"
                className="block py-3 px-4 text-lg hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="block py-3 px-4 text-lg hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                اتصل بنا
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleCartClick}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full bg-[#102c21] text-white py-3 px-6 rounded-lg hover:bg-[#1a4534] transition-colors"
            >
              <span>السلة</span>
              <FaShoppingCart className="h-5 w-5" />
              <span className="bg-white text-[#102c21] text-sm rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 