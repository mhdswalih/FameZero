import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { MenuItem, Avatar, Button, Typography } from "@material-tailwind/react";
import { UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon } from "@heroicons/react/24/solid";

// Custom Sheet Component Implementation
const SheetContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

const Sheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a Sheet");
  }
  return context;
};

const SheetTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useSheet();
  
  // if (React.isValidElement(children)) {
  //   return React.cloneElement(children, {
  //     onClick: (e: React.MouseEvent) => {
  //       children.props.onClick?.(e);
  //       e.stopPropagation();
  //       setOpen(true);
  //     }
  //   });
  // }

  return (
    <div onClick={(e) => {
      e.stopPropagation();
      setOpen(true);
    }}>
      {children}
    </div>
  );
};

interface SheetContentProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

const SheetContent = ({
  children,
  side = "right",
  className = "",
}: SheetContentProps) => {
  const { open, setOpen } = useSheet();

  const variants = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            className={`fixed z-50 bg-white p-6 shadow-lg ${className}`}
            style={{
              [side]: 0,
              top: 0,
              width: side === "left" || side === "right" ? "320px" : "100%",
              height: side === "top" || side === "bottom" ? "auto" : "100%",
              maxWidth: "85vw",
            }}
            initial={variants[side]}
            animate={{ x: 0, y: 0 }}
            exit={variants[side]}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 0.5
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Profile Menu Items
interface ProfileMenuItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const profileMenuItems: ProfileMenuItem[] = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Edit Profile", icon: Cog6ToothIcon },
  { label: "Inbox", icon: InboxArrowDownIcon },
  { label: "Help", icon: LifebuoyIcon },
  { label: "Sign Out", icon: PowerIcon },
];

// Profile Sheet Component
const ProfileSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto focus:outline-none"
          aria-label="User profile"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="User Avatar"
            className="border-2 border-gray-900 p-0.5 w-8 h-8 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-white p-4 w-72">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center gap-4 pb-4 border-b border-gray-100"
        >
          <Avatar
            variant="circular"
            size="lg"
            alt="User Avatar"
            className="border-2 border-gray-900 w-12 h-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <div>
            <Typography variant="h6" className="font-semibold">
              John Doe
            </Typography>
            <Typography variant="small" color="gray">
              john.doe@gmail.com
            </Typography>
          </div>
        </motion.div>

        {/* Menu Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4"
        >
          <Typography variant="small" className="font-semibold text-gray-700 px-2 mb-2">
            Profile Menu
          </Typography>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="h-px bg-orange-400 mb-3"
          />

          <ul className="space-y-1">
            {profileMenuItems.map(({ label, icon: Icon }, index) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.05 * index + 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 20
                }}
              >
                <MenuItem 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Icon className="h-5 w-5 text-gray-700" />
                  <Typography as="span" variant="small" className="font-medium">
                    {label}
                  </Typography>
                </MenuItem>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

// Main Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  return (
    <>
    <motion.nav
  initial={{ y: -100, opacity: 0 }}  // Start from above (-100px)
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
  exit={{ y: -100, opacity: 0 }}  // Exit upwards
  className={`block w-full max-w-screen-xl px-5 py-2 mx-auto text-white bg-white shadow-md rounded-md lg:px-8 lg:py-3 mt-4  top-10 z-30 ${
    scrolled ? "shadow-lg" : "shadow-md"
  }`}
>
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          <motion.a 
            href="/" 
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
                { name: "Home", path: "/" },
                { name: "Food", path: "/FoodSection" },
                { name: "Blocks", path: "#" },
                { name: "About", path: "/About" },
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
            <Button 
              onClick={() => navigate("/login")} 
              size="sm" 
              variant="text"
              className="focus:outline-none"
              aria-label="Log in"
            >
              <span>Log In</span>
            </Button>
            <ProfileSheet />
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

export default Navbar;