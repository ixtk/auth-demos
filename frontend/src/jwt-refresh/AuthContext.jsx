import { axiosInstance } from "./axiosInstance.js"
import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext({
  user: null,
  loading: true
})

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true
  })

  useEffect(() => {
    const authController = new AbortController()

    const checkStatus = async () => {
      try {
        // Try to get user status first
        const response = await axiosInstance.get("/user/status", {
          signal: authController.signal
        })
        setAuth({
          user: response.data.user,
          loading: false
        })
      } catch (error) {
        if (!axios.isCancel(error)) {
          // Status check failed and wasn't cancelled
          // Don't try to refresh here - the axios interceptor will handle that
          setAuth({
            user: null,
            loading: false
          })
        }
      }
    }

    checkStatus()

    return () => {
      authController.abort()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
