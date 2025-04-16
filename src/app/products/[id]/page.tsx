import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { FaChevronLeft, FaStar, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart, FaCheck, FaTimes, FaCheckCircle, FaTimesCircle, FaBolt, FaLeaf, FaShippingFast } from 'react-icons/fa';
import Image from 'next/image';
import ProductImage from '@/components/ProductImage';
import ProductCard from '@/components/ProductCard';

// Initialize Prisma client
const prisma = new PrismaClient();

// Fetch product details by ID
async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

// Get related products based on category
async function getRelatedProducts(category: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        id: { not: currentProductId }
      },
      take: 4
    });
    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Component for displaying rating stars
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="w-4 h-4 flex items-center justify-center">
          <FaStar
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        </span>
      ))}
      <span className="text-sm font-medium text-gray-500 mr-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// Main product page component
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const relatedProducts = product?.category 
    ? await getRelatedProducts(product.category, params.id) 
    : [];

  if (!product) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">المنتج غير موجود</h1>
          <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            العودة إلى المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition">
              الرئيسية
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/products" className="text-gray-500 hover:text-primary-600 transition">
              المنتجات
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/products?category=${encodeURIComponent(product.category || '')}`} className="text-gray-500 hover:text-primary-600 transition">
              {product.category}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-800 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Product Images */}
        <div className="lg:sticky lg:top-24">
          <ProductImage images={product.images || []} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <RatingStars rating={product.rating} />
                <span className="mr-2 text-sm text-gray-600">
                  ({product.reviewCount} تقييم)
                </span>
              </div>
              {product.inStock ? (
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full flex items-center">
                  <span className="w-4 h-4 flex items-center justify-center ml-1">
                    <FaCheckCircle className="w-3 h-3" />
                  </span>
                  متوفر
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full flex items-center">
                  <span className="w-4 h-4 flex items-center justify-center ml-1">
                    <FaTimesCircle className="w-3 h-3" />
                  </span>
                  غير متوفر
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  جديد
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-primary-600">
                {product.price.toLocaleString('ar-SA')} ريال
              </div>
              {product.oldPrice && (
                <div className="text-lg text-gray-500 line-through">
                  {product.oldPrice.toLocaleString('ar-SA')} ريال
                </div>
              )}
            </div>

            {product.oldPrice && (
              <div className="mb-4">
                <span className="px-3 py-1 text-sm font-medium text-primary-800 bg-primary-100 rounded-full">
                  خصم {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              </div>
            )}

            <div className="prose prose-sm max-w-none text-gray-700 mb-6">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">اللون:</h3>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className="relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-2 ring-primary-500"
                      style={{ backgroundColor: color }}
                    >
                      <span
                        className="h-8 w-8 rounded-full border border-black border-opacity-10"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">الكمية:</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-36 overflow-hidden">
                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 focus:outline-none transition">
                  -
                </button>
                <div className="flex-1 h-10 flex items-center justify-center text-center">1</div>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 focus:outline-none transition">
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <button 
                className={`flex-1 py-4 px-6 rounded-lg font-medium text-white ${
                  product.inStock 
                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500' 
                    : 'bg-gray-400 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center`}
                disabled={!product.inStock}
              >
                <span className="w-5 h-5 flex items-center justify-center ml-2">
                  <FaShoppingCart className="w-4 h-4" />
                </span>
                {product.inStock ? 'إضافة إلى السلة' : 'غير متوفر'}
              </button>
              <button className="flex-1 py-4 px-6 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center">
                <span className="w-5 h-5 flex items-center justify-center ml-2">
                  <FaHeart className="w-4 h-4" />
                </span>
                إضافة إلى المفضلة
              </button>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary-50 border border-primary-100">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <FaLeaf />
                </span>
              </span>
              <span className="font-medium text-gray-800">منتجات طبيعية 100%</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary-50 border border-primary-100">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <FaShippingFast />
                </span>
              </span>
              <span className="font-medium text-gray-800">شحن سريع لجميع المناطق</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary-50 border border-primary-100">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <FaCheckCircle />
                </span>
              </span>
              <span className="font-medium text-gray-800">استبدال خلال 14 يوم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs - Description, Specifications, Reviews */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
            <button className="py-4 px-6 border-b-2 border-primary-600 font-medium text-primary-600 whitespace-nowrap">
              تفاصيل المنتج
            </button>
            <button className="py-4 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
              المواصفات
            </button>
            <button className="py-4 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
              التقييمات ({product.reviewCount})
            </button>
          </nav>
        </div>
        <div className="py-6 bg-white rounded-lg shadow-sm mt-4 p-6 border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <p>{product.description}</p>
            {/* Additional description content would go here */}
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <span className="w-5 h-5 flex items-center justify-center text-primary-600 ml-2 mt-0.5">
                  <FaCheck className="w-4 h-4" />
                </span>
                <span>جودة عالية مضمونة</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 flex items-center justify-center text-primary-600 ml-2 mt-0.5">
                  <FaCheck className="w-4 h-4" />
                </span>
                <span>تم اختباره بعناية</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 flex items-center justify-center text-primary-600 ml-2 mt-0.5">
                  <FaCheck className="w-4 h-4" />
                </span>
                <span>مناسب لجميع أفراد العائلة</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">منتجات مشابهة</h2>
            <Link 
              href={`/products?category=${encodeURIComponent(product.category || '')}`}
              className="flex items-center text-primary-600 hover:text-primary-700 transition"
            >
              عرض المزيد
              <span className="w-5 h-5 flex items-center justify-center mr-1">
                <FaChevronLeft className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 