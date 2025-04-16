'use client'

import React, { useState, useEffect, FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLeaf, FaShippingFast, FaCheckCircle, FaChevronLeft, FaShoppingCart, FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { PrismaClient } from '@prisma/client';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImage } from '@/utils/cloudinary';

// Initialize Prisma client
const prisma = new PrismaClient();

// Fetch featured products from database
async function getFeaturedProducts() {
  try {
    // Get the 4 most recent products with a good rating
    const products = await prisma.product.findMany({
      where: {
        rating: {
          gte: 4
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 4
    });
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Fetch categories with product counts
async function getCategories() {
  try {
    // Get list of distinct categories
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });
    
    // Format into UI-friendly objects
    return categories.map(cat => ({
      id: cat.category,
      name: cat.category,
      count: cat._count.category,
      // Default image, would be better to have category images in a separate table
      image: '/images/placeholder.jpg'
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Features section data
const features = [
  {
    id: 1,
    title: 'منتجات طبيعية 100%',
    description: 'جميع منتجاتنا مصنوعة من مكونات طبيعية خالية من المواد الكيميائية الضارة',
    icon: <span className="w-8 h-8 flex items-center justify-center"><FaLeaf /></span>
  },
  {
    id: 2,
    title: 'شحن سريع',
    description: 'نوفر خدمة شحن سريعة لجميع مناطق المملكة لضمان وصول منتجاتك في أسرع وقت',
    icon: <span className="w-8 h-8 flex items-center justify-center"><FaShippingFast /></span>
  },
  {
    id: 3,
    title: 'جودة مضمونة',
    description: 'نضمن لك جودة عالية لجميع منتجاتنا مع إمكانية الاستبدال خلال 14 يوم',
    icon: <span className="w-8 h-8 flex items-center justify-center"><FaCheckCircle /></span>
  }
];

// Hero Slider data
const heroSlides = [
  {
    id: 1,
    title: "منتجات عضوية طبيعية",
    subtitle: "استمتع بجمال البشرة مع منتجاتنا العضوية الطبيعية 100%",
    buttonText: "تسوق الآن",
    buttonLink: "/products",
    secondaryButtonText: "تعرف علينا",
    secondaryButtonLink: "/about",
    image: "https://res.cloudinary.com/demo/image/upload/v1699123456/hero-1.jpg",
    bgGradient: "from-green-900/80 to-green-700/60"
  },
  {
    id: 2,
    title: "مجموعة العناية بالبشرة",
    subtitle: "منتجات فاخرة للعناية بالبشرة من مكونات طبيعية نقية",
    buttonText: "اكتشف المجموعة",
    buttonLink: "/products?category=skincare",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    image: "https://res.cloudinary.com/demo/image/upload/v1699123457/hero-2.jpg",
    bgGradient: "from-amber-900/80 to-amber-700/60"
  },
  {
    id: 3,
    title: "عروض خاصة",
    subtitle: "خصم 25% على منتجات الشعر العضوية لفترة محدودة",
    buttonText: "احصل على الخصم",
    buttonLink: "/products?category=hair&discount=true",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    image: "https://res.cloudinary.com/demo/image/upload/v1699123458/hero-3.jpg",
    bgGradient: "from-blue-900/80 to-blue-700/60"
  }
];

// Hero Slider Component
const HeroSlider: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Auto-advance slides every 5 seconds if not hovering
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div 
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <Image 
                  src={optimizeImage(slide.image, { width: 1920, height: 1080 })}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} mix-blend-multiply`} />
              </div>
              
              {/* Content */}
              <div className="relative h-full w-full flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl text-right">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-lg md:text-xl text-white/90 mb-8"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex flex-wrap gap-4 justify-end"
                    >
                      <Link 
                        href={slide.buttonLink}
                        className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 inline-block"
                      >
                        {slide.buttonText}
                      </Link>
                      {slide.secondaryButtonText && (
                        <Link 
                          href={slide.secondaryButtonLink}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 inline-block"
                        >
                          {slide.secondaryButtonText}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        aria-label="Previous slide"
      >
        <FaArrowRight className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        aria-label="Next slide"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-0 left-0 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default async function HomePage() {
  // Fetch real data from the database
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  
  // Function to handle cart action (executed client-side)
  const handleAddToCart = () => {
    // This will be handled by the parent Layout component
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'سارة محمد',
      location: 'الرياض',
      rating: 5,
      text: '"منتجات رائعة وطبيعية بالكامل، استخدمت كريم الترطيب وشعرت بفرق كبير في بشرتي. أنصح الجميع بتجربتها!"'
    },
    {
      id: 2,
      name: 'أحمد خالد',
      location: 'جدة',
      rating: 5,
      text: '"جودة المنتجات ممتازة والشحن سريع جداً. استلمت طلبي في أقل من يومين. سأعود للشراء مرة أخرى بالتأكيد!"'
    },
    {
      id: 3,
      name: 'نورة عبدالله',
      location: 'الدمام',
      rating: 5,
      text: '"أحب فكرة المنتجات الطبيعية 100% وخالية من المواد الضارة. ملاحظ الفرق في استخدام منتجات جذور مقارنة بالمنتجات الأخرى."'
    }
  ];

  // Helper function to parse product images
  const getProductImage = (product) => {
    try {
      if (!product.images) return '/images/placeholder.jpg';
      
      // Try parsing as JSON array first
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]; // Return first image
      }
      // If it's a JSON string but not an array
      return product.images;
    } catch (e) {
      // If it's a regular string URL
      return product.images;
    }
  };

  return (
    <main className="pb-12">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden">
        <HeroSlider />
      </section>

      {/* Summer Sale Banner Slider */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[50vh] md:h-[70vh] w-full">
          <Image 
            src="https://res.cloudinary.com/dzojb8n5o/image/upload/v1744797856/%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA_%D8%A7%D9%84%D8%B5%D9%8A%D9%81_%D8%B1%D8%A7%D9%87%D9%8A_%D8%A8%D8%AF%D8%A7%D8%A7%D8%A7%D8%AA_1_fimty1.png" 
            alt="تخفيضات الصيف راهي بدااات"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end md:items-center justify-start p-8 md:p-16">
            <div className="max-w-lg">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-2xl md:text-4xl font-bold text-primary-800 mb-2">تخفيضات الصيف</h2>
                <p className="text-primary-700 text-lg md:text-xl mb-4">خصومات تصل إلى 50% على منتجات مختارة</p>
                <Link 
                  href="/products?sale=true" 
                  className="inline-block bg-primary-700 text-white hover:bg-primary-800 transition-colors px-6 py-3 rounded-lg font-bold text-lg"
                >
                  تسوق الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div key={feature.id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all text-center">
                <span className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  {feature.icon}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">تسوق حسب الفئة</h2>
              <p className="text-gray-600">اكتشف مجموعتنا المتنوعة من المنتجات الطبيعية عبر الفئات المختلفة</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.id)}`}
                  className="group overflow-hidden rounded-xl relative shadow-md hover:shadow-lg transition-all"
                >
                  <div className="relative h-60 w-full">
                    <Image 
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="opacity-90">{category.count} منتجات</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">منتجات مميزة</h2>
                <p className="text-gray-600 mt-2">اكتشف أفضل منتجاتنا المختارة خصيصاً لك</p>
              </div>
              <Link 
                href="/products" 
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium group"
              >
                عرض الكل
                <span className="inline-block mr-2 rtl:rotate-180 transform group-hover:-translate-x-1 transition-transform">
                  <span className="w-4 h-4 flex items-center justify-center"><FaChevronLeft /></span>
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                  <Link href={`/products/${product.id}`} className="block relative h-48 overflow-hidden">
                    <Image 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`w-4 h-4 flex items-center justify-center ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                            <FaStar />
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 mr-2">({product.reviews})</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-lg font-bold mb-1 text-gray-900 hover:text-primary-600">{product.name}</h3>
                    </Link>
                    <p className="text-gray-700 text-sm mb-3">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary-600">{product.price.toLocaleString('ar-DZ')} د.ج</span>
                      <button 
                        onClick={handleAddToCart}
                        className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
                        aria-label="إضافة إلى السلة"
                      >
                        <FaShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">آراء عملائنا</h2>
            <p className="text-gray-600">ماذا يقول عملاؤنا عن منتجاتنا الطبيعية؟</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">انضم إلى قائمتنا البريدية</h2>
            <p className="text-gray-600 mb-8">
              اشترك ليصلك كل جديد عن منتجاتنا وعروضنا الحصرية
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
} 