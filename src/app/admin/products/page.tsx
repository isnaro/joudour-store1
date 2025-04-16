'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaTrash, FaEdit, FaChevronLeft, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { optimizeImage } from '@/utils/cloudinary';

export default function AdminProducts() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    images: '/images/placeholder.jpg'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuth) {
      router.push('/admin');
    } else {
      setIsAuthenticated(isAuth);
      fetchProducts();
    }
  }, [router]);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock || !newProduct.description) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      // Refresh product list
      fetchProducts();
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        images: '/images/placeholder.jpg'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Update UI without refetching
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4 p-2 bg-[#102c21]/10 rounded-full hover:bg-[#102c21]/20 transition-colors">
              <FaChevronLeft className="w-5 h-5 text-[#102c21]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#102c21]">إدارة جميع المنتجات</h1>
          </div>
          <Link 
            href="/admin/products/new" 
            className="bg-[#102c21] text-white py-2 px-4 rounded-lg hover:bg-[#1a4534] transition-colors flex items-center"
          >
            <FaPlus className="ml-2" />
            إضافة منتج جديد
          </Link>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="البحث عن منتجات..."
            className="w-full p-3 pr-10 rtl:pr-3 rtl:pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="spinner-border text-[#102c21]" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">لا توجد منتجات حالياً</p>
          </div>
        )}

        {/* Products Table */}
        {!isLoading && products.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 text-right">المنتج</th>
                  <th className="p-4 text-right">السعر</th>
                  <th className="p-4 text-right">التصنيف</th>
                  <th className="p-4 text-right">المخزون</th>
                  <th className="p-4 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 ml-3 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={optimizeImage(product.images)}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="font-medium text-gray-800">{product.name}</div>
                        </div>
                      </td>
                      <td className="p-4">{product.price.toFixed(2)} د.ج</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button 
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="تعديل"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="حذف"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      لا توجد منتجات مطابقة لبحثك
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#102c21]">إضافة منتج جديد</h2>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">السعر (د.ج)</label>
                      <input
                        type="number"
                        step="0.01"
                        id="price"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                      <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                        required
                      >
                        <option value="">اختر الفئة</option>
                        <option value="زيوت">زيوت</option>
                        <option value="عسل">عسل</option>
                        <option value="تمور">تمور</option>
                        <option value="مكسرات">مكسرات</option>
                        <option value="أعشاب">أعشاب</option>
                        <option value="توابل">توابل</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج (رابط)</label>
                    <input
                      type="text"
                      id="images"
                      name="images"
                      value={newProduct.images}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                    />
                    <p className="text-sm text-gray-500 mt-1">ملاحظة: في التطبيق النهائي، يمكن استبدال هذا بمحمل ملفات</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#102c21] text-white rounded-lg hover:bg-[#1a4534] transition-colors"
                    >
                      إضافة المنتج
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 