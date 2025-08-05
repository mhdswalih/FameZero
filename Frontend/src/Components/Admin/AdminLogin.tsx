import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../../Api/adminApiCalls/adminApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../Redux/Slice/adminSlice';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async() => {
     try {
      const response = await loginAdmin(email,password)
       dispatch(Login({
        _id:response.admin?.id || '',
        email:response.admin?.email|| '',
        token:response?.accessToken || null 
       }))
       toast.success(response.message)
       setTimeout(()=>{
        navigate('/admin')
       },1000)
     } catch (error:any) {
       toast.error(error.error)
     }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="px-6 py-6">
        <div className=" mx-auto">
          <h1 className="text-white text-2xl font-bold">FlameZero</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-16">
        <div className="max-w-md mx-auto">
          <h2 className="text-white text-2xl font-medium mb-8 text-center">
            Welcome Back
          </h2>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button className="text-white text-sm hover:text-gray-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!email || !password}
              className="w-full bg-white text-black py-4 rounded-lg font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}