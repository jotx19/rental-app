import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "https://othousing.onrender.com": "/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
});