import { axiosInstance } from "../Instance/axiosInstance";


// export const registerHotel = async(userData:IHotelUserData)=>{
//     try {
//         const response = await axiosInstance.post('/hotel-register',{userData})
//         return response.data
//     } catch (error:any) {
//         throw error.response?.data || 'Register verifycation failed'; 
//   }
// }

export const HotelverifyOtp  = async(email:string,otp:string,userData={}) =>{
   try {
    console.log(email,otp,userData,'this is hotel very fiy ');
    
    const response = await axiosInstance.post('/verifyOtp-hotel',{email,otp,userData})
    console.log(response.data,'the api data');
    return response.data
   } catch (error:any) {
       throw error.response?.data || 'OTP verifycation failed'; 
  }
}

export const resendOtp = async(email: string) =>{
  try {
    const response = await axiosInstance.post('/resend-otp',{email})
    return response.data
  } catch (error : any) {
      throw error.response?.data || 'Failed to resend OTP '; 
  }
}

