import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../../../FireBase/config";
import toast from "react-hot-toast";
import {phoneAuth} from "../../../Api/userApiCalls/userApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../Redux/Slice/userSlice";
import { addUserProfile } from "../../../Redux/Slice/ProfileSlice/userProfileSlice";
import { addHotelProfile } from "../../../Redux/Slice/ProfileSlice/hotelProfileSlice";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'phone' | 'otp' | 'details';

const PhoneAuthModal = ({ isOpen, onClose }: PhoneAuthModalProps) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('phone');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'user',
    emailVerificationLoading: false
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return;

    const initializeRecaptcha = () => {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => {
            console.log('reCAPTCHA expired - resetting');
            initializeRecaptcha();
          }
        });
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        toast.error("Failed to initialize security check");
      }
    };

    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      setCurrentStep('phone');
    };
  }, [isOpen]);

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = `+${phone.replace(/\D/g, '')}`;
      setPhone(formattedPhone)
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier!
      );
      setConfirmation(confirmationResult);
      setCurrentStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error("OTP error:", error);
      toast.error(`Failed to send OTP: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await confirmation?.confirm(otp);
      setCurrentStep('details');
      toast.success('Phone number verified!');
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(`OTP verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDetails = async () => {
    if (!formData.name ) {
      toast.error('Please fill all required fields');
      return;
    }
    const contryCodeCombainedPhone = `+91${phone}`
    setIsLoading(true);
    try {
      const response = await phoneAuth(formData.name, contryCodeCombainedPhone,formData.role);
      dispatch(addUser({
        id: response.user?.id || '',
        email: response.user?.email || '',
        role: response.user?.role || '',
        token: response?.accessToken || null
      }))
      dispatch(addUserProfile({
        profilepic: response.user?.profilepic || '',
        phone: response.user?.phone || '',
        address: response.user?.address || '',
        city: response.user?.city || ''
      }))
      dispatch(addHotelProfile({
        profilepic: response.user?.prifilepic || '',
        role: response.user?.role || '',
        status: response.user?.status || '',
        idProof: response.user?.idProof || '',
        phone: response.user?.phone || '',
        location: response.user?.location || '',
        city: response.user?.city || '',
      }))

      toast.success(response.message)
      setTimeout(() => {
        if (response.user?.role === 'hotel') {
          navigate('/hotel/landing-page')
        } else if (response.user?.role === 'user') {
          navigate('/')
        } else {
          toast.error('No access')
        }
      }, 1000)
      toast.success('Registration successful!');

      onClose();
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            ×
          </button>

          <div id="recaptcha-container" className="hidden"></div>

          <div className="p-6">
            {/* Phone Number Step */}
            {currentStep === 'phone' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">Verify Phone Number</h2>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent transition-all">
                    <span className="bg-gray-100 px-3 py-2">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="1234567890"
                      className="flex-1 px-3 py-2 outline-none"
                      maxLength={15}
                    />
                  </div>
                </div>
                <motion.button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors duration-500 font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </motion.button>
              </div>
            )}

            {/* OTP Verification Step */}
            {currentStep === 'otp' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">Enter OTP</h2>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">6-digit Code</label>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    maxLength={6}
                  />
                </div>
                <motion.button
                  onClick={verifyOtp}
                  disabled={isLoading}
                  className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors duration-500 font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </motion.button>
              </div>
            )}

            {/* User Details Step */}
            {currentStep === 'details' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">Complete Your Profile</h2>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Register As *</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={handleInputChange}
                         className="h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">User</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="hotel"
                        checked={formData.role === 'hotel'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Hotel</span>
                    </label>
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmitDetails}
                  disabled={isLoading} 
                  className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors duration-500 font-medium mt-4"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Submitting...' : 'Complete Registration'}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhoneAuthModal;