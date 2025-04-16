import Link from 'next/link'
import Image from 'next/image'
import { FaStar, FaShoppingCart } from 'react-icons/fa'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images?: string
  category?: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  let imageUrl = '/images/placeholder.jpg'
  
  // Try to parse images if they exist
  if (product.images) {
    try {
      const images = JSON.parse(product.images)
      if (Array.isArray(images) && images.length > 0) {
        imageUrl = images[0]
      }
    } catch (e) {
      console.error('Error parsing product images:', e)
    }
  }

  // Display helper function for rating stars
  const renderRatingStars = (rating = 0) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative">
          <Image
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold py-1 px-4 rounded-full bg-red-600 text-sm">نفذت الكمية</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          {product.category && (
            <p className="text-xs text-gray-500 font-medium">{product.category}</p>
          )}
          <h3 className="mt-1 text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
          {product.rating ? (
            <div className="mt-1 flex items-center">
              {renderRatingStars(product.rating)}
              {product.reviewCount && (
                <span className="text-xs text-gray-500 mr-2">({product.reviewCount})</span>
              )}
            </div>
          ) : null}
          <p className="mt-2 text-xl font-bold text-primary-600">{product.price.toLocaleString('ar-DZ')} د.ج</p>
        </div>
      </Link>
      
      <button 
        className="absolute bottom-24 left-3 bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-primary-50"
        aria-label="أضف إلى السلة"
      >
        <span className="w-5 h-5 flex items-center justify-center text-primary-600">
          <FaShoppingCart />
        </span>
      </button>
    </div>
  )
}