import { Axios, axiosInstance} from "../Instance/axiosInstance"


export const getHotels = async (id:string) =>{
    try {
      console.log('...................................................');
      
        const response = await axiosInstance.get(`/hotel/get-hotel-profile/${id}`)
        return response.data
        
  } catch (error : any) {
      throw error.response?.data || 'Failed to get Hotel '; 
  }
}

export const editHotelProfile = async (
  id: string, 
  hotelData: any, 
  imageFiles?: File, 
  imageProof?: File
) => {
  try {
    let response;
    
    if (imageFiles || imageProof) {
      const formData = new FormData();

      Object.keys(hotelData).forEach(key => {
        const value = hotelData[key];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value)); 
        }
      });

      if (imageFiles) {
        formData.append('profilepic', imageFiles);
      }
      
      if (imageProof) {
        formData.append('idProof', imageProof);
      }

     
      response = await axiosInstance.post(`/hotel/update-hotelprofile/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
    } else {
      response = await axiosInstance.post(`/hotel/update-hotelprofile/${id}`, hotelData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      
    }
        
    return response.data;
    
  } catch (error: any) {
    throw error.response?.data || { error: error.message || 'Failed to update hotel profile' };
  }
};
export const reRequstOption = async (id:string)=>{
  try {
     const response = await axiosInstance.post(`/hotel/rerequst-profile/:${id}`)
     return response.data
  } catch (error:any) {
       throw error.response?.data || { error: error.message || 'Failed to ReRequst hotel profile' };
  }
}