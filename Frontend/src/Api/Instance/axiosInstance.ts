import axios from "axios";
import Cookies from "js-cookie";


export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URI
})

axiosInstance.interceptors.request.use(
     (config) => {
        const token = Cookies.get('authToken'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)