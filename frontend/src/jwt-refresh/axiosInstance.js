import axios from "axios"
import toast from "react-hot-toast"

export const axiosInstance = axios.create({
  baseURL: `http://localhost:3000/jwt-refresh`,
  withCredentials: true
})

// List of endpoints that should not trigger toast on 401
const authEndpoints = ['/user/login', '/user/register', '/user/status', '/refresh']

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      originalRequest.url.includes(endpoint)
    )

    // Don't try to refresh if:
    // 1. This is not a 401 error
    // 2. This request has already been retried
    // 3. This is the /refresh endpoint itself
    if (
      error.response?.status !== 401 || 
      originalRequest._retry ||
      originalRequest.url.includes('/refresh')
    ) {
      return Promise.reject(error)
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => axiosInstance(originalRequest))
        .catch(err => Promise.reject(err))
    }

    isRefreshing = true
    originalRequest._retry = true

    try {
      const response = await axiosInstance.post("/refresh")
      processQueue(null)
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      if (!isAuthEndpoint) {
        toast.error('Session expired. Please refresh the page')
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
