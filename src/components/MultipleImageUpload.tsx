'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Interface for the component props
interface MultipleImageUploadProps {
  onImagesUpload: (imageUrls: string[]) => void;
  existingImages?: string[] | string;
  maxImages?: number;
  className?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({ 
  onImagesUpload, 
  existingImages = [],
  maxImages = 5,
  className = ''
}) => {
  // Parse existing images to always work with an array
  const parseExistingImages = (): string[] => {
    if (typeof existingImages === 'string') {
      try {
        // Try to parse the string as JSON
        const parsed = JSON.parse(existingImages);
        return Array.isArray(parsed) ? parsed : existingImages ? [existingImages] : [];
      } catch (e) {
        // If parsing fails, use the string directly
        return existingImages ? [existingImages] : [];
      }
    }
    return Array.isArray(existingImages) ? existingImages : [];
  };

  const [imageUrls, setImageUrls] = useState<string[]>(parseExistingImages());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset error state
    setUploadError('');
    
    // Check if there are accepted files
    if (acceptedFiles.length === 0) return;
    
    // Check if we'd exceed the maximum number of images
    if (imageUrls.length + acceptedFiles.length > maxImages) {
      setUploadError(`يمكنك تحميل ${maxImages} صور كحد أقصى`);
      return;
    }
    
    // Process each file
    const newImageUrls = [...imageUrls];
    setIsUploading(true);
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          continue; // Skip non-image files
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue; // Skip files that are too large
        }
        
        // Update progress
        setUploadProgress(Math.round((i / acceptedFiles.length) * 100));
        
        // Upload to Cloudinary
        const uploadedImageUrl = await uploadToCloudinary(file);
        newImageUrls.push(uploadedImageUrl);
      }
      
      // Update state and call the callback
      setImageUrls(newImageUrls);
      onImagesUpload(newImageUrls);
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError('حدث خطأ أثناء تحميل الصور. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [imageUrls, maxImages, onImagesUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
  });

  // Remove an image at a specific index
  const removeImage = (indexToRemove: number) => {
    const updatedImages = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedImages);
    onImagesUpload(updatedImages);
  };

  // Move image up in the order
  const moveImageUp = (index: number) => {
    if (index === 0) return; // Already at the top
    const updatedImages = [...imageUrls];
    [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]];
    setImageUrls(updatedImages);
    onImagesUpload(updatedImages);
  };

  // Move image down in the order
  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return; // Already at the bottom
    const updatedImages = [...imageUrls];
    [updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]];
    setImageUrls(updatedImages);
    onImagesUpload(updatedImages);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Uploaded Images Gallery */}
      {imageUrls.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            الصور المُحمّلة ({imageUrls.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-md overflow-hidden border">
                  <Image 
                    src={url} 
                    alt={`صورة المنتج ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute bottom-1 right-1 flex space-x-1 rtl:space-x-reverse bg-black/60 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImageUp(index)}
                      className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      <FaArrowUp size={12} />
                    </button>
                  )}
                  {index < imageUrls.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImageDown(index)}
                      className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      <FaArrowDown size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    رئيسية
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Button / Dropzone - Only show if we haven't reached max images */}
      {imageUrls.length < maxImages && (
        <div 
          {...getRootProps({ 
            className: `border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`
          })}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="py-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-600">جاري تحميل الصور... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="py-4">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                <FaPlus className="mx-auto h-6 w-6" />
              </div>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-blue-600">اضغط لإضافة صور</span> أو اسحب وأفلت
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG, GIF حتى 5MB لكل صورة (الحد الأقصى: {maxImages} صور)
              </p>
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

export default MultipleImageUpload; 