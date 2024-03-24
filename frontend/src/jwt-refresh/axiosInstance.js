import axios from "axios"

const config = {
  baseURL: `http://localhost:3000/jwt-refresh`,
  withCredentials: true
}

export const axiosInstance = axios.create(config)
export const axiosInterceptorsInstance = axios.create(config)
