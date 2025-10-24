import {  motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../HotelNav&Footer/NavBar";
import { useEffect, useState } from "react";
import { fetchHotelProfiles } from "../../Api/userApiCalls/profileApi";
import {} from 'react-icons'

function HotelFoodSections() {
  const navigate = useNavigate(); 
  interface hotel {
    _id:string;
    userId:string;
    name:string;
    email:string;
    profilepic:string;
    location: {
      type: string;
      coordinates: number[];
      locationName: string;
    };
    city:string;
    phone:string;
  }
  const [hotels,setHotels] = useState<hotel[]>([]);  
  const getHotels = async () => {
    try {
      const response = await fetchHotelProfiles();
      if (Array.isArray(response?.hotels)) {
        setHotels(response.hotels);
      } else if (Array.isArray(response)) {
        setHotels(response);
      } else {
        setHotels([]);
      }
    } catch (error) {
      setHotels([]); 
    }
  };

  useEffect(()=>{
    getHotels()
  },[])
  const { scrollYProgress } = useScroll();

 
  
  return (
    <>
      <div className="fixed top-0 left-0 w-full  flex justify-center z-50 ">
        <div className="w-full max-w-7xl px-4">
           <Navbar /> 
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="font-['Poppins'] min-h-screen bg-gradient-to-br from-orange-50 to-orange-100   relative pt-28 md:pt-36 px-4 sm:px-6 lg:px-8 pb-16"
      >
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
          >
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Hotel Food Sections</h3>
              <p className="text-gray-600 mt-2">Discover amazing venues for your events</p>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-4">
              {/* Add Button */}
              <motion.button
                onClick={() => navigate('/hotel/add-food')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Go to Add Product Page
              </motion.button>

              {/* Search Input */}
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full md:min-w-[320px] max-w-md"
                >
                  <input
                    className="bg-white w-full pr-12 h-12 pl-5 py-2 placeholder:text-gray-500 text-gray-800 text-base border border-gray-300 rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-3 focus:ring-amber-400/40 focus:border-amber-500 hover:border-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="Search hotels, venues..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute h-10 w-10 right-1 top-1 my-auto flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-sm hover:shadow-md transition-all"
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
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.isArray(hotels) && hotels.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={item.profilepic || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={item.name}
                    className="w-full h-52 sm:h-56 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-amber-300 text-sm">{item.city}</p>
                  </div>
                </div>
                
                <div className="p-5">
                    <h4 className="text-lg font-semibold text-black truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, starIndex) => (
                        <motion.svg
                          key={starIndex}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(120 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{item.location.locationName}</span>
                  </div>
                  
                  <motion.button 
                    onClick={() => navigate(`/explore-food/${item.userId}`)}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium shadow-md"
                  >
                    Explore Foods
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {hotels.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-0.5M5 21H3m2 0h0.5M5 21h14M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No venues available</h3>
              <p className="text-gray-600 max-w-md">We couldn't find any hotels or auditoriums at the moment. Please check back later.</p>
            </motion.div>
          )}
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div 
          className="fixed top-24 right-4 z-40 hidden lg:block"
          style={{ scale: scrollYProgress }}
          initial={{ scale: 0 }}
        >
          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HotelFoodSections;