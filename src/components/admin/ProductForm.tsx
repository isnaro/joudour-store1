'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { FaSave, FaSpinner, FaTrash } from 'react-icons/fa';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    inStock: boolean;
    stockCount: number;
    colors?: string[];
  };
  categories: { id: string; name: string }[];
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [''],
    category: '',
    inStock: true,
    stockCount: 10,
    colors: ['#000000'],
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);

  // Load initial data if editing an existing product
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure images array has at least one empty string for the uploader
        images: initialData.images?.length > 0 ? initialData.images : [''],
        // Ensure colors array has at least one color
        colors: initialData.colors?.length > 0 ? initialData.colors : ['#000000'],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'stockCount') {
      // Convert string value to number
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (url: string, index: number) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    
    // If this is the last image and it's not empty, add a new empty slot
    if (index === newImages.length - 1 && url) {
      newImages.push('');
    }
    
    // If the image is removed and it's not the last empty one, remove it
    if (!url && index !== newImages.length - 1) {
      newImages.splice(index, 1);
    }
    
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleColorChange = (color: string, index: number) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, '#000000']
    }));
  };

  const removeColor = (index: number) => {
    if (formData.colors.length <= 1) return;
    
    const newColors = [...formData.colors];
    newColors.splice(index, 1);
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم المنتج مطلوب';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المنتج مطلوب';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }
    
    if (!formData.category) {
      newErrors.category = 'يرجى اختيار الفئة';
    }
    
    if (formData.inStock && formData.stockCount <= 0) {
      newErrors.stockCount = 'عدد المخزون يجب أن يكون أكبر من صفر';
    }
    
    // Check if at least one image is uploaded
    const hasValidImage = formData.images.some(img => img && img.trim() !== '');
    if (!hasValidImage) {
      newErrors.images = 'يجب رفع صورة واحدة على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Filter out empty image URLs
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img && img.trim() !== ''),
      };
      
      await onSubmit(cleanedData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            اسم المنتج *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`shadow appearance-none border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary-500`}
            placeholder="اسم المنتج"
            dir="rtl"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 rtl:text-right">{errors.name}</p>
          )}
        </div>

        {/* Product Description */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            وصف المنتج *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`shadow appearance-none border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary-500`}
            placeholder="وصف المنتج"
            rows={4}
            dir="rtl"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 rtl:text-right">{errors.description}</p>
          )}
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            السعر *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`shadow appearance-none border ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary-500`}
            placeholder="0.00"
            dir="rtl"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1 rtl:text-right">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            الفئة *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`shadow appearance-none border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary-500`}
            dir="rtl"
          >
            <option value="">اختر الفئة</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1 rtl:text-right">{errors.category}</p>
          )}
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            حالة المخزون
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-gray-700 rtl:text-right">متوفر في المخزون</span>
          </div>
        </div>

        {/* Stock Count */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            عدد المخزون
          </label>
          <input
            type="number"
            name="stockCount"
            value={formData.stockCount}
            onChange={handleChange}
            min="0"
            className={`shadow appearance-none border ${
              errors.stockCount ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary-500`}
            disabled={!formData.inStock}
            dir="rtl"
          />
          {errors.stockCount && (
            <p className="text-red-500 text-xs mt-1 rtl:text-right">{errors.stockCount}</p>
          )}
        </div>

        {/* Product Colors */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            الألوان المتاحة
          </label>
          <div className="space-y-2">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value, index)}
                  className="h-8 w-8 border border-gray-300 rounded"
                />
                <span className="rtl:text-right">{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.colors.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
            >
              + إضافة لون
            </button>
          </div>
        </div>

        {/* Product Images */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
            صور المنتج *
          </label>
          {errors.images && (
            <p className="text-red-500 text-xs mb-2 rtl:text-right">{errors.images}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((imageUrl, index) => (
              <ImageUploader
                key={index}
                onImageUploaded={(url) => handleImageChange(url, index)}
                currentImage={imageUrl}
                label={`صورة ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline flex items-center space-x-2 rtl:space-x-reverse"
        >
          {submitting || isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>حفظ المنتج</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
} 