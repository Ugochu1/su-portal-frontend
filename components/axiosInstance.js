import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

axiosInstance.interceptors.response.use((response) => {
  return response;
}, error => {
  return Promise.reject(error);
})

axiosInstance.interceptors.request.use((config) => {
  return config;
}, error => {
  return Promise.reject(error)
})

export default axiosInstance;