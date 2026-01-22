import axios from "axios";

let isLoggingOut = false;

export const setLoggingOut = (value) => {
  isLoggingOut = value;
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 100000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧠 Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧠 Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 Không refresh token nếu đang logout hoặc request có flag skipAuthRefresh
    if (isLoggingOut || originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh-token`,
          { withCredentials: true }
        );

        const newAccessToken = response.data.data;

        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed");
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
