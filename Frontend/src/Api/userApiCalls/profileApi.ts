import { IReview } from "../../Components/User/RatingAndReview";
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

export const changePassword = async (id: string, currentPasswords: string, newPassword: string, confirmPassword: string) => {
  try {
    const response = await axiosInstance.post(`/change-password/:${id}`, { currentPasswords, newPassword, confirmPassword })
    return response.data
  } catch (error) {
  }
}

export const fetchHotelProfiles = async () => {
  try {
    const response = await axiosInstance.get('/get-hotels')
    return response.data
  } catch (error) {

  }
}

export const getHotelDetails = async (hotelId: string) => {
  try {
    const response = await axiosInstance.get(`/get-hotel/${hotelId}`)
    return response.data
  } catch (error) {

  }
}

export const ratingandReview = async (
  hotelId: string,
  review: IReview[],
  imageRating?: File
) => {
  try {
    const formData = new FormData();
    formData.append("review", JSON.stringify(review));

    if (imageRating) {
      formData.append("reviweIMG", imageRating);
    }

    const response = await axiosInstance.post(
      `/rating-review/${hotelId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error: any) {
    console.error("Rating and review error:", error);
    throw error.response?.data || { error: "Failed to submit rating and review" };
  }
};

export const likeAndunlike = async(reviewId:string,userId:string,hotelId:string) => {
  console.log(reviewId,userId,'THIS IS FROM API SIDE');
  
  try {
     const response = await axiosInstance.post(`/like-unlike/${reviewId}/${userId}/${hotelId}`)
     return response.data
  } catch (error) {
    
  }
}