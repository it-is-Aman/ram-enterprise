import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services';
import { 
  Header, 
  ProductShowcase, 
  RelatedProducts, 
  CompanyInfo, 
  CategoriesSection,
  ProductInquirySection,
  RatingsReviewsSection 
} from '../../components/user';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  // Auto-rotate products every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > 0) {
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
        setImageIndex(0); // Reset image index when product changes
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getFeatured(12);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch related products when current product changes
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (products.length > 0 && currentProductIndex < products.length) {
        const currentProduct = products[currentProductIndex];
        if (currentProduct?.categoryId) {
          try {
            const response = await productsAPI.getAll({
              category: currentProduct.category?.slug,
              limit: 6
            });
            const filtered = response.data?.filter(p => p.id !== currentProduct.id) || [];
            setRelatedProducts(filtered);
          } catch (error) {
            console.error('Error fetching related products:', error);
          }
        }
      }
    };

    fetchRelatedProducts();
  }, [currentProductIndex, products]);

  const currentProduct = products[currentProductIndex];
  const currentImages = currentProduct?.images || [];

  const nextImage = () => {
    if (currentImages.length > 1) {
      setImageIndex((prev) => (prev + 1) % currentImages.length);
    }
  };

  const prevImage = () => {
    if (currentImages.length > 1) {
      setImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Showcase - Left Side */}
          <div className="lg:col-span-2">
            <ProductShowcase 
              currentProduct={currentProduct}
              currentImages={currentImages}
              imageIndex={imageIndex}
              setImageIndex={setImageIndex}
              nextImage={nextImage}
              prevImage={prevImage}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <RelatedProducts 
              relatedProducts={relatedProducts}
              currentProduct={currentProduct}
            />
            <CompanyInfo />
          </div>
        </div>
      </main>

      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Product Inquiry Section */}
      <ProductInquirySection />
      
      {/* Ratings & Reviews Section */}
      <RatingsReviewsSection />
    </div>
  );
};

export default HomePage;
