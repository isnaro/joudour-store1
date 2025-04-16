'use client';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
if (typeof window === 'undefined') {
  // Server-side configuration
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Client-side image upload using fetch instead of the Node.js SDK
export async function uploadImage(file: File): Promise<string> {
  try {
    // If running on the client side
    if (typeof window !== 'undefined') {
      const base64 = await convertToBase64(file);
      
      const formData = new FormData();
      formData.append('file', base64);
      formData.append('upload_preset', 'ml_default'); // Create an unsigned upload preset in your Cloudinary dashboard
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.secure_url;
    } 
    // If running on the server side
    else {
      const base64 = await convertToBase64(file);
      const result = await cloudinary.uploader.upload(base64);
      return result.secure_url;
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function optimizeImage(imageUrl: string, width = 800, height = 800): string {
  // Check if it's a Cloudinary URL
  if (imageUrl && imageUrl.includes('cloudinary.com')) {
    // Parse the URL
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length === 2) {
      // Add transformation parameters
      return `${urlParts[0]}/upload/w_${width},h_${height},c_limit,q_auto,f_auto/${urlParts[1]}`;
    }
  }
  
  // Return the original URL if it's not a Cloudinary URL or cannot be parsed
  return imageUrl;
}

// Export a dummy cloudinary object for compatibility with existing code
const cloudinaryObject = {
  config: () => {},
  uploader: {
    upload: () => {},
  },
};

export default cloudinaryObject; 