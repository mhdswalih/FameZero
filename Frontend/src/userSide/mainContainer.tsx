import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

interface CarouselImage {
  src: string;
  alt: string;
}

const CarouselWithText: React.FC = () => {
  const carouselImages: CarouselImage[] = [
    { src: "/img/sp.png", alt: "Special photography collection" },
    { src: "/img/bfst.png", alt: "Breakfast menu highlights" },
    { src: "/img/brni.png", alt: "Brunch special items" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout>();

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    resetAutoSlide();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    resetAutoSlide();
  };

  const startAutoSlide = () => {
    autoSlideRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
  };

  const resetAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    startAutoSlide();
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing content: ${carouselImages[activeIndex].alt}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 max-w-7xl mx-auto"
    >
      {/* Left Side - Custom Carousel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: false, amount: 0.2 }}
        className="relative flex items-center justify-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left Arrow - Only visible on hover */}
        <motion.button
          onClick={handlePrev}
          className="absolute left-0 z-10 bg-white/30 text-white p-2 rounded-full hover:bg-black/70 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Current Image */}
        <img
          src={carouselImages[activeIndex].src}
          alt={carouselImages[activeIndex].alt}
          className="rounded-xl max-h-[400px] w-full object-contain"
          loading="lazy"
        />

        {/* Right Arrow - Only visible on hover */}
        <motion.button
          onClick={handleNext}
          className="absolute right-0 z-10 bg-white/30 text-white p-2 rounded-full hover:bg-black/70 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Right Side - Text Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: false, amount: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold text-white italic">
          Discover Stunning Visuals
        </h2>
        <p className="text-white italic">
          "Explore breathtaking images captured by professional photographers.
          Let these visuals inspire your creativity and bring fresh ideas to your projects."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-bold italic"
          >
            Learn More
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white border-2 border-white rounded-lg hover:bg-orange-700 transition font-bold italic"
          >
            Explore
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
              initial={{ x: -5 }}
              animate={{ x: 5 }}
              transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
            >
              <path d="M9 18l6-6-6-6" />
            </motion.svg>
          </motion.button>
        </div>

        {/* Share Options */}
        <div className="pt-4">
          <p className="text-white/80 mb-2 italic">Share this:</p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => shareOnSocial('twitter')}
              className="p-2 bg-orange-500/80 text-white rounded-full hover:bg-orange-600 transition"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => shareOnSocial('facebook')}
              className="p-2 bg-orange-500/80 text-white rounded-full hover:bg-orange-600 transition"
              aria-label="Share on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => shareOnSocial('linkedin')}
              className="p-2 bg-orange-500/80 text-white rounded-full hover:bg-orange-600 transition"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => shareOnSocial('copy')}
              className="flex items-center gap-1 px-3 py-2 bg-orange-500/80 text-white rounded-full hover:bg-orange-600 transition text-sm"
              aria-label="Copy link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CarouselWithText;