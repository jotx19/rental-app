import axios from "axios";

export const BASE_URL =
     "https://othousing-ybhh.onrender.com"

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
