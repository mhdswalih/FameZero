import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Save, X, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
}

interface UserEditModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  editedProfile: UserProfile;
  setEditedProfile: (profile: UserProfile) => void;
}

const UserEditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  userProfile,
  setUserProfile,
  editedProfile,
  setEditedProfile
}: UserEditModalProps) => {

  const handleSave = () => {
    setUserProfile({ ...editedProfile });
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditedProfile({ ...userProfile });
    setIsEditModalOpen(false);
  };

  // Add types for field and value
  const handleInputChange = (field: string, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const profileFields = [
    { 
      key: 'name', 
      label: 'Full Name', 
      icon: User, 
      value: editedProfile.name 
    },
    { 
      key: 'email', 
      label: 'Email Address', 
      icon: Mail, 
      value: editedProfile.email 
    },
    { 
      key: 'phone', 
      label: 'Phone Number', 
      icon: Phone, 
      value: editedProfile.phone 
    },
    { 
      key: 'address1', 
      label: 'Address Line 1', 
      icon: MapPin, 
      value: editedProfile.address1 
    },
    { 
      key: 'address2', 
      label: 'Address Line 2', 
      icon: MapPin, 
      value: editedProfile.address2 
    }
  ];

  return (
    <AnimatePresence>
      {isEditModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-300  overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white p-6 border-b border-gray-100 relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-900 p-0.5"
                  />
                  <button className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                  <p className="text-sm text-gray-600">Update your profile information</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {profileFields.map((field, index) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <field.icon className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.key === 'email' ? 'email' : 'text'}
                        value={field.value}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mt-6 pt-4 border-t border-gray-200"
              >
                <button
                  onClick={handleSave}
                  className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserEditModal;