import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone, MapPin, Edit3,
  Settings, Bell, Shield, LogOut, Mail,
  TimerIcon,
  RefreshCcwIcon,
  Plus,
 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { removeUser } from '../../Redux/Slice/userSlice';
import toast from 'react-hot-toast';
import { addProducts, editHotelProfile, getHotels, reRequstOption } from '../../Api/hotelApiCalls/hotelProfileApi';
import HotelEditModal from '../Modals/Hotel/HotelEditModal';
import { addHotelProfile, removeHotelProfile } from '../../Redux/Slice/ProfileSlice/hotelProfileSlice';
import { VerifiedIcon, InfoIcon } from 'lucide-react';
import SocketService from '../../Utils/socket-service';
import ProductModal from '../Modals/Hotel/Products/ProductModal';
import HotelCombinedLayout from '../HotelNav&Footer/Sidebar';

interface HotelProfile {
  _id: string;
  name: string;
  email: string;
  profilepic: string;
  status: string;
  idProof: string;
  phone: string;
  location: {
    type: string;
    coordinates: number[];
    locationName : string;
  };
  city: string;
}

interface IProductsDetails {
  category: string;
  customCategory: string;
  productName: string;
  price: string;
  quantity: string;
  _id: string;
}

const HotelProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [product, setProducts] = useState<IProductsDetails[]>([])

  const user = useSelector((state: RootState) => state.user);
  const hotelprofile = useSelector((state: RootState) => state.hotelProfile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelProfile, setHotelProfile] = useState<HotelProfile>({
    _id: '',
    name: '',
    email: '',
    profilepic: "",
    status: '',
    phone: '',
    location: {
      type: 'Point',
      coordinates: [],
      locationName : '',
    },
    idProof: '',
    city: '',
  });
 
  const [editedProfile, setEditedProfile] = useState<HotelProfile>({ ...hotelProfile });

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(removeHotelProfile());
    toast.success('Logged out successfully');
    navigate('/hotel/landing-page');
  };



  const id = user.id;
  const handleEditHotel = async (selectedFile?: File, selectedIdProofFile?: File) => {
    try {
      const response = await editHotelProfile(id as string, editedProfile, selectedFile, selectedIdProofFile);
      if (response && response.success) {
        const updatedProfile = {
          _id: response._id || editedProfile._id,
          name: response.name || editedProfile.name,
          email: response.data.email || editedProfile.email,
          status: response.status || editedProfile.status,
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
      toast.error(error.message || error.error || 'Failed to update profile');
    }
  };

  const reRequst = async (id: string) => {
    try {
      await reRequstOption(id);
      await handleGetHotel();
    } catch (error: any) {
      // toast.error(error.message || error.error);
    }
  };


  const handleSaveProducts = async (updatedProducts: IProductsDetails[]) => {
    try {
      const response = await addProducts(updatedProducts, id);
      setProducts(updatedProducts);
      toast.success(response?.message);
      setProducts([])
    } catch (error: any) {

      toast.error(error.message || error.error);
    }
  };
  const handleGetHotel = async () => {
    try {
      const response = await getHotels(id as string);
      if (response.data) {
        const updatedProfile = {
          _id: response.data._id || '',
          name: response.data.name || '',
          email: response.data.email || '',
          status: response.data.status || '',
          profilepic: response.data.profilepic || '',
          idProof: response.data.idProof || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          city: response.data.city || '',
        };
        setHotelProfile(updatedProfile);
        dispatch(addHotelProfile(updatedProfile));
        setEditedProfile(updatedProfile);
      }
    } catch (error: any) {
      // toast.error(error.message || error.error || 'Failed to get profile');
    }
  };


  const handleStatusUpdate = useCallback(async (data: { id: string; status: string; timestamp?: string }) => {
    try {
      await handleGetHotel();
      toast.success(`Status updated to: ${data.status}`);
    } catch (error) {
      console.error("Failed to refresh hotel data:", error);
    }
  }, []);
  const token = useSelector((state: RootState) => state.user.token)
  useEffect(() => {
    const socketService = SocketService.getInstance();
    
    if (!socketService.isConnected()) {
      socketService.connect({
        role: 'hotel', token,
        id: hotelprofile.userId
      });
    }

    socketService.on("hotel-status-changed", handleStatusUpdate);
    if (socketService.isConnected()) {
      socketService.joinHotelRoom(hotelProfile._id);
    } else {
      const handleConnect = () => {
        socketService.joinHotelRoom(hotelProfile._id);
      };
      socketService.once("connect", handleConnect);
    }


    // Cleanup function
    return () => {
      const socketService = SocketService.getInstance();
      socketService.off("hotel-status-changed", handleStatusUpdate);
      socketService.off("room-joined");
    };
  }, [hotelProfile._id, handleStatusUpdate]);

  // Initial data fetch
  useEffect(() => {
    if (user.id) {
      handleGetHotel();
    }
  }, [user.id]);

  useEffect(() => {
    setEditedProfile({ ...hotelProfile });
  }, [hotelProfile]);

  // Profile menu items
  const profileMenuItems = [
    { label: 'Account Settings', icon: Settings, path: '', onClick: () => navigate('/hotel/settings') },
    { label: 'Notifications', icon: Bell, path: '' },
    { label: 'Privacy & Security', icon: Shield, path: '' },
    { label: 'Sign Out', icon: LogOut, path: '/', onClick: () => handleLogout() },
  ];

  const handleEdit = () => {
    setEditedProfile({ ...hotelProfile });
    setIsEditModalOpen(true);
  };

  return (
    <>
    <HotelCombinedLayout>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between h-20 px-6">
            <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>

            {/* Profile Display */}
            <div className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
              <img
                src={hotelProfile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                alt="User Avatar"
                className="border-2 border-gray-900 p-0.5 w-8 h-8 rounded-full object-cover"
                />
              <span className="text-sm font-medium text-gray-700">{hotelProfile.name}</span>
            </div>
          </div>
        </header>

       
        <main className="p-6">
          <div className="flex justify-between items-center mb-4">
            {/* Arrow at the start */}
            <div onClick={() => navigate(-1)} className="flex cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 5 5 12 12 19" />
              </svg>
            </div>

            {/* Add Product button at the end */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium"
              onClick={() => setIsProductModalOpen(true)}
            >
              Add Product
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {hotelProfile.status === 'Pending' && (
                    <div className="relative">
                      <img
                        src={hotelprofile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                        alt="Profile"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-orange-400 p-0.5"
                      />
                      <button className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors">
                        <TimerIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                  {hotelProfile.status === 'Approved' && (
                    <div className="relative">
                      <img
                        src={hotelprofile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                        alt="Profile"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-green-600 p-0.5"
                      />
                      <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full shadow-lg hover:bg-green-700 transition-colors">
                        <VerifiedIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                  {hotelProfile.status === 'Rejected' && (
                    <div className="relative">
                      <img
                        src={hotelprofile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                        alt="Profile"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-red-600 p-0.5"
                      />
                      <button className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                        <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{hotelProfile.name}</h3>
                    <p className="text-gray-600">{hotelProfile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {hotelProfile.status === 'Pending' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400 text-white">
                          Pending
                        </span>
                      )}
                      {hotelProfile.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          Verified <VerifiedIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                        </span>
                      )}
                      {hotelProfile.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                          Rejected <InfoIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>

                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={handleEdit}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                    {hotelProfile.status === 'Rejected' && (
                      <div>
                        <button onClick={() => reRequst(hotelProfile._id)} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2'>
                          <RefreshCcwIcon />Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <a href={`tel:${hotelProfile.phone}`}>
                          <Phone className="h-4 w-4 text-gray-50" />
                          <span className="text-gray-900">{hotelProfile.phone}</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{hotelProfile.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="text-gray-900">
                          <p>{ hotelProfile.location.locationName}</p>
                          <p>{hotelProfile.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {profileMenuItems.map(({ label, icon: Icon, path, onClick }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <Link
                    to={path || "#"}
                    onClick={e => {
                      if (onClick) {
                        e.preventDefault();
                        onClick();
                      }
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900">{label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
         
      </div>

      {/* User Edit Modal */}
      <HotelEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setHotelProfile={setHotelProfile}
        hotelProfile={hotelProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        handleEditHotel={handleEditHotel}
      />

      <ProductModal
        setProducts={setProducts}
        products={product}
        setIsProductModalOpen={setIsProductModalOpen}
        isProductModalOpen={isProductModalOpen}
        handleSaveProducts={handleSaveProducts}
      />
    </div>
    </HotelCombinedLayout>
        </>
  );
};

export default HotelProfilePage;