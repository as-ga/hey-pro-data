// "use server";
import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Add interceptors for request and response
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken") || null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error(
        "API Error:",
        error.response.data.message || error.response.statusText
      );
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { isAxiosError };
