import { useState, useRef, useEffect } from 'react';
import { resendOtp, verifyOtpAndCreateUser } from '../../Api/userApiCalls/userApi';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  
  const location = useLocation()
  const email = location.state?.email
  const userData = location.state?.userData
  const navigate = useNavigate()
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index < otp.length - 1 && inputs.current[index + 1]) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputs.current[index - 1]) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleBack = () =>{
    navigate(-1)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, otp.length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < otp.length) {
          newOtp[i] = pasteData[i];
        }
      }
      setOtp(newOtp);
    }
  };


const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const code = otp.join('');

    // Ensure all OTP digits are filled
    if (otp.every(digit => digit !== '')) {
      const response = await verifyOtpAndCreateUser(email, code, userData);

     
      setOtp([""])
      toast.success(response?.message || 'Your account has been created successfully');
       setTimeout(()=>{
         navigate('/Login')
       },1000)
    } else {
      toast.error('Please enter the complete OTP');
    }

  } catch (error: any) {
    
    toast.error(error.error);
  } finally {
    setIsLoading(false);
  }
};



  const handleResend = async() => {
    try {
        if (canResend) {
      setTimer(60);
      setCanResend(false);
      const response = await resendOtp(email)
         toast.success(response?.message);
    }
    } catch (error:any) {
       toast.error(error.error);
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={handleBack} className="mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-center flex-1 mr-10">VERIFICATION</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="text-center mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Sent a verification code to verify<br />your Email
          </h2>
          <p className="text-gray-400 text-sm">
            Sent to {email}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mb-12">
          {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            className={`w-16 h-16 text-center text-2xl font-medium border-b-2 bg-transparent outline-none transition-all duration-200 ${
              digit 
                ? 'border-orange-500 text-gray-900' 
                : 'border-gray-200 text-gray-600 focus:border-orange-500'
            }`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => {
              inputs.current[index] = el;
            }}
          />
          ))}
        </div>

        {/* Resend Section */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm mb-2">Didn't get code yet?</p>
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-orange-500 font-medium text-sm"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-gray-400 text-sm">
              Resend OTP in {timer}s
            </span>
          )}
        </div>

        {/* Verify Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isLoading}
            className={`w-full max-w-xs py-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
              isComplete && !isLoading
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'VERIFY'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;