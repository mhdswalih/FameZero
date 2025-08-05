import { axiosInstance } from "../Instance/axiosInstance"

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
        return response.data

    } catch (error : any) {
       throw error.response?.data || 'failed to fetch users '; 
  }
}

export const fetchHotels = async () =>{ 
    try {
        const response = await axiosInstance.get('/admin/get-hotels')    
        return response.data
    } catch (error:any) {
       throw error.response?.data || 'failed to fetch Hotels '; 
    }
}

export const accptRequst = async(id:string) =>{  
    try {
     const response = await axiosInstance.post(`/admin/accept-requst/:${id}`)    
     return response.data
    } catch (error:any) {
        throw error.response?.data || 'Failed to Accept Requst'
    }
}

export const rejectrequst = async(id:string) => {
    try {
        const response = await axiosInstance.post(`/admin/reject-requst/:${id}`)
        return response.data
    } catch (error:any) {
         throw error.response?.data || 'Failed to Reject Requst'
    }
}