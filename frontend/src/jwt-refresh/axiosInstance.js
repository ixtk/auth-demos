import axios from "axios"
import toast from "react-hot-toast"

const axiosInstance = axios.create({
  baseURL: `http://localhost:3000/jwt-refresh`,
  withCredentials: true
})

// List of endpoints that should not trigger toast on 401
const authEndpoints = ['/user/login', '/user/register', '/user/status', '/refresh']

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      error.config.url.includes(endpoint)
    )

    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await axiosInstance.post("/refresh")
        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        if (!isAuthEndpoint) {
          toast.error('Session expired. Please refresh the page')
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
