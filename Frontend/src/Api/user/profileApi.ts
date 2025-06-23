import { axiosInstance } from "../Instance/axiosInstance";

export const getUserDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/get-user-details/${id}`) 
    return response.data
  } catch (error: any) {
    throw error.response?.data || 'Failed to Fetch user'
  }
}


export const updateUser = async (
  id: string, 
  userProfile: any, 
  profileImage?: File 
) => {
  
  try {
    let response;
    
    if (profileImage) {
      const formData = new FormData();
  
      Object.keys(userProfile).forEach(key => {
        if (userProfile[key] !== null && userProfile[key] !== undefined) {
          formData.append(key, userProfile[key]);
        }
      });
      
    
      formData.append("profilepic", profileImage);
      
      response = await axiosInstance.post(
        `/update-userprofile/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
    
      response = await axiosInstance.post(
        `/update-userprofile/${id}`,
        userProfile 
      );
    }
    return response.data;
    
  } catch (error: any) {
    throw error.response?.data || 'Failed to update user profile';
  }
};