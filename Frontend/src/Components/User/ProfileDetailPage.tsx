import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Edit3, Camera, Settings, Bell, Shield, LogOut, Mail } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { addUserProfile, removeUserProfile } from '../../Redux/Slice/ProfileSlice/userProfileSlice';
import { removeUser } from '../../Redux/Slice/userSlice';
import toast from 'react-hot-toast';
import UserEditModal from '../Modals/User/UserEditModal';
import { getUserDetails, updateUser } from '../../Api/userApiCalls/profileApi';
import { logoutUser } from '../../Api/userApiCalls/userApi';
import PreviewModal from '../Modals/User/PreviewModal';
import { checkGender } from '../../Utils/genderApi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import UserCombinedLayout from '../UserNav&Footer/SideBar';

interface userDetails {
  _id: string
  name: string;
  email: string,
  profilepic: string;
  phone: string;
  address: string;
  city: string;
}

interface userEditDetails {
  _id: string;
  name: string;
  email: string;
  profilepic: string;
  phone: string;
  address: string;
  city: string;
}



const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userDetails = useSelector((state: RootState) => state.userProfile)
  const [previewModal, setPreviewModal] = useState(false)
  const [genderAvatar, setGenderAvatar] = useState('')
  const user = useSelector((state: RootState) => state.user);
  const [userProfile, setUserProfile] = useState<userDetails>({
    _id: '',
    name: '',
    email: '',
    profilepic: '',
    phone: '',
    address: '',
    city: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editedProfile, setEditedProfile] = useState<userEditDetails>({ ...userProfile });

  const handleLogout = async () => {
    dispatch(removeUser());
    dispatch(removeUserProfile());
    if (user.id) {
      const welcomeShowModalKey = `welcomeModal_${user.id}`;
      localStorage.removeItem(welcomeShowModalKey);
    }
    await logoutUser()
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleEditUser = async (selectedFile?: File) => {
    try {
      const response = await updateUser(user.id as string, editedProfile, selectedFile);
      if (response.data) {
        const updatedProfile: any = {
          _id: response.data._id || editedProfile._id,
          name: response.data.name || editedProfile.name,
          email: response.data.email || editedProfile.email,
          profilepic: response.data.profilepic || editedProfile.profilepic,
          phone: response.data.phone || editedProfile.phone,
          address: response.data.address || editedProfile.address,
          city: response.data.city || editedProfile.city,
        };

        setUserProfile(updatedProfile);
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
          _id: response.data._id || '',
          name: response.data.name || '',
          email: response.data.email || '',
          profilepic: response.data.profilepic || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
        };

        setUserProfile(profileData);
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

  const handleGender = async () => {
    try {
      const response = await checkGender(userDetails.name)
      if (response === 'male') {
        setGenderAvatar("https://lottie.host/d8572536-f4a3-495d-96c6-3b3dc6a95e2a/uMgS3Dm2WV.lottie")
      } else if (response === 'female') {
        setGenderAvatar("https://lottie.host/94a1cbbe-6527-452a-97f1-e4283cf8e852/oylN6XXz7G.lottie")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetUser();
    handleGender()
  }, []);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
  }, [user.id]);

  const profileMenuItems = [
    { label: 'Account Settings', icon: Settings, onClick: () => { navigate('/settings') } },
    { label: 'Notifications', icon: Bell, onClick: () => { } },
    { label: 'Privacy & Security', icon: Shield, onClick: () => { } },
    { label: 'Sign Out', icon: LogOut, onClick: handleLogout },
  ];

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Determine which image to show
  const profileImageUrl = userProfile.profilepic 
  const hasProfilePic = userProfile.profilepic && userProfile.profilepic.trim() !== '';

  return (
    <>
    <UserCombinedLayout>
    <div className="min-h-screen overflow-auto bg-gray-50">
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6">
          <div className="flex items-center justify-between h-19.5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <div className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
              <img
                onClick={() => setPreviewModal(true)}
                src={profileImageUrl}
                alt="User Avatar"
                className="border-2 border-gray-900 p-0.5 w-8 h-8 rounded-full object-cover cursor-pointer"
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
                    {/* Show Lottie animation if no profile pic */}
                    {!hasProfilePic && genderAvatar && (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-900 p-0.5">
                        <DotLottieReact
                        className='w-full h-full'
                         onClick={() => setPreviewModal(true)}
                          src={genderAvatar}
                          loop
                          autoplay
                        />
                      </div>
                    )}

                    {/* Show profile image if it exists */}
                    {hasProfilePic && (
                      <img
                        onClick={() => setPreviewModal(true)}
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-900 p-0.5 cursor-pointer"
                      />
                    )}

                    {/* Camera button */}
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
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a href={`tel:${userProfile.phone}`} className="text-sm sm:text-base text-gray-900 hover:text-orange-400">
                          {userProfile.phone || '+917034683567'}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${userProfile.email}`} className="text-sm sm:text-base text-gray-900 hover:text-orange-400">
                          {userProfile.email}
                        </a>
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
      <PreviewModal
        previewImg={userProfile.profilepic}
        onClose={() => setPreviewModal(false)}
        open={previewModal}
      />
    </div>
     </UserCombinedLayout>
    </>
  );
};

export default ProfilePage;