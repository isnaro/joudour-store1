'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaSearch, FaSpinner } from 'react-icons/fa'
import { optimizeImage } from '@/utils/cloudinary'

interface ProductImageProps {
  images: string[]
  productName: string
}

export default function ProductImage({ images, productName }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter out any invalid image URLs
  const validImages = images.filter(image => image && image.trim().length > 0)

  const handlePrev = () => {
    setIsLoading(true)
    setSelectedImage((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIsLoading(true)
    setSelectedImage((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setZoomPosition({ x, y })
  }

  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false)
    }
  }

  // Use first valid image or placeholder if none available
  if (validImages.length === 0) {
    validImages.push('/placeholder-image.jpg')
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm group">
        <div 
          className={`aspect-square relative cursor-zoom-in ${isZoomed ? 'overflow-hidden' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {isZoomed ? (
            <div 
              className="absolute w-full h-full transition-transform duration-200"
              style={{
                backgroundImage: `url(${optimizeImage(validImages[selectedImage], 1200, 1200)})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: '200%',
                backgroundRepeat: 'no-repeat',
                zIndex: 20
              }}
            />
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <span className="text-primary-600 animate-spin">
                    <FaSpinner className="w-8 h-8" />
                  </span>
                </div>
              )}
              <Image
                src={optimizeImage(validImages[selectedImage], 800, 800)}
                alt={`${productName} - صورة ${selectedImage + 1}`}
                fill
                className="object-contain transition-opacity duration-300"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                onLoad={() => setIsLoading(false)}
              />
            </>
          )}
          <div className="absolute top-2 right-2 bg-white/70 rounded-full p-1.5 backdrop-blur-sm shadow-sm transition-opacity duration-300 opacity-70 hover:opacity-100">
            <span className="flex items-center justify-center text-gray-700">
              <FaSearch className="w-4 h-4" />
            </span>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto py-2 scrollbar-hide snap-x">
          {validImages.map((image, index) => (
            <button
              key={index}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border ${
                selectedImage === index
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              } snap-start transition duration-150 transform hover:scale-105`}
              onClick={() => {
                setIsLoading(true)
                setSelectedImage(index)
              }}
              aria-label={`${productName} - صورة ${index + 1}`}
            >
              <Image
                src={optimizeImage(image, 120, 120)}
                alt={`${productName} - صورة مصغرة ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 