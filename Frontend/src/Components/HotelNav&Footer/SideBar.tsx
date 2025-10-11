import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { removeUser } from "../../Redux/Slice/userSlice";
import { removeHotelProfile } from "../../Redux/Slice/ProfileSlice/hotelProfileSlice";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ListOrderedIcon } from "lucide-react";

interface ISidebar {
  children?: ReactNode;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  onClick?: () => void;
}

const SideBar = ({ children }: ISidebar) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const hotelProfile = useSelector((state: RootState) => state.hotelProfile);

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(removeHotelProfile());
    navigate("/hotel/landing-page");
    toast.success("Logged out successfully");
  };

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      icon: UserCircleIcon,
      path: "/hotel/hotel-profile-page",
      onClick: () => {
        setActiveItem("Profile");
        navigate("/hotel/hotel-profile-page");
      },
    },
    {
      label: "Edit Profile",
      icon: Cog6ToothIcon,
      path: "/hotel/edit-profile",
      onClick: () => {
        setActiveItem("Edit Profile");
        navigate("/hotel/edit-profile");
      },
    },
    {
      label: "Inbox",
      icon: InboxArrowDownIcon,
      path: "/hotel/inbox",
      onClick: () => {
        setActiveItem("Inbox");
        navigate("/hotel/inbox");
      },
    },
    {
      label: "Order List",
      icon: ListOrderedIcon,
      path: "/hotel/order-page",
      onClick: () => {
        setActiveItem("Order List");
        navigate("/hotel/order-page");
      },
    },
    {
      label: "Help",
      icon: LifebuoyIcon,
      path: "/hotel/help",
      onClick: () => {
        setActiveItem("Help");
        navigate("/hotel/help");
      },
    },
    {
      label: "Logout",
      icon: PowerIcon,
      path: "",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative bg-white border-r border-gray-200 shadow-lg"
      >
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 z-10 bg-orange-500 text-white rounded-full p-1.5 shadow-md hover:bg-orange-600 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </motion.button>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <motion.div
            className="flex items-center gap-3"
            animate={{
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            <motion.img
              src={
                hotelProfile.profilepic ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-sm"
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {hotelProfile.name || "Hotel Name"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 group relative
                hover:scale-[1.02] hover:shadow-sm
                ${
                  activeItem === item.label
                    ? "bg-orange-50 text-orange-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {/* Active Indicator */}
              {activeItem === item.label && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-orange-500 rounded-r-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              <item.icon
                className={`
                  w-5 h-5 flex-shrink-0
                  ${
                    activeItem === item.label
                      ? "text-orange-600"
                      : "text-gray-600 group-hover:text-orange-500"
                  }
                `}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      text-sm font-medium
                      ${
                        activeItem === item.label
                          ? "text-orange-600"
                          : "text-gray-700 group-hover:text-orange-600"
                      }
                    `}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <p className="text-xs text-orange-800 font-medium">
                Need assistance?
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Contact support 24/7
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default SideBar;