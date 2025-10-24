import { motion, AnimatePresence } from 'framer-motion';

import {
  User, Phone, MapPin, Save, X, Camera, Image,
  Mail,
} from 'lucide-react';
import React, { useState } from 'react';
import { isDeepEqual } from '../../../utils/is-equal';
import toast from 'react-hot-toast';
import { isEmailVerified, verifyEmailOtp } from '../../../Api/userApiCalls/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';


interface userDetails {
  _id: string;
  name: string;
  email: string;
  profilepic: string;
  phone: string;
  address: string;
  city: string;
}

interface UserEditModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  userProfile: userDetails;
  setUserProfile: (profile: userDetails) => void;
  editedProfile: userDetails;
  setEditedProfile: (profile: userDetails) => void;
  handleEditUser: (selectedFile?: File) => void
}

const UserEditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  userProfile,
  editedProfile,
  setEditedProfile,
  handleEditUser
}: UserEditModalProps) => {

  const id = useSelector((state: RootState) => state.user.id)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isEmailVerified: false,
    emailVerificationCode: '',
    showEmailCodeInput: false,
    emailVerificationLoading: false,
    emailChanged: false
  });

  const handleCancel = () => {
    setEditedProfile({ ...userProfile });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });

    // Track if email is being changed
    if (field === 'email') {
      setFormData(prev => ({
        ...prev,
        emailChanged: value !== userProfile.email
      }));
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modified handleSubmit function
  const handleSubmit = async () => {
    // Check if email is being changed and needs verification
    if (editedProfile.email !== userProfile.email && !formData.isEmailVerified) {
      toast.error("Please verify your email before saving");
      return;
    }

    setIsSubmitting(true);
    try {
      if (userProfile) {
        const currentFormState = {
          name: editedProfile.name,
          phone: editedProfile.phone,
          address: editedProfile.address,
          profilepic: editedProfile.profilepic,
          city: editedProfile.city,
        }

        if (isDeepEqual(userProfile, currentFormState) &&
          !selectedFile) {
          toast.error("User profile already updated - no changes detected!");
          return;
        }
      }
      await handleEditUser(selectedFile || undefined);

      setSelectedFile(null);
      setPreviewUrl('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getImageSrc = () => {
    if (previewUrl) return previewUrl;
    if (editedProfile.profilepic) return editedProfile.profilepic;
    return "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80";
  };

  const handleInputChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmailCode = async () => {
    if (!editedProfile.email) {
      toast.error('Please enter an email address');
      return;
    }
    try {
      setFormData(prev => ({ ...prev, emailVerificationLoading: true }));
      await isEmailVerified(editedProfile.email);
      setFormData(prev => ({
        ...prev,
        showEmailCodeInput: true,
        emailVerificationLoading: false
      }));
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      setFormData(prev => ({ ...prev, emailVerificationLoading: false }));
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    }
  }


  const handleVerifyEmail = async () => {
    try {
      await verifyEmailOtp(id as string, editedProfile.email, formData.emailVerificationCode);
      setFormData(prev => ({
        ...prev,
        isEmailVerified: true,
        showEmailCodeInput: false,
        emailVerificationLoading: false
      }));
      toast.success('Email verified successfully!');
    } catch (error: any) {
      setFormData(prev => ({ ...prev, emailVerificationLoading: false }));
      toast.error(error.response?.data?.message || 'Invalid verification code');
    }
  }
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white p-6 border-b border-gray-100 relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={getImageSrc()}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-900 p-0.5"
                  />
                  <label className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors cursor-pointer">
                    <Camera className="h-3 w-3" />
                    <input
                      type="file"
                      accept="image/*"
                      // value={selectedFile?.name}
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                  <p className="text-sm text-gray-600">Update your profile information</p>
                  {selectedFile && (
                    <p className="text-xs text-orange-600 mt-1">
                      New image selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - 4 fields */}
                <div className="lg:col-span-3 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <User className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                  {!userProfile.email && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <Mail className="h-5 w-5 text-gray-700 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={editedProfile.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                            disabled={formData.isEmailVerified || isSubmitting}
                          />
                          {!formData.isEmailVerified && (
                            <button
                              type="button"
                              onClick={handleSendEmailCode}
                              disabled={!editedProfile.email || formData.emailVerificationLoading}
                              className="bg-orange-400 text-white px-3 py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
                            >
                              {formData.emailVerificationLoading ? 'Sending...' : 'Verify'}
                            </button>
                          )}
                        </div>

                        {formData.isEmailVerified ? (
                          <p className="text-green-500 text-sm mt-1">✓ Email verified</p>
                        ) : formData.showEmailCodeInput && (
                          <div className="mt-2 space-y-2">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                name="emailVerificationCode"
                                value={formData.emailVerificationCode}
                                onChange={handleInputChangeEmail}
                                placeholder="Enter 6-digit code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyEmail}
                                disabled={!formData.emailVerificationCode || formData.emailVerificationLoading}
                                className="bg-orange-400 text-white px-3 py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
                              >
                                {formData.emailVerificationLoading ? 'Verifying...' : 'Confirm'}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">We've sent a verification code to your email</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}


                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <Image className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <Phone className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - 2 fields */}
                <div className="lg:col-span-2 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <MapPin className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editedProfile.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <MapPin className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={editedProfile.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-end pt-4 border-t border-gray-200"
              >
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting ||
                    (formData.emailChanged && !formData.isEmailVerified)}
                  className={`w-full sm:w-auto ${(formData.emailChanged && !formData.isEmailVerified) ?
                      'bg-gray-400 cursor-not-allowed' :
                      'bg-orange-400 hover:bg-orange-500'
                    } text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                  {(formData.emailChanged && !formData.isEmailVerified) && (
                    <span className="text-xs ml-2">(Verify email first)</span>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium transition-colors"
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