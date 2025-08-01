import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone, MapPin, Edit3, Camera,
  Settings, Bell, Shield, LogOut, Mail
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { removeUser } from '../../Redux/Slice/userSlice';
import toast from 'react-hot-toast';
import {  editHotelProfile, getHotels } from '../../Api/hotel/hotelProfileApi';
import HotelEditModal from '../User/Modals/Hotel/HotelEditModal';
import { addHotelProfile } from '../../Redux/Slice/ProfileSlice/hotelProfileSlice';


interface HotelProfile {
  name: string;
  profilepic: string;
  idProof:string;
  phone: string;
  location: string;
  city: string;
}

const HotelProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const hotelprofile = useSelector((state : RootState) => state )
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize userProfile state
  const [hotelProfile, setHotelProfile] = useState<HotelProfile>({
    name: '',
    profilepic: "",
    phone: '',
    location: '',
    idProof:'',
    city: '',
  });

  const [editedProfile, setEditedProfile] = useState<HotelProfile>({ ...hotelProfile });

  const handleLogout = () => {
    dispatch(removeUser());
    toast.success('Logged out successfully');
    navigate('/hotel/landing-page');
  };
 const id = user.id

 console.log(id,'this is id from hotel edit profile ');
 
const handleEditHotel = async (selectedFile?: File, selectedIdProofFile?: File) => {   
  try {
    const response = await editHotelProfile(id, editedProfile, selectedFile, selectedIdProofFile);
    console.log('API Response:', response);
    
    // Check the actual response structure
    if (response && response.success) {
      const updatedProfile = {
        name: response.name || editedProfile.name,
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
  const handleGetHotel = async () => { 
    try {
      const response = await getHotels(id);    
      if (response.data) {
        const updatedProfile = {
          name: response.data.name || '',
          profilepic: response.data.profilepic || '',
          idProof :response.data.idProof || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          city: response.data.city || '',
        };
        setHotelProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      }
    } catch (error:any) {
       toast.error(error.message || error.error || 'Failed to get profile');
    }
  };

  useEffect(() => {
      handleGetHotel();
  }, []);
 
   useEffect(() => {
    setEditedProfile({ ...hotelProfile });
  }, [hotelProfile]);
  // Profile menu items
  const profileMenuItems = [
    { label: 'Account Settings', icon: Settings, path: '' },
    { label: 'Notifications', icon: Bell, path: '' },
    { label: 'Privacy & Security', icon: Shield, path: '' },
    { label: 'Sign Out', icon: LogOut, path: '/', onClick: () => handleLogout() },
  ];

  const handleEdit = () => {
    setEditedProfile({ ...hotelProfile });
    setIsEditModalOpen(true);
  };

  return (
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
          <div className="flex items-center justify-between h-16 px-6">

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

        {/* Main Content Area */}
        <main className="p-6">
          <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-arrow-left">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 5 5 12 12 19" />
            </svg>
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
                 <div className="relative">
                    <img
                      src={hotelProfile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                      alt="Profile"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-900 p-0.5"
                    />
                    <button className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{hotelProfile.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <span className="text-sm text-gray-500">Last login: 2 hours ago</span>
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{hotelProfile.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="text-gray-900">
                          <p>{hotelProfile.location}</p>
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
                  onClick={onClick}
                >
                  <Link to={path}>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
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
    </div>
  );
};

export default HotelProfilePage;