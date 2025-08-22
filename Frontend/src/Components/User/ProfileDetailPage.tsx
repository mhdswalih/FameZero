import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Edit3, Camera, Settings, Bell, Shield, LogOut, Mail } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { addUserProfile, removeUserProfile } from '../../Redux/Slice/ProfileSlice/userProfileSlice';
import { addUser, removeUser } from '../../Redux/Slice/userSlice';
import toast from 'react-hot-toast';
import UserEditModal from '../Modals/User/UserEditModal';
import { getUserDetails, updateUser } from '../../Api/userApiCalls/profileApi';
import { logoutUser } from '../../Api/userApiCalls/userApi';

interface userDetails {
  _id:string
  name: string;
  email:string,
  profilepic: string;
  phone: string;
  address: string;
  city: string; 
}

interface userEditDetails {
  _id:string;
  name: string;
  email:string;
  profilepic: string;
  phone: string;
  address: string;
  city: string;
}

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userDetails = useSelector((state:RootState)=> state.userProfile)
  const user = useSelector((state: RootState) => state.user);
  const [userProfile, setUserProfile] = useState<userDetails>({
    _id:'',
    name: '',
    email:'',
    profilepic: '',
    phone: '',
    address: '',
    city: '',
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editedProfile, setEditedProfile] = useState<userEditDetails>({ ...userProfile });

  const handleLogout = async() => {
    dispatch(removeUser());
    dispatch(removeUserProfile());
    await logoutUser()
    toast.success('Logged out successfully');
    navigate('/');
  };
 
  const handleEditUser = async (selectedFile?: File) => {
  
    try { 
      const response = await updateUser( user.id as string, editedProfile, selectedFile);
      if (response.data) {
        const updatedProfile: any = {
          _id:response.data._id || editedProfile._id,
          name: response.data.name || editedProfile.name,
          email:response.data.email || editedProfile.email,
          profilepic: response.data.profilepic || editedProfile.profilepic,
          phone: response.data.phone || editedProfile.phone,
          address: response.data.address || editedProfile.address,
          city: response.data.city || editedProfile.city,
        };
        
        setUserProfile(updatedProfile);
    //     dispatch(addUser({
    //   id: response.data._id || user.id,
    //   email: response.data.email,
    //   role: response.data.role || 'user', 
    //   token: response.token 
    // }));
        dispatch(addUserProfile(updatedProfile));
      
        toast.success('Profile updated successfully');
        setIsEditModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || error.error || 'Failed to update profile');
    }
  };

  const handleGetUser = async () => {    
    try {
      const response = await getUserDetails(user.id as string);  
      if (response.data) {
        const profileData = {
          _id:response.data._id || '',
          name: response.data.name || '',
          email:response.data.email || '',
          profilepic: response.data.profilepic || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
        };
        
        setUserProfile(profileData);
  //       dispatch(addUser({
  //    id: response.data._id || user.id,
  //    email: response.data.email,
  //    role: response.data.role || 'user', 
  //    token: response.token 
  //  }));
        dispatch(addUserProfile(profileData));
        setEditedProfile((prev: any) => ({
          ...prev,
          ...profileData,
        }));
      }
    } catch (error: any) {
      toast.error(error.error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
  }, [user.id]);

  const profileMenuItems = [
    { label: 'Account Settings', icon: Settings, onClick: () => { navigate('/settings') } },
    { label: 'Notifications', icon: Bell, onClick: () => {} },
    { label: 'Privacy & Security', icon: Shield, onClick: () => {} },
    { label: 'Sign Out', icon: LogOut, onClick: handleLogout },
  ];

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <div className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
              <img
                src={userProfile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                alt="User Avatar"
                className="border-2 border-gray-900 p-0.5 w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{userProfile.name}</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-arrow-left">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 5 5 12 12 19" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <img
                      src={userProfile.profilepic || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                      alt="Profile"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-900 p-0.5"
                    />
                    <button className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{userProfile.email}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">Last login: 2 hours ago</span>
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="mt-3 sm:mt-0 bg-orange-400 hover:bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Edit Profile</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                           <a href={`tel:${userProfile.phone}`}>
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm sm:text-base text-gray-900">{userProfile.phone || '+917034683567'}</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm sm:text-base text-gray-900">{userProfile.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="text-sm sm:text-base text-gray-900">
                          <p>{userProfile.address || 'Not provided'}</p>
                          <p>{userProfile.city || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {profileMenuItems.map(({ label, icon: Icon, onClick }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={onClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-gray-900">{label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <UserEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        handleEditUser={handleEditUser}
      />
    </div>
  );
};

export default ProfilePage;