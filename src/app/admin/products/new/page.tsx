'use client';

import { useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/cloudinary';
import { useRouter } from 'next/navigation';

// Mock categories - in a real app, these would come from an API or database
const MOCK_CATEGORIES = [
  { id: 'category-1', name: 'النباتات الداخلية' },
  { id: 'category-2', name: 'نباتات الزينة' },
  { id: 'category-3', name: 'النباتات العطرية' },
  { id: 'category-4', name: 'أدوات الزراعة' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (productData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be an API call to create the product
      console.log('Creating new product:', productData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to products list after success
      router.push('/admin/products');
    } catch (err) {
      console.error('Error creating product:', err);
      setError('حدث خطأ أثناء إنشاء المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 rtl:text-right">
            {error}
          </div>
        )}
        
        <ProductForm
          categories={MOCK_CATEGORIES}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
} 