import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RegisteUser } from '../../Api/userApiCalls/userApi';
import toast from 'react-hot-toast';

export interface IUserData{
  name : string;
  email : string;
  role:string;
  password:string;
}

const Signup = () => {
  const [formData, setFormData] = useState<IUserData>({
    name: "",
    email:"",
    role:"",
    password:""
  });  
  
  const handleRegisterUser = async(e:any) =>{
    e.preventDefault()
    const userData = {
      name : formData.name,
      email: formData.email,
      role:formData.role,
      password : formData.password
    }
    try {
      const response = await RegisteUser(userData) 
      console.log(response.message);
      
      if(response.success){
        toast.success('OTP has been sented')
        navigate('/otp',{state:{email :formData.email ,userData:formData}})
      }
    } catch (error:any) {
      console.log(error);
      
      toast.error(error.error);
    }
  }
  
  const navigate = useNavigate();

 

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating food icons */}
        <div className="absolute top-20 left-1/4 text-4xl animate-bounce opacity-30" style={{animationDelay: '0.5s'}}>🍕</div>
        <div className="absolute top-32 right-1/4 text-3xl animate-bounce opacity-25" style={{animationDelay: '1.5s'}}>🍔</div>
        <div className="absolute bottom-40 left-1/5 text-3xl animate-bounce opacity-20" style={{animationDelay: '2.5s'}}>🌮</div>
        <div className="absolute bottom-60 right-1/3 text-4xl animate-bounce opacity-30" style={{animationDelay: '3s'}}>🍜</div>
        <div className="absolute top-1/2 left-10 text-2xl animate-bounce opacity-25" style={{animationDelay: '1s'}}>🥗</div>
        <div className="absolute top-1/3 right-16 text-3xl animate-bounce opacity-20" style={{animationDelay: '2s'}}>🍰</div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-6">
          <img 
            src="/img/login.jpg" 
            alt="Sign-in illustration" 
            className="max-w-full h-screen object-cover"
          />
        </div>
        
        {/* Right side - Sign-up form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-8">
          <div className="my-auto flex flex-col w-full max-w-[450px] mx-auto mt-8 md:mt-0">
            <p className="text-[32px] mt-6 font-bold text-orange-400">Sign Up</p>
            <p className="mb-2.5 mt-2.5 font-normal text-zinc-600">
              Enter your details to create an account!
            </p>
            
            <div className="mt-8">
              <form className="pb-2">
                <input type="hidden" name="provider" value="google" />
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-300 bg-white text-black hover:bg-zinc-100 h-10 px-4 w-full py-6"
                  type="submit"
                >
                  <span className="mr-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      version="1.1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 48 48"
                      enableBackground="new 0 0 48 48"
                      className="h-5 w-5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                  </span>
                  <span>Google</span>
                </button>
              </form>
              
              <form className="pb-2">
                <input type="hidden" name="provider" value="phone" />
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-300 bg-white text-black hover:bg-zinc-100 h-10 px-4 w-full py-6"
                  type="submit"
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>Phone</span>
                </button>
              </form>
            </div>
            
            <p className="flex justify-between text-sm mt-2">
              <a
                href="/Login"
                className="font-medium text-black"
              >
               Already have an account? Login
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
              <form noValidate className="mb-4" onSubmit={handleRegisterUser}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label className='text-black' htmlFor="name">Name</label>
                    <input
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-black border-zinc-300 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                      id="userName"
                      placeholder="Enter Your Name"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      name="userName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    
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
                      value={formData.email}
                      onChange={(e) => setFormData({...formData,email:e.target.value})}
                    />
                      <label className='text-white' htmlFor="Role">Role</label>
                    <select
                      name="Role"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-black border-zinc-300 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-orange-400"
                    >
                      <option value="">Select A Role</option>
                      <option value="user">User</option>
                      <option value="hotel">Hotel</option>
                    </select>
                    <label className="text-black mt-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-black border-zinc-300 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData,password:e.target.value})}
                    />
                  </div>
                  
                  <button 
                    className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-350 text-black grow border border-orange-400 hover:bg-orange-400 hover:text-white flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                    type="submit"
                  >
                    Get OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;