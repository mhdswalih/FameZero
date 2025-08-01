import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Phone, MapPin, Save, X, Camera, Image, FileText, Hotel
} from 'lucide-react';
import React, { useState } from 'react';

interface hotelDetails {
  name: string;
  profilepic: string;
  phone: string;
  location: string;
  idProof: string;
  city: string;
}

interface HotelEditModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  hotelProfile: hotelDetails;
  setHotelProfile: (profile: hotelDetails) => void;
  editedProfile: hotelDetails;
  setEditedProfile: (profile: hotelDetails) => void;
  handleEditHotel: (selectedFile?: File, idProofFile?: File) => void;
}

const HotelEditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  hotelProfile,
  editedProfile,
  setEditedProfile,
  handleEditHotel
}: HotelEditModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIdProofFile, setSelectedIdProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [idProofPreviewUrl, setIdProofPreviewUrl] = useState<string>('');

  const handleCancel = () => {
    setEditedProfile({ ...hotelProfile });
    setSelectedFile(null);
    setSelectedIdProofFile(null);
    setPreviewUrl('');
    setIdProofPreviewUrl('');
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {

    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
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

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedIdProofFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIdProofPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(selectedFile,selectedIdProofFile,'this is select file images ');
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleEditHotel(selectedFile || undefined, selectedIdProofFile || undefined);
      setSelectedFile(null);
      setSelectedIdProofFile(null);
      setPreviewUrl('');
      setIdProofPreviewUrl('');
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
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80";
  };

  const getIdProofSrc = () => {
    if (idProofPreviewUrl) return idProofPreviewUrl;
    if (editedProfile.idProof) return editedProfile.idProof;
    return null;
  };

  return (
    <AnimatePresence>
      {isEditModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/20 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center p-4 z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white p-6 border-b border-gray-100 relative sticky top-0 z-10">
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
                    alt="Hotel Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 p-0.5"
                  />
                  <label className="absolute bottom-0 right-0 bg-orange-400 text-white p-1 rounded-full shadow-lg hover:bg-orange-500 transition-colors cursor-pointer">
                    <Camera className="h-3 w-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-orange-500" />
                    Edit Hotel Profile
                  </h2>
                  <p className="text-sm text-gray-600">Update your hotel information</p>
                  {selectedFile && (
                    <p className="text-xs text-orange-600 mt-1">
                      New hotel image selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <Building2 className="inline h-4 w-4 mr-2 text-gray-500" />
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Enter hotel name"
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <Phone className="inline h-4 w-4 mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <Image className="inline h-4 w-4 mr-2 text-gray-500" />
                      Hotel Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      disabled={isSubmitting}
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img
                          src={previewUrl}
                          alt="Hotel Preview"
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right Column - Location & Documents */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Location & Documents
                  </h3>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <MapPin className="inline h-4 w-4 mr-2 text-gray-500" />
                      Location/Address
                    </label>
                    <textarea
                      value={editedProfile.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                      placeholder="Enter full hotel address"
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <MapPin className="inline h-4 w-4 mr-2 text-gray-500" />
                      City
                    </label>
                    <input
                      type="text"
                      value={editedProfile.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Enter city name"
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      <FileText className="inline h-4 w-4 mr-2 text-gray-500" />
                      ID Proof Document
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdProofChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500">Upload business license, registration certificate, or valid ID proof</p>
                    
                    {selectedIdProofFile && (
                      <p className="text-xs text-orange-600 mt-1">
                        ID Proof selected: {selectedIdProofFile.name}
                      </p>
                    )}
                    
                    {idProofPreviewUrl && (
                      <div className="mt-2">
                        <img
                          src={idProofPreviewUrl}
                          alt="ID Proof Preview"
                          className="h-20 w-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 mt-8 w-full justify-end pt-6 border-t border-gray-200"
              >
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving Hotel Profile...' : 'Save Hotel Profile'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg font-medium transition-colors text-sm"
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

export default HotelEditModal;