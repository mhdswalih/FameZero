import { useDispatch } from "react-redux";
import { logout } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";
import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon } from "@heroicons/react/24/solid";
import { RootState } from "../../Redux/store";

// Simple Sheet Component
const SheetContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => { },
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
  return <div onClick={() => setOpen(true)}>{children}</div>;
};

const SheetContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, setOpen } = useSheet();
  
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
            className="fixed inset-0  bg-opacity-50 z-[999]"
            onClick={() => setOpen(false)}
          />
          
          {/* Sheet with highest z-index */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[1000] ${className}`}
          >
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
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

// Profile Menu Items
interface ProfileMenuItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  onClick?: () => void;
}

// Profile Sheet Component
const ProfileSheet = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const profileMenuItems: ProfileMenuItem[] = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      path: "/profile-details",
      onClick: () => {
        navigate("/profile-details");
      }
    },
    {
      label: "Edit Profile",
      icon: Cog6ToothIcon,
      path: '',
      onClick: () => {
        console.log("Open edit profile");
      }
    },
    {
      label: "Inbox",
      icon: InboxArrowDownIcon,
      path: '',
      onClick: () => {
        console.log("Open inbox");
      }
    },
    {
      label: "Help",
      icon: LifebuoyIcon,
      path: '',
      onClick: () => {
        console.log("Open help");
      }
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
      path: '',
      onClick: handleLogout
    }
  ];

  return (
    <Sheet>
      <SheetTrigger>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full py-2 px-3 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Profile
          </span>
        </motion.button>
      </SheetTrigger>

      <SheetContent>
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                alt="User Avatar"
                className="w-16 h-16 rounded-full object-cover border-3 border-orange-400 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.name || "John Doe"}
              </h3>
              <p className="text-sm text-gray-600">
                {user.email || "john.doe@example.com"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">24</div>
              <div className="text-xs text-gray-600">Orders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-xs text-gray-600">Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">5.0</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Account Settings
          </h4>
          
          <ul className="space-y-1">
            {profileMenuItems.map(({ label, icon: Icon, onClick }, index) => (
              <li key={label}>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClick}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 group ${
                    label === "Sign Out" 
                      ? "hover:bg-red-50 hover:border-red-200 border border-transparent" 
                      : "hover:bg-orange-50 hover:border-orange-200 border border-transparent"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-colors duration-200 ${
                    label === "Sign Out" 
                      ? "text-red-500 group-hover:text-red-600" 
                      : "text-gray-600 group-hover:text-orange-600"
                  }`} />
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    label === "Sign Out" 
                      ? "text-red-700 group-hover:text-red-800" 
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}>
                    {label}
                  </span>
                  {label !== "Sign Out" && (
                    <svg 
                      className="ml-auto h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Version 2.1.0 • Made with ❤️
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;