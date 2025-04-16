import React from 'react';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { FaShoppingCart, FaFilter } from 'react-icons/fa';

// Sample products data
const sampleProducts = [
  { 
    id: '1', 
    name: 'منتج طبيعي 1', 
    price: 1999.99, 
    description: 'منتج طبيعي عالي الجودة مصنوع من أفضل المكونات الطبيعية',
    category: 'فئة 1',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.5,
    reviewCount: 120
  },
  { 
    id: '2', 
    name: 'منتج طبيعي 2', 
    price: 2499.99, 
    description: 'منتج طبيعي فريد يتميز بالفعالية والجودة العالية',
    category: 'فئة 2',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.8,
    reviewCount: 85
  },
  { 
    id: '3', 
    name: 'منتج طبيعي 3', 
    price: 1799.99, 
    description: 'منتج طبيعي مثالي للاستخدام اليومي وبأسعار مناسبة',
    category: 'فئة 3',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.3,
    reviewCount: 62
  },
  { 
    id: '4', 
    name: 'منتج طبيعي 4', 
    price: 3299.99, 
    description: 'منتج طبيعي فاخر للعناية الشخصية مصنوع من مواد عضوية',
    category: 'فئة 1',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.7,
    reviewCount: 94
  },
  { 
    id: '5', 
    name: 'منتج طبيعي 5', 
    price: 2199.99, 
    description: 'منتج طبيعي متعدد الاستخدامات للعناية بالبشرة',
    category: 'فئة 2',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.6,
    reviewCount: 103
  },
  { 
    id: '6', 
    name: 'منتج طبيعي 6', 
    price: 2799.99, 
    description: 'منتج طبيعي فعال للعناية بالشعر بتركيبة خاصة',
    category: 'فئة 3',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.4,
    reviewCount: 78
  },
  { 
    id: '7', 
    name: 'منتج طبيعي 7', 
    price: 1599.99, 
    description: 'منتج طبيعي مثالي للبشرة الحساسة والجافة',
    category: 'فئة 1',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.2,
    reviewCount: 56
  },
  { 
    id: '8', 
    name: 'منتج طبيعي 8', 
    price: 2899.99, 
    description: 'منتج طبيعي مميز للعناية بالبشرة مصنوع من زيوت طبيعية',
    category: 'فئة 2',
    images: JSON.stringify(['/placeholder.jpg']),
    rating: 4.9,
    reviewCount: 142
  },
];

export default function ProductsPage() {
  // We're using static data instead of Prisma
  const products = sampleProducts;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            متجر جذور
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-blue-600 font-medium">
              جميع المنتجات
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <FaShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">جميع جميع المنتجات</h1>
            <p className="text-gray-600 mt-2">تصفح تشكيلتنا من جميع المنتجات الطبيعية</p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button className="w-full flex justify-center items-center bg-white p-3 rounded-md shadow-sm border border-gray-300">
              <FaFilter className="h-5 w-5 ml-2 text-gray-500" />
              تصفية جميع المنتجات
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">الفئات</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">الفئة</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">فئة 1</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">فئة 2</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">فئة 3</span>
                  </label>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">نطاق السعر</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">أقل من 2000 د.ج</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">2000 - 2500 د.ج</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">2500 - 3000 د.ج</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-gray-700">أكثر من 3000 د.ج</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                    2
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">متجرنا</h3>
              <p className="text-gray-400 mb-4">
                نقدم منتجات عالية الجودة لعملائنا منذ 2023.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">الرئيسية</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white">جميع المنتجات</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white">لوحة التحكم</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">اتصل بنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} متجر جذور. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}