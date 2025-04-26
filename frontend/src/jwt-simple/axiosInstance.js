import axios from "axios"
import toast from "react-hot-toast"

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/jwt-simple",
  withCredentials: true
})

const authEndpoints = ['/user/login', '/user/register', '/user/status']

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      error.config.url.includes(endpoint)
    )
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      toast.error('Session expired. Please refresh the page')
    }
    return Promise.reject(error)
  }
)
