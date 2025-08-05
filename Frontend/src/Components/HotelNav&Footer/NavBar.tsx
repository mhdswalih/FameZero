import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { getUserDetails } from "../../Api/userApiCalls/profileApi";
import toast from "react-hot-toast";
import { motion } from 'framer-motion'
import { Menu } from "lucide-react";
import { Button } from "@material-tailwind/react";
import HotelProfileSheet from "./SideSheet";


const NavBar = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });
  const isLoggIn = useSelector((state: RootState) => state.user.id)
  const hotelProfile = useSelector((state: RootState) => state.hotelProfile)

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 10,
            mass: 0.2,
            delay: 0.6
          }
        }}
        exit={{ y: -100, opacity: 0 }}
        className={`block w-full max-w-screen-xl px-5 py-2 mx-auto text-white bg-white shadow-md rounded-md lg:px-8 lg:py-3 mt-4  top-10 z-30 ${scrolled ? "shadow-lg" : "shadow-md"
          }`}
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">

          <button
            className="lg:hidden  rounded-md hover:bg-gray-50"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          <motion.a
            href="/hotel/landing-page"
            className="mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="/img/Screenshot_2025-02-13_150449-removebg-preview.png"
              className="w-30 h-10"
              alt="Logo"
            />
          </motion.a>
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {[
                { name: "Home", path: "/hotel/landing-page" },
                { name: "Food", path: "/food-section" },
                { name: "Blocks", path: "#" },
                { name: "About", path: "/about-page" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center p-1 text-sm gap-x-2 text-slate-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={item.path}
                    className="flex items-center hover:text-orange-500 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            {hotelProfile && hotelProfile.name && (
              <span className="italic font-bold">Hey.. {hotelProfile.name}</span>
            )}
            {!hotelProfile.name && (
              <Button
                onClick={() => navigate("/login")}
                size="sm"
                variant="text"
                className="focus:outline-none"
                aria-label="Log in"
              >
                <span>Log In</span>
              </Button>
            )}
            <HotelProfileSheet />
          </div>
          </div>
      </motion.nav>

      {/* Chat Bot - This should be outside the nav */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 10
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Chat Bot</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="h-48 overflow-y-auto mb-4">
                <p className="text-sm text-gray-600">Hello! How can I help you today?</p>
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default NavBar;