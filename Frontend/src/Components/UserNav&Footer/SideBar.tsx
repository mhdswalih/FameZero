import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Home, Building2, Calendar, Star, Users, Settings, CreditCard } from "lucide-react";
import { RootState } from "../../Redux/store";
import { Avatar, MenuItem, Typography } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";

// Simple Sidebar Component
const SidebarContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar");
  }
  return context;
};

const SidebarTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useSidebar();
  return <div onClick={() => setOpen(true)}>{children}</div>;
};

const SidebarContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [location, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with proper z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar with highest z-index */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[1000] ${className}`}
          >
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10 md:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Navigation Menu Items
interface NavMenuItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  badge?: number;
}

// Sidebar Component
export const AppSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  const navMenuItems: NavMenuItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Hotels",
      icon: Building2,
      path: "/hotels",
      badge: 3,
    },
    {
      label: "Bookings",
      icon: Calendar,
      path: "/bookings",
    },
    {
      label: "Reviews",
      icon: Star,
      path: "/reviews",
    },
    {
      label: "Users",
      icon: Users,
      path: "/users",
    },
    {
      label: "Payments",
      icon: CreditCard,
      path: "/payments",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarTrigger>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </SidebarTrigger>

      <SidebarContent className="bg-white p-4">
        {/* App Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center gap-3 pb-6 border-b border-gray-100"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900">
              HotelHub
            </Typography>
            <Typography variant="small" color="gray">
              Admin Panel
            </Typography>
          </div>
        </motion.div>

        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-6 p-4 bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Avatar
              variant="circular"
              size="md"
              alt="User Avatar"
              className="border border-gray-300 w-10 h-10 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            />
            <div className="overflow-hidden">
              <Typography variant="small" className="font-semibold truncate">
                {user.email || "Admin User"}
              </Typography>
              <Typography variant="small" color="gray" className="truncate">
                {user.role || "Administrator"}
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Navigation Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-6"
        >
          <Typography variant="small" className="font-semibold text-gray-700 px-2 mb-2">
            Navigation
          </Typography>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="h-px bg-orange-400 mb-3"
          />
          
          <ul className="space-y-1">
            {navMenuItems.map(({ label, icon: Icon, path, badge }, index) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 * index + 0.25,
                  type: "spring",
                  stiffness: 500,
                  damping: 20
                }}
              >
                <Link to={path}>
                  <MenuItem className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200 group">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-700 group-hover:text-orange-600" />
                      <Typography as="span" variant="small" className="font-medium group-hover:text-orange-800">
                        {label}
                      </Typography>
                    </div>
                    {badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {badge}
                      </span>
                    )}
                  </MenuItem>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-8 p-4 bg-gray-50 rounded-xl"
        >
          <Typography variant="small" className="font-semibold text-gray-700 mb-3">
            Quick Stats
          </Typography>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Typography variant="small" color="gray">
                Today's Bookings
              </Typography>
              <Typography variant="small" className="font-semibold">
                12
              </Typography>
            </div>
            
            <div className="flex justify-between items-center">
              <Typography variant="small" color="gray">
                Pending Reviews
              </Typography>
              <Typography variant="small" className="font-semibold">
                5
              </Typography>
            </div>
            
            <div className="flex justify-between items-center">
              <Typography variant="small" color="gray">
                Occupancy Rate
              </Typography>
              <Typography variant="small" className="font-semibold text-green-600">
                78%
              </Typography>
            </div>
          </div>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;