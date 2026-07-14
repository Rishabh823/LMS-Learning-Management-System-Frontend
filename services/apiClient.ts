import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { apiSuccess } from "./apiSucess";
import { apiError } from "./apiError";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => apiSuccess(response),
  (error: AxiosError) => {
    apiError(error);
    return Promise.reject(error);
  },
);

export default apiClient;
