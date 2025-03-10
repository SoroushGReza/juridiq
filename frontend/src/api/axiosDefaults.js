import axios from "axios";
import Cookies from "js-cookie";

const csrfToken = Cookies.get("csrftoken");
if (csrfToken) {
  axios.defaults.headers.common["X-CSRFToken"] = csrfToken;
}

// Dynamically set the base URL based on the environment
// axios.defaults.baseURL =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:8000/api"
//     : import.meta.env.VITE_BACKEND_URL || "https://api.juridiq.nu/api";
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "https://api.juridiq.nu/api");

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// CSRF settings
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// Function to get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("access");
  if (token) {
    return `Bearer ${token}`;
  }
  return null;
};

// Set access-token if it exists
export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  }
};

// Create Axios instance for requests
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Set token for each request
axiosReq.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses, especially 401 errors for token refresh
axiosReq.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await axios.post("/auth/token/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("access", data.access);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access}`;
        return axiosReq(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

setAuthHeader();
