import { axiosInstance } from "../Instance/axiosInstance"

export const addToCart = async(productId:string,userId:string,hotelId:string) =>{
    try {
        const response = await axiosInstance.post(`/add-to-cart/${productId}/${userId}/${hotelId}`)
        return response.data
    } catch (error) {
        
    }
}

export const fetchCartProduct = async(userId:string) =>{
    try {
        const response = await axiosInstance.get(`/get-cart/${userId}`)
        return response.data
    } catch (error) {
        
    }
}

export const removeCart = async (productId: string, userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/delete-from-cart/${userId}/${productId}` 
    );
    return response;
  } catch (error) {
    throw error; 
  }
};

export const updateStockInCart = async(userId:string,productId:string,action:string) => {
  try {
    const response = await axiosInstance.put(`/update-stock-item`,{userId,productId,action})
    return response.data
  } catch (error) {   
    throw error
  }
}

export const getCheckOut = async(userId:string)=>{
  try {
    const response = await axiosInstance.get(`/checkout/${userId}`) 
    return response.data
  } catch (error) {
    throw error
  }
}

export const createOrder = async (userId:string) => {
  try {
    const response = await axiosInstance.post(`/create-order/${userId}`);
    return response.data; 
  } catch (error: any) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};