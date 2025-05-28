import React from "react";
import { motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Use `useNavigate`

function FoodSection() {
  const navigate = useNavigate(); // ✅ Correct usage
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
  ];

  
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="font-serif bg-orange-350 text-white p-6 relative mt-10"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex justify-between items-center mb-10"
      >
        <div>
          <h3 className="text-2xl font-bold uppercase">Auditorium & Hotels</h3>
          <p className="text-gray-300">Review your selected items.</p>
        </div>
        <div className="mx-3">
          <div className="w-full max-w-sm min-w-[200px] relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-400 shadow-sm focus:shadow-md"
                placeholder="Search for product..."
              />
              <button
                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Circular Progress Indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute top-4 right-6"
      >
    
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(item.rating)].map((_, starIndex) => (
                    <motion.svg
                      key={starIndex}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({item.rating}.0)</span>
              </div>
              <motion.button 
                onClick={() => navigate("/HotelsDetails")}  // ✅ Correct way to navigate
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition duration-300"
                >
                Show Details
                </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll Progress Indicator */}
      <motion.svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        className="fixed top-4 right-4 z-50"
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          stroke="white"
          strokeWidth="4"
          fill="transparent"
          style={{ pathLength: scrollYProgress }}
        />
      </motion.svg>
    </motion.div>
  );
}

export default FoodSection;