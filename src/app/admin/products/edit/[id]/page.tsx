'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaChevronLeft, FaSave, FaEye } from 'react-icons/fa';
import ImageUpload from '@/components/ImageUpload';

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  images: string;
  features: string;
  inStock: boolean;
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

// Mock function to fetch product data
const fetchProductById = async (id: string): Promise<ProductFormData> => {
  // In a real app, this would fetch from an API
  // For now, just simulate a network request with dummy data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    name: 'زيت زيتون عضوي',
    price: '750',
    category: 'زيوت',
    description: 'زيت زيتون عضوي 100% معصور على البارد، غني بمضادات الأكسدة والفيتامينات',
    images: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    features: 'عضوي 100%\nمعصور على البارد\nغني بمضادات الأكسدة\nخالي من الإضافات',
    inStock: true
  };
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    price: '',
    category: categories[0],
    description: '',
    images: '',
    features: '',
    inStock: true,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        setErrorMessage('فشل في تحميل بيانات المنتج');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      loadProduct();
    }
  }, [productId]);

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
    
    if (!product.name || !product.price || !product.category || !product.description) {
      setErrorMessage('جميع الحقول المطلوبة يجب أن تكون معبأة');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data to be sent
      const productData = {
        ...product,
        price: parseInt(product.price, 10),
        features: product.features.split('\n').filter(f => f.trim() !== ''),
      };
      
      // In a real app, this would be an API call to update the product
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('تم تحديث المنتج بنجاح');
      setIsUpdated(true);
      
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('حدث خطأ أثناء تحديث المنتج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="spinner-border text-[#102c21]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">تعديل المنتج</h1>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
            <span>{successMessage}</span>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Link 
                href={`/products/${productId}`}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج</label>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              existingImage={product.images}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
            
            {!isUpdated && (
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
                  'حفظ التغييرات'
                )}
              </button>
            )}
            
            {!isSubmitting && !isUpdated && (
              <Link 
                href={`/products/${productId}`}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                target="_blank"
              >
                <FaEye className="text-sm" />
                <span>معاينة</span>
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 