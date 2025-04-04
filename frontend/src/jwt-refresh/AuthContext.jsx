import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance.js"
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
        const response = await axiosInstance.get("/user/status", {
          signal: authController.signal
        })

        setAuth({
          user: response.data.user,
          loading: false
        })
      } catch (error) {
        try {
          const response = await axiosInstance.post(
            "/refresh",
            {},
            {
              signal: authController.signal
            }
          )

          setAuth({
            user: response.data.user,
            loading: false
          })
        } catch (error) {
          if (!axios.isCancel(error)) {
            setAuth((prevAuthState) => ({
              ...prevAuthState,
              loading: false
            }))
          }
        }
      }
    }

    const logoutInterceptor =
      axiosInterceptorsInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error?.config

          if (error.response?.status === 401) {
            try {
              console.log("Getting a new access token")
              await axiosInstance.post("/refresh")
              return axiosInstance(originalRequest)
            } catch (error) {
              window.location.href = "/login"
            }
          }
          return Promise.reject(error)
        }
      )

    checkStatus()

    return () => {
      authController.abort()
      axiosInterceptorsInstance.interceptors.response.eject(logoutInterceptor)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
