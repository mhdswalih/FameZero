import { axiosInstance } from "./Instance/axiosInstance"

export const loginAdmin = async(email:string,password:string) =>{
    try {
        const response = await axiosInstance.post('/admin/admin-login',{email,password})
        return response.data
    } catch (error:any) {
        throw error.response?.data || 'failed to login admin'
    }
}

export const fetchUser = async()=>{
    try {
        const response = await axiosInstance.get('/admin/get-users')
        console.log(response.data,'this is from data from admin side');
        
        return response.data

    } catch (error : any) {
       throw error.response?.data || 'failed to fetch users '; 
  }
}