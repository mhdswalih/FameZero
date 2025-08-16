import { IUserData } from "../../Components/Login/Signup";
import { axiosInstance } from "../Instance/axiosInstance";

export const RegisteUser = async(userData:IUserData) =>{
    try {
        const response = await axiosInstance.post('/create-user',userData)
        return response.data
    } catch (error:any) {
       throw error.response?.data || 'Register user failed'
    }
}

export const verifyOtpAndCreateUser = async (email: string, otp: string, userData = {}) => {
  try {
    const response = await axiosInstance.post('/veryfy-otp', { email, otp, userData });
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || 'OTP verifycation failed'; 
  }
};

export const resendOtp = async(email: string) =>{
  try {
    const response = await axiosInstance.post('/resend-otp',{email})
    return response.data
  } catch (error : any) {
      throw error.response?.data || 'Failed to resend OTP '; 
  }
}


export const loginUser = async(email:string,password:string)=>{
  try {
    const response = await axiosInstance.post('/login-user',{email,password})
    return response.data
  } catch (error: any) {
    throw error.response?.data || 'Failed to login user'
  }
}
export const logoutUser = async()=>{
  try {
    const response = await axiosInstance.post('/logout')
    return response.data
  } catch (error:any) {
      throw error.response?.data || 'Failed to logout user'
  }
}

export const refreshToken = async () =>{
  try {    
    const response = await axiosInstance.post('/refresh-token',{},{withCredentials:true}); 
    return response.data
  } catch (error:any) {
     throw error.response?.data || 'Failed Refresh Token'
  }
}

export const googleLogin = async(googleToken:string,role:string) =>{
  try {
    const response = await axiosInstance.post('/google-login',{googleToken,role}) 
    return response.data
  } catch (error:any) {
    throw error.response?.data
  }
}

export const forgetPassword = async(email:string)=>{
  try {
    const response = await axiosInstance.post('/forget-password',{email})
    return response.data
  } catch (error:any) {
     throw error.response?.data
  }
}

export const resetPassword = async(token:string,newPassword:string,confirmPassword:string)=>{  
  try {
    const response = await axiosInstance.post('/reset-password',{token,newPassword,confirmPassword})
    return response.data
  } catch (error:any) {
    throw error.response?.erorr
  }
}


export const phoneAuth = async(name:string,phone:string,role:string) =>{ 
  try {
    const respone = await axiosInstance.post('/phone-auth',{name,phone,role})

    return respone.data
  } catch (error:any) {
      throw error.response?.erorr
  }
}

export const isEmailVerified = async(email:string) =>{
  try {
    const response = await axiosInstance.post('/email-verify',{email})
    return response.data
  } catch (error:any) {
     throw error.response?.erorr
  }
}

export const verifyEmailOtp = async (id:string,email:string,otp:string)=>{  
  try {
    const response = await axiosInstance.post(`/verify-otp/:${id}`,{email,otp})
    return response.data
  } catch (error) {
    
  }
}