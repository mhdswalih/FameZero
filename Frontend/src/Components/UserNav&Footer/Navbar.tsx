import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MenuItem, Avatar, Button, Typography } from "@material-tailwind/react";
import { UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon } from "@heroicons/react/24/solid";
import { RootState } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";
import { getUserDetails, updateUser } from "../../Api/user/profileApi";
import UserEditModal from "../User/Modals/UserEditModeal";

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

  return (
    <div onClick={() => setOpen(true)}>
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
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

// Profile Sheet Component
const ProfileSheet = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  interface UserProfile {
    name: string;
    profilepic: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
  }

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    profilepic: "",
    email: '',
    phone: '',
    address1: '',
    address2: '',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...userProfile });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const profileMenuItems = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      path: "/profile-details",
      onClick: () => navigate('/profile-details')
    },
    {
      label: "Edit Profile",
      icon: Cog6ToothIcon,
      path: '',
      onClick: () => handleEdit()
    },
    {
      label: "Inbox",
      icon: InboxArrowDownIcon,
      path: '',
      onClick: () => console.log("Open inbox")
    },
    {
      label: "Help",
      icon: LifebuoyIcon,
      path: '',
      onClick: () => console.log("Open help")
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
      path: '',
      onClick: handleLogout
    }
  ];

  const handleEdit = () => {
    setEditedProfile({ ...userProfile });
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (selectedFile?: File) => {
    try {
      const response = await updateUser(user._id, editedProfile, selectedFile);
      if (response.data) {
        const updatedProfile = {
          name: response.data.name || editedProfile.name,
          profilepic: response.data.profilepic || editedProfile.profilepic,
          email: response.data.email || editedProfile.email,
          phone: response.data.phone || editedProfile.phone,
          address1: response.data.address1 || editedProfile.address1,
          address2: response.data.address2 || editedProfile.address2,
        };
        setUserProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      }
      toast.success('Profile updated successfully');
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || error.error || 'Failed to update profile');
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await getUserDetails(user._id);
      if (response.data) {
        setUserProfile({
          name: response.data.name || '',
          profilepic: response.data.profilepic || "",
          email: response.data.email || '',
          phone: response.data.phone || '',
          address1: response.data.address1 || '',
          address2: response.data.address2 || '',
        });
      }
    } catch (error: any) {
      toast.error(error.error);
    }
  };

  useEffect(() => {
    if (user._id) {
      handleGetUser();
    }
  }, [user._id]);

  return (
    <Sheet>
      <SheetTrigger>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full py-2 px-3 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          <img
            src={userProfile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Profile
          </span>
        </motion.button>
      </SheetTrigger>

      <SheetContent className="bg-white p-4 w-72">
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
            src={userProfile.profilepic || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'}
          />
          <div>
            <Typography variant="h6" className="font-semibold">
              {userProfile.name}
            </Typography>
            <Typography variant="small" color="gray">
              {userProfile.email}
            </Typography>
          </div>
        </motion.div>

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
            {profileMenuItems.map(({ label, icon: Icon, path, onClick }, index) => (
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
                <button
                  onClick={onClick}
                  className="w-full text-left"
                >
                  <MenuItem className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Icon className="h-5 w-5 text-gray-700" />
                    <Typography as="span" variant="small" className="font-medium">
                      {label}
                    </Typography>
                  </MenuItem>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </SheetContent>
      
      <UserEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        userProfile={userProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        handleEditUser={handleEditUser}
        setUserProfile={setUserProfile}
      />
    </Sheet>
  );
};

// Main Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  interface UserProfile {
    name: string;
    profilepic: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
  }

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    profilepic: "",
    email: '',
    phone: '',
    address1: '',
    address2: '',
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const handleGetUser = async () => {
    try {
      const response = await getUserDetails(user._id);
      if (response.data) {
        setUserProfile({
          name: response.data.name || '',
          profilepic: response.data.profilepic || "",
          email: response.data.email || '',
          phone: response.data.phone || '',
          address1: response.data.address1 || '',
          address2: response.data.address2 || '',
        });
      }
    } catch (error: any) {
      toast.error(error.error);
    }
  };

  useEffect(() => {
    if (user._id) {
      handleGetUser();
    }
  }, [user._id]);

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
        className={`block w-full max-w-screen-xl px-5 py-2 mx-auto text-white bg-white shadow-md rounded-md lg:px-8 lg:py-3 mt-4 top-10 z-30 ${scrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          <button className="lg:hidden rounded-md hover:bg-gray-50">
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          
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
            <span className="italic font-bold">Hey.. {userProfile.name}</span>
            {!isLoggedIn && (
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
            <ProfileSheet />
          </div>
        </div>
      </motion.nav>

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