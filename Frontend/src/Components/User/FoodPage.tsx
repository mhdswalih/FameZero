import { motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../UserNav&Footer/Navbar";
import { useEffect, useState, useCallback } from "react";
import { fetchHotelProfiles } from "../../Api/userApiCalls/profileApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";

function FoodSection() {
  const navigate = useNavigate();

  interface hotel {
    _id: string;
    userId: string;
    name: string;
    email: string;
    profilepic: string;
    location: {
      type: string;
      coordinates: number[];
      locationName: string;
    };
    city: string;
    phone: string;
    distance?: number;
  }

  interface UserLocation {
    lat: number;
    lon: number;
    city?: string;
    region?: string;
    country?: string;
  }

  const [hotels, setHotels] = useState<hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByDistance, setSortByDistance] = useState(true);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Distance filter options
  const distanceOptions = [
    { label: "All distances", value: null },
    { label: "Within 5km", value: 5 },
    { label: "Within 10km", value: 10 },
    { label: "Within 25km", value: 25 },
    { label: "Within 50km", value: 50 },
    { label: "Within 100km", value: 100 },
    { label: "Within 200km", value: 200 },
  ];

  const user = useSelector((state: RootState) => state.userProfile);
  
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2 ||
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
      Math.abs(lat1) > 90 || Math.abs(lon1) > 180 ||
      Math.abs(lat2) > 90 || Math.abs(lon2) > 180) {
      return Infinity;
    }

    // Convert degrees to radians
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    console.log(lat1,'THIS IS LAT-2');
    console.log(lon1,'THIS IS LON 1');
    console.log(lat2,'THIS IS LAT-2');
    console.log(lon2,'THIS IS LON-2');
 
    
    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);


  useEffect(() => {
    if (hotels.length === 0) return;

    let result = [...hotels];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(hotel =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.city.toLowerCase().includes(query) ||
        hotel.location.locationName.toLowerCase().includes(query)
      );
    }
    if (userLocation) {
      result = result.map(hotel => {
        let hotelLat, hotelLon;

        if (hotel.location && hotel.location.coordinates && hotel.location.coordinates.length >= 2) {
          hotelLon = hotel.location.coordinates[0];
          hotelLat = hotel.location.coordinates[1];
        }
        if (hotelLat && hotelLon) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            hotelLat,
            hotelLon
          );
          return { ...hotel, distance };
        }
        return { ...hotel, distance: undefined };
      });
      if (selectedDistance !== null) {
        result = result.filter(hotel =>
          hotel.distance !== undefined && hotel.distance <= selectedDistance
        );
      }
      if (sortByDistance) {
        result.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
      }
    }

    setFilteredHotels(result);
  }, [hotels, searchQuery, userLocation, sortByDistance, selectedDistance, calculateDistance]);
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

 // Get user's current location
useEffect(() => {
  setLocationLoading(true);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({
          lat: latitude,
          lon: longitude
        });
        setLocationLoading(false);
      },
      async (error) => { 
        setLocationError("Unable to get your location. Using default sorting." + error);
        setLocationLoading(false);

        // Fallback: Try to get location from IP
        try {
          const res = await axios.get("https://apiip.net/api/check", {
            params: { accessKey: "81b33d70-9882-48f9-af27-15d9a757c561" }
          });
          
          const data = res.data; 
          setUserLocation({
            lat: data.latitude, 
            lon: data.longitude,
            city: data.city,
            region: data.region,
            country: data.country_name
          });
        } catch (ipError) {
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  } else {
    setLocationError("Geolocation is not supported by this browser.");
    setLocationLoading(false);
  }
}, []);

  useEffect(() => {
    if (user) {
      getHotels();
    }
  }, [user]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
        mass: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDistance(null);
    setSortByDistance(true);
  };
  const getFilteredCount = () => {
    return filteredHotels.length;
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/4e0c7b6c-3c3f-4f3d-9e3c-3e3f3d3e3c3e/loading.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <div className="w-full max-w-7xl px-4">
          <Navbar />
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="font-['Poppins'] min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative pt-28 md:pt-36 px-4 sm:px-6 lg:px-8 pb-16"
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-amber-400 origin-left z-50"
          style={{ scaleX }}
        />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
          >
            <div className="flex-1">
              <motion.h3
                className="text-2xl sm:text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Food Outlets
              </motion.h3>
              <motion.p
                className="text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {userLocation ?
                  `Discover amazing venues near you` :
                  'Discover amazing venues for your events'
                }
              </motion.p>
              {locationError && (
                <p className="text-amber-600 text-sm mt-1">{locationError}</p>
              )}
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              <motion.div
                variants={itemVariants}
                className="relative w-full md:min-w-[320px] max-w-md"
              >
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          </motion.div>

          {/* Location, Distance Filter and Sort Controls */}
          {userLocation && (
            <motion.div
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 p-4 bg-white rounded-xl shadow-sm gap-4"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">
                  Your location: {userLocation.city
                    ? `${userLocation.city}, ${userLocation.region}, ${userLocation.country}`
                    : `${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}`
                  }
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Distance Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    {selectedDistance ? `Within ${selectedDistance}km` : 'Filter by distance'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 transition-transform ${showDistanceDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDistanceDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    >
                      {distanceOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => {
                            setSelectedDistance(option.value);
                            setShowDistanceDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedDistance === option.value ? 'bg-amber-50 text-amber-600' : 'text-gray-700'
                            }`}
                        >
                          {option.label}
                          {selectedDistance === option.value && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">Sort by:</span>
                  <button
                    onClick={() => setSortByDistance(!sortByDistance)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${sortByDistance
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Distance {sortByDistance ? '✓' : ''}
                  </button>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedDistance !== null || !sortByDistance) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <motion.div
            variants={itemVariants}
            className="mb-6 text-gray-600"
          >
            Showing {getFilteredCount()} of {hotels.length} venues
            {selectedDistance && ` within ${selectedDistance}km`}
            {searchQuery && ` matching "${searchQuery}"`}
          </motion.div>

          {/* Cards Section */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {filteredHotels.map((item, index) => (
              <motion.div
                key={item._id || index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={item.profilepic || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={item.name}
                    className="w-full h-52 sm:h-56 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-amber-300 text-sm">{item.city}</p>
                    {item.distance !== undefined && userLocation && (
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <p className="text-white text-xs">
                          {item.distance < 1
                            ? `${(item.distance * 1000).toFixed(0)}m away`
                            : `${item.distance.toFixed(1)}km away`
                          }
                        </p>
                      </div>
                    )}
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
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.2, type: "spring" }}
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
                      boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)",
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium shadow-md"
                  >
                    Explore Foods
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredHotels.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-44 h-44 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DotLottieReact
                  src="https://lottie.host/5460e5a1-7d15-421b-aa50-b20a756e8246/rfQW8EIefK.lottie"
                  loop
                  autoplay
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No matching venues found
              </h3>
              <p className="text-gray-600 max-w-md mb-4">
                {searchQuery && selectedDistance
                  ? `No venues found matching "${searchQuery}" within ${selectedDistance}km.`
                  : searchQuery
                    ? `No venues found matching "${searchQuery}".`
                    : selectedDistance
                      ? `No venues found within ${selectedDistance}km.`
                      : 'No venues available at the moment.'
                }
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <motion.div
              className="w-24 h-1 bg-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default FoodSection;