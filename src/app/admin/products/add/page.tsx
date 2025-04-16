'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  images: string;
  features: string;
  inStock: boolean;
  id?: string;
}

const categories = [
  'زيوت',
  'عسل',
  'تمور',
  'أعشاب',
  'مكسرات',
  'توابل',
  'مستخلصات',
];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savedProductId, setSavedProductId] = useState<string>('');
  
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    price: '',
    category: categories[0],
    description: '',
    images: '',
    features: '',
    inStock: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setProduct((prev) => ({ ...prev, images: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!product.name || !product.price || !product.category || !product.description || !product.images) {
      setErrorMessage('جميع الحقول المطلوبة يجب أن تكون معبأة');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data to be sent
      const productData = {
        ...product,
        price: parseInt(product.price, 10), // Convert to integer instead of float
        features: product.features.split('\n').filter(f => f.trim() !== ''),
      };
      
      // In a real app, this would be an API call to save the product
      // For now, we'll just simulate a successful save and set a mock ID for preview
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set a mock ID for the preview button
      const mockId = Date.now().toString();
      setSavedProductId(mockId);
      
      setSuccessMessage('تم إضافة المنتج بنجاح');
      
      // Don't navigate away automatically so user can preview the product
      
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('حدث خطأ أثناء إضافة المنتج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة منتج جديد</h1>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
            <span>{successMessage}</span>
            {savedProductId && (
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Link 
                  href={`/products/${savedProductId}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  <FaEye />
                  <span>معاينة المنتج</span>
                </Link>
                <button
                  onClick={() => router.push('/admin/products')}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  العودة للقائمة
                </button>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 admin-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                required
              />
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">السعر (دج) <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">التصنيف <span className="text-red-500">*</span></label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* In Stock */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={product.inStock}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#102c21] focus:ring-[#102c21] border-gray-300 rounded ml-2"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-gray-700">متوفر في المخزون</label>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
              required
            />
          </div>
          
          {/* Features */}
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">مميزات المنتج (كل سطر ميزة)</label>
            <textarea
              id="features"
              name="features"
              value={product.features}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c21]"
              placeholder="أدخل كل ميزة في سطر منفصل"
            />
          </div>
          
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج <span className="text-red-500">*</span></label>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              existingImage={product.images}
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            {!savedProductId && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-[#102c21] text-white rounded-lg font-medium hover:bg-[#1a4534] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm ml-2"></span>
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ المنتج'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 