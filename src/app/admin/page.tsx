'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaClipboardList, FaUsers, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple authentication (for demo purposes only)
  // In a real application, use a proper authentication system
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-[#102c21] mb-6">تسجيل الدخول إلى لوحة التحكم</h1>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">اسم المستخدم</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                required
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className={`w-full bg-[#102c21] text-white py-3 px-4 rounded-lg hover:bg-[#1a4534] transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>
          
          <div className="mt-6 bg-gray-50 p-4 border rounded-lg text-gray-600 text-sm">
            <p className="mb-1 font-medium">بيانات الدخول للتجربة:</p>
            <p>اسم المستخدم: <span className="font-mono bg-gray-100 px-1 rounded">admin</span></p>
            <p>كلمة المرور: <span className="font-mono bg-gray-100 px-1 rounded">admin123</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-[#102c21] text-white w-full md:w-64 flex-shrink-0">
        <div className="p-4 border-b border-[#1a4534]">
          <h1 className="text-xl font-bold">لوحة تحكم المتجر</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FaTachometerAlt className="w-5 h-5" />
                <span>الرئيسية</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/products" 
                className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FaBox className="w-5 h-5" />
                <span>المنتجات</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/orders" 
                className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FaClipboardList className="w-5 h-5" />
                <span>الطلبات</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FaUsers className="w-5 h-5" />
                <span>المستخدمين</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-white/10 transition-colors text-red-300 hover:text-red-200"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#102c21]">مرحباً بك في لوحة التحكم</h1>
          <p className="text-gray-600">اطلع على آخر إحصائيات المتجر والمبيعات</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-500">المنتجات</h3>
                <p className="text-3xl font-bold text-[#102c21]">24</p>
              </div>
              <div className="bg-[#102c21]/10 p-3 rounded-full">
                <FaBox className="w-6 h-6 text-[#102c21]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-500">الطلبات</h3>
                <p className="text-3xl font-bold text-[#102c21]">156</p>
              </div>
              <div className="bg-[#102c21]/10 p-3 rounded-full">
                <FaClipboardList className="w-6 h-6 text-[#102c21]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-500">المبيعات</h3>
                <p className="text-3xl font-bold text-[#102c21]">13,580 دج</p>
              </div>
              <div className="bg-[#102c21]/10 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#102c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-500">المستخدمين</h3>
                <p className="text-3xl font-bold text-[#102c21]">42</p>
              </div>
              <div className="bg-[#102c21]/10 p-3 rounded-full">
                <FaUsers className="w-6 h-6 text-[#102c21]" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#102c21] mb-4">آخر الأنشطة</h2>
          <div className="space-y-4">
            <div className="flex items-start p-3 border-b border-gray-100">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">تم إضافة منتج جديد</p>
                <p className="text-sm text-gray-500">منذ 2 ساعة</p>
              </div>
            </div>
            <div className="flex items-start p-3 border-b border-gray-100">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">طلب جديد</p>
                <p className="text-sm text-gray-500">منذ 5 ساعات</p>
              </div>
            </div>
            <div className="flex items-start p-3">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">مستخدم جديد</p>
                <p className="text-sm text-gray-500">منذ يوم واحد</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 