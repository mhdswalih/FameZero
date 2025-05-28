import { IUserData } from "../userSide/SignIn";
import { axiosInstance } from "./axiosInstance";

export const RegisteUser = async(userData:IUserData) =>{
    try {
        const response = await axiosInstance.post('/create-user',userData)
        return response.data
    } catch (error) {
        console.log(error);
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