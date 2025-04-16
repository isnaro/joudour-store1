import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

/**
 * Utility functions for handling Cloudinary image uploads
 */

/**
 * Uploads an image file to Cloudinary and returns the URL
 * @param file - The image file to upload
 * @returns Promise that resolves to the uploaded image URL
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Create form data for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'jozoor_store'); 
    
    // Make the API request to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID of the image
 */
export const getPublicIdFromUrl = (url: string): string => {
  try {
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public_id.ext
    const urlParts = url.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    
    return `${folder}/${publicId}`;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return '';
  }
};

/**
 * Deletes an image from Cloudinary using its public ID
 * @param publicId - The public ID of the image to delete
 * @returns Promise that resolves to true if successful
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // This would typically be done through a server API endpoint
    // for security reasons (to protect your API secret)
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image from Cloudinary');
    }

    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

export default cloudinary; 