'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Interface for the component props
interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  existingImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  existingImage = '',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string>(existingImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset error state
    setUploadError('');
    
    // Check if there are accepted files
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0]; // Take the first file
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى تحميل ملف صورة فقط');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload to Cloudinary
      const uploadedImageUrl = await uploadToCloudinary(file);
      
      // Update state and call the callback
      setImageUrl(uploadedImageUrl);
      onImageUpload(uploadedImageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('حدث خطأ أثناء تحميل الصورة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
  });

  return (
    <div className={`w-full ${className}`}>
      {imageUrl ? (
        <div className="relative">
          <div className="aspect-square relative rounded-md overflow-hidden mb-2">
            <Image 
              src={imageUrl} 
              alt="صورة المنتج"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                onImageUpload('');
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              حذف
            </button>
            <div {...getRootProps({ className: 'cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors' })}>
              <input {...getInputProps()} />
              تغيير
            </div>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps({ 
            className: `border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`
          })}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="py-4">
              <div className="spinner-border text-blue-500 mb-2"></div>
              <p className="text-gray-600">جاري تحميل الصورة...</p>
            </div>
          ) : (
            <div className="py-4">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-2" 
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 48 48" 
                aria-hidden="true"
              >
                <path 
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-blue-600">اضغط للتحميل</span> أو اسحب وأفلت
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG حتى 5MB</p>
            </div>
          )}
          
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 