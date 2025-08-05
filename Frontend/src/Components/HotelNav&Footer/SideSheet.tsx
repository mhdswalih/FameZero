import { useDispatch } from "react-redux";
import { removeUser } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";
import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon } from "@heroicons/react/24/solid";
import { RootState } from "../../Redux/store";
import { Avatar, MenuItem, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { editHotelProfile, getHotels } from "../../Api/hotelApiCalls/hotelProfileApi";
import { addHotelProfile, removeHotelProfile } from "../../Redux/Slice/ProfileSlice/hotelProfileSlice";
import HotelEditModal from "../User/Modals/Hotel/HotelEditModal";

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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
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
const HotelProfileSheet = () => {
  const user = useSelector((state: RootState) => state.user);
  const hotelprofile = useSelector((state: RootState) => state.hotelProfile)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  interface HotelProfile {
    name: string;
    status:string;
    idProof: string;
    profilepic: string;
    phone: string;
    location: string;
    city: string;
  }
  const [hotelProfile, setHotelProfile] = useState<HotelProfile>({
    name: '',
    idProof: '',
    status:'',
    profilepic: "",
    phone: '',
    location: '',
    city: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<HotelProfile>({ ...hotelprofile });
  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(removeHotelProfile())
    navigate('/hotel/landing-page');
    toast.success('Logged out successfully');


  };
  const id = user.id
  const handleGetHotel = async () => {
    try {
      const response = await getHotels(id);
      if (response.data) {
        const updatedProfile = {
          name: response.data.name || '',
          status:response.data.status || '',
          profilepic: response.data.profilepic || '',
          idProof: response.data.idProof || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          city: response.data.city || '',
        };
        setHotelProfile(updatedProfile);
        dispatch(addHotelProfile(updatedProfile))
      }
    } catch (error: any) {
      toast.error(error.error);
    }
  };

  const handleEditHotel = async (selectedFile?: File, selectedIdProofFile?: File) => {
    try {
      const response = await editHotelProfile(id, editedProfile, selectedFile, selectedIdProofFile);
      // Check the actual response structure
      if (response && response.success) {
        const updatedProfile = {
          name: response.name || editedProfile.name,
          status:response.status || editedProfile.status,
          profilepic: response.profilepic || editedProfile.profilepic,
          phone: response.phone || editedProfile.phone,
          location: response.location || editedProfile.location,
          idProof: response.idProof || editedProfile.idProof,
          city: response.city || editedProfile.city,
        };

        setHotelProfile(updatedProfile);
        dispatch(addHotelProfile(updatedProfile));
        setEditedProfile(updatedProfile);

        toast.success('Profile updated successfully');
        setIsEditModalOpen(false);
      }
    } catch (error: any) {
      console.error('Error in handleEditHotel:', error);
      toast.error(error.message || error.error || 'Failed to update profile');
    }
  };

  useEffect(() => {
    handleGetHotel()
  }, [])

   useEffect(() => {
    setEditedProfile({ ...hotelProfile });
  }, [hotelProfile]);

  const profileMenuItems: ProfileMenuItem[] = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      path: "/hotel-profile-page",
      onClick: () => {
        navigate("/hotel/hotel-profile-page");
      }
    },
    {
      label: "Edit Profile",
      icon: Cog6ToothIcon,
      path: '',
      onClick: () => {
        setIsEditModalOpen(true)
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
            src={hotelprofile.profilepic}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Profile
          </span>
        </motion.button>
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
            src={hotelprofile.profilepic ? hotelprofile.profilepic : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'}
          />
          <div>
            <Typography variant="h6" className="font-semibold">
              {hotelprofile.name}
            </Typography>
            <Typography variant="small" color="gray">
              {user.email}
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
                {onClick ? (
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
                ) : (
                  <Link to={path}>
                    <MenuItem className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Icon className="h-5 w-5 text-gray-700" />
                      <Typography as="span" variant="small" className="font-medium">
                        {label}
                      </Typography>
                    </MenuItem>
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      <HotelEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setHotelProfile={setHotelProfile}
        hotelProfile={hotelProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        handleEditHotel={handleEditHotel}
        />
      </SheetContent>
     

      
    </Sheet>
  );
};

export default HotelProfileSheet;