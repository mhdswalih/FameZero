import { useState } from "react";
import {  googleLogin, loginUser } from "../../Api/userApiCalls/userApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../Redux/Slice/userSlice";
import { addUserProfile } from "../../Redux/Slice/ProfileSlice/userProfileSlice";
import { addHotelProfile } from "../../Redux/Slice/ProfileSlice/hotelProfileSlice";
import { GoogleLogin } from '@react-oauth/google'
import { ForgetPassword } from "../ForgetPassword/ForgetPassword";
import PhoneAuthModal from "../Modals/PhoneAuthModal/PhoneAuthModal";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [passwordModal,setPasswordModal] = useState(false)
  const [phoneModal,setPhoneModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password)
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
        userId:response.user?._id || '',
        profilepic: response.user?.prifilepic || '',
        role: response.user?.role || '',
        status: response.user?.status || '',
        idProof: response.user?.idProof || '',
        phone: response.user?.phone || '',
        location: response.user?.location || '',
        city: response.user?.city || '',
      }))
      
      toast.success(response.message)
      if(!response.user?.name){
        navigate('/login')
      }
      setTimeout(() => {
        if (response.user?.role === 'hotel') {
          navigate('/hotel/landing-page')
        } else if (response.user?.role === 'user') {
          navigate('/')
        } else {
          toast.error('No access')
        }
      }, 1000)
    } catch (error: any) {  
      toast.error(error.error);
      navigate('/login')  
    }
  };
 

  const handleGoogleLogin = async (credentialResponse: any) => {
  const decode = credentialResponse.credential
  setGoogleToken(decode);

  setIsModalOpen(true);
};

const handleRoleSelect = async (selectedRole: 'user' | 'hotel') => {
  if (!googleToken) {
    toast.error('Authentication failed');
    setIsModalOpen(false); 
    return;
  }
  try {
    const response = await googleLogin(googleToken, selectedRole);
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

    toast.success(response.message);
    setIsModalOpen(false); 
     
    setTimeout(() => {
      if (response.user?.role === 'hotel') {
        navigate('/hotel/landing-page');
      } else {
        navigate('/');
      }
    }, 1000);

  } catch (error: any) {
    toast.error(error.message || 'Login failed');
    setIsModalOpen(false); 
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating food icons */}
        <div className="absolute top-20 left-1/4 text-4xl animate-bounce opacity-30" style={{ animationDelay: '0.5s' }}>🍕</div>
        <div className="absolute top-32 right-1/4 text-3xl animate-bounce opacity-25" style={{ animationDelay: '1.5s' }}>🍔</div>
        <div className="absolute bottom-40 left-1/5 text-3xl animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>🌮</div>
        <div className="absolute bottom-60 right-1/3 text-4xl animate-bounce opacity-30" style={{ animationDelay: '3s' }}>🍜</div>
        <div className="absolute top-1/2 left-10 text-2xl animate-bounce opacity-25" style={{ animationDelay: '1s' }}>🥗</div>
        <div className="absolute top-1/3 right-16 text-3xl animate-bounce opacity-20" style={{ animationDelay: '2s' }}>🍰</div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex min-h-screen">
        <div className="absolute inset-0 md:left-1/2 bg-gradient-to-br from-orange-50/80 via-white/90 to-yellow-50/80 pointer-events-none"></div>
        <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center">
          <img
            src="/img/login.jpg"
            alt="Login illustration"
            className="max-w-full h-screen object-cover"
          />
        </div>

        {/* Right side - Login form */}
        <div className="relative w-full md:w-1/2 bg-white flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-8">
          {/* Additional animated elements for the form side */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 right-5 w-12 h-12 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            {/* Floating food icons for right side */}
            <div className="absolute top-16 right-1/4 text-2xl animate-bounce opacity-20" style={{ animationDelay: '1s' }}>🍟</div>
            <div className="absolute bottom-32 right-8 text-2xl animate-bounce opacity-15" style={{ animationDelay: '2.5s' }}>🥤</div>
            <div className="absolute top-1/2 right-12 text-xl animate-bounce opacity-20" style={{ animationDelay: '3s' }}>🍪</div>
          </div>
          <div className="my-auto flex flex-col w-full max-w-[450px] mx-auto mt-8 mb-10">
            <p className="text-[32px] font-bold mb-6 text-orange-400">Login</p>

            <div className="space-y-4">
              {/* Google Login Button - Styled to match phone button */}
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log('Login error')}
                  width='100%'
                  theme="outline"
                  size="large"
                  text="signin_with"
                />
              </div>

              {/* Phone Login Button */}
           <form className="w-full">
        <input type="hidden" name="provider" value="phone" />
        <button
          className="inline-flex items-center justify-center border border-gray-300 rounded-md w-full h-12 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="button"
          onClick={() => setPhoneModal(true)}  // Fixed setter name
        >
          <span className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>Continue with Phone</span>
        </button>
      </form>


              {/* Role Selection Modal */}
              {isModalOpen && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                      Select Your Role
                    </h2>
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={() => handleRoleSelect('user')}
                        className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-350 text-black grow border border-orange-400 hover:bg-orange-400 hover:text-white flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                      >
                        Normal User
                      </button>
                      <button
                        onClick={() => handleRoleSelect('hotel')}
                        className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-350 text-black grow border border-orange-400 hover:bg-orange-400 hover:text-white flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                      >
                        Hotel User
                      </button>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="flex justify-between text-sm mt-2">
              <a href="/Signup" className="font-medium text-black text-sm">
                Don't have an account? Sign up
              </a>
              <a onClick={(e)=>{e.preventDefault() ;
                setPasswordModal(true)}} href="" className="text-orange-400">
                Forget Password?
              </a>
            </p>

            <div className="relative my-4">
              <div className="relative flex items-center py-1">
                <div className="grow border-t border-zinc-200"></div>
                <div className="mx-2 text-zinc-400">or</div>
                <div className="grow border-t border-zinc-200"></div>
              </div>
            </div>

            <div>
              <form noValidate className="mb-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label className="text-black" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-black border-zinc-300 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="text-black mt-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      autoComplete="current-password"
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-black border-zinc-300 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                      />
                      <label htmlFor="remember" className="text-sm text-black">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <button
                    className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-350 text-black grow border border-orange-400 hover:bg-orange-400 hover:text-white flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                    type="submit"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ForgetPassword 
       onClose={()=>setPasswordModal(false)}
       isOpen={passwordModal}
      />
   <PhoneAuthModal
        isOpen={phoneModal}
        onClose={() => setPhoneModal(false)} 
      />
    </div>
  );
};

export default LoginPage;

// flamezero@famezero-464106.iam.gserviceaccount.com