import axios from "axios";
import store, { persistor } from "../../Redux/store";
import { refreshToken } from "../userApiCalls/userApi";
import { addUser, removeUser } from "../../Redux/Slice/userSlice";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }
);



let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

    
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalReq.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalReq));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshToken();
        const newAccessToken = response.response;
        const currentUser = store.getState().user;
        store.dispatch(
          addUser({
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            token: newAccessToken
          })
        );

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalReq);
      } catch (err) {
        isRefreshing = false;
        // store.dispatch(removeUser());
        persistor.purge();
        // window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      // store.dispatch(removeUser());
      persistor.purge();
      // window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

