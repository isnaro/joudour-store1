'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/utils/cloudinary';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUploader({ 
  onImageUploaded, 
  currentImage,
  label = 'صورة المنتج'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جدًا. الحد الأقصى هو 5 ميجابايت');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Create local preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      
      // Upload to Cloudinary
      const imageUrl = await uploadImage(file);
      
      // Call the callback with the uploaded image URL
      onImageUploaded(imageUrl);
      
      // Release the object URL to free memory
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('فشل رفع الصورة. يرجى المحاولة مرة أخرى');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageUploaded('');
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2 rtl:text-right">
        {label}
      </label>
      
      <div className="mt-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="إزالة الصورة"
            >
              <FaTimes size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <FaSpinner className="text-primary-500 text-2xl animate-spin mb-2" />
                <span className="text-sm text-gray-500">جاري الرفع...</span>
              </div>
            ) : (
              <>
                <FaUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-sm text-gray-500">انقر لاختيار صورة</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP حتى 5MB</p>
              </>
            )}
          </div>
        )}
        
        {error && (
          <p className="text-red-500 text-xs mt-1 rtl:text-right">{error}</p>
        )}
      </div>
    </div>
  );
} 