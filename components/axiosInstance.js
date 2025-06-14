import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
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