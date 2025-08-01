import React from "react";
import { motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { FooterWithLogo } from "../UserNav&Footer/Footer";
import Navbar from "../UserNav&Footer/Navbar";

function FoodSection() {
  const navigate = useNavigate(); 
  const items = [
    {
      id: 1,
      title: "Beautiful Chair",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/kam-idris-_HqHX3LBN18-unsplash.jpg",
      rating: 5,
    },
    {
      id: 2,
      title: "Little Sofa",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/spacejoy-NpF_OYE301E-unsplash.jpg",
      rating: 4,
    },
    {
      id: 3,
      title: "Brown Coach",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/michael-oxendine-GHCVUtBECuY-unsplash.jpg",
      rating: 5,
    },
    {
      id: 4,
      title: "Modern Chair",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/kam-idris-_HqHX3LBN18-unsplash.jpg",
      rating: 5,
    },
    {
      id: 5,
      title: "Comfort Sofa",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/spacejoy-NpF_OYE301E-unsplash.jpg",
      rating: 4,
    },
    {
      id: 6,
      title: "Leather Coach",
      image:
        "https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/michael-oxendine-GHCVUtBECuY-unsplash.jpg",
      rating: 5,
    },
  ];

  const { scrollYProgress } = useScroll();
  
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white flex justify-center z-20 ">
        <div className="w-full max-w-screen-xl">
          <Navbar />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="font-serif bg-white text-white p-25  relative pt-28 md:pt-36"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase">Auditorium & Hotels</h3>
            <p className="text-gray-300 text-sm sm:text-base">Review your selected items.</p>
          </div>
        <div className="w-full md:w-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full md:min-w-[280px] max-w-md"
          >
            <input
              className="bg-white/90 backdrop-blur-sm w-full pr-12 h-11 sm:h-12 pl-4 py-2 placeholder:text-gray-500/80 text-gray-800 text-sm sm:text-base border border-gray-300/50 rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400/80 hover:border-gray-400/60 shadow-sm hover:shadow-md focus:shadow-lg"
              placeholder="Search hotels, venues..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute h-9 w-9 right-1 top-1 my-auto flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg shadow-sm hover:shadow-md transition-all"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </motion.button>
            <motion.div 
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-orange-400/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
        </div>
        </motion.div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`} // Fixed duplicate key issue
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-48 sm:h-56 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="p-4 sm:p-5">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">{item.title}</h4>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(item.rating)].map((_, starIndex) => (
                      <motion.svg
                        key={starIndex}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">({item.rating}.0)</span>
                </div>
                <motion.button 
                  onClick={() => navigate("/HotelsDetails")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 sm:mt-4 w-full bg-orange-400 text-white py-1.5 sm:py-2 rounded-lg hover:bg-orange-500 transition duration-300 text-sm sm:text-base"
                >
                  Show Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Indicator - Hidden on mobile */}
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 50 50"
          className="fixed  top-10 right-2 sm:right-4 z-50 hidden sm:block"
        >
          <motion.circle
            cx="25"
            cy="25"
            r="20"
            stroke="orange"
            strokeWidth="4"
            fill="transparent"
            style={{ pathLength: scrollYProgress }}
          />
        </motion.svg>
      </motion.div>
      
      <div className="flex justify-center bg-white text-amber-400">
        <hr className="flex  w-350  pb-20" />
      </div>
    </>
  );
}

export default FoodSection;