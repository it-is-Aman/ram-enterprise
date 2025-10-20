import React, { useState, useEffect } from "react";
import { productsAPI } from "../../services";
import { 
  Header, 
  ProductShowcase, 
  RelatedProducts, 
  CompanyInfo, 
  CategoriesSection,
  ProductInquirySection,
  RatingsReviewsSection
} from "../../components/user";
import Footer from "../../components/user/footer";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ==================== PNG Bottle Hero Component ====================
function HeroPNG() {
  const { scrollYProgress } = useScroll();

  // Smooth rotation using spring
  const rotateBottle = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotateBottle, { stiffness: 50, damping: 20 });

  // Bottle scale and opacity
  const scaleBottle = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const smoothScale = useSpring(scaleBottle, { stiffness: 50, damping: 20 });

  const opacityBottle = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const smoothOpacity = useSpring(opacityBottle, { stiffness: 50, damping: 20 });

  // Text animations
  const yText = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const smoothYText = useSpring(yText, { stiffness: 50, damping: 20 });

  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const smoothScaleText = useSpring(scaleText, { stiffness: 50, damping: 20 });

  const opacityText = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const smoothOpacityText = useSpring(opacityText, { stiffness: 50, damping: 20 });

  // Floating animation for bottle
  const floatAnimation = {
    y: ["0%", "-3%", "0%"], // smooth up and down
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden bg-[#ebe9e1]">
      {/* Floating Bottle PNG */}
      <motion.img
        src="/models/bottle image.png"
        alt="Bottle"
        className="absolute w-[30%] md:w-[35%]"
        style={{
          rotate: smoothRotate,
          scale: smoothScale,
          opacity: smoothOpacity,
        }}
        animate={floatAnimation}
      />

      {/* Animated Text */}
      <motion.h1
        style={{ y: smoothYText, scale: smoothScaleText, opacity: smoothOpacityText }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-bold italic text-[#e43d12] z-20 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        ICONIC
      </motion.h1>

      <motion.h2
        style={{ y: smoothYText, scale: smoothScaleText, opacity: smoothOpacityText }}
        className="absolute top-[70%] left-1/2 transform -translate-x-1/2 text-[4rem] md:text-[10rem] font-semibold text-[#e43d12] z-20 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      >
        FUNCTIONALISM
      </motion.h2>
    </div>
  );
}

// ==================== Main HomePage ====================
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
        setImageIndex(0);
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
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (products.length > 0 && currentProductIndex < products.length) {
        const currentProduct = products[currentProductIndex];
        if (currentProduct?.categoryId) {
          try {
            const response = await productsAPI.getAll({
              category: currentProduct.category?.slug,
              limit: 6,
            });
            const filtered =
              response.data?.filter((p) => p.id !== currentProduct.id) || [];
            setRelatedProducts(filtered);
          } catch (error) {
            console.error("Error fetching related products:", error);
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
      <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebe9e1] text-gray-900 font-sans">
      {/* <Header /> */}

      {/* PNG Bottle Hero Section */}
      <HeroPNG />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <div className="lg:col-span-1 space-y-6">
            <RelatedProducts
              relatedProducts={relatedProducts}
              currentProduct={currentProduct}
            />
            {/* <CompanyInfo /> */}
          </div>
        </div>
      </main>

      {/* Categories Section */}
      <div className="py-12 bg-[#e43d12] text-white">
        <CategoriesSection />
      </div>

      {/* Product Inquiry Section */}
      <div className="py-12 bg-[#ebe9e1]">
        <ProductInquirySection />
      </div>

      {/* Ratings & Reviews Section */}
      <div className="py-12 bg-[#e43d12] text-white">
        <RatingsReviewsSection />
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
