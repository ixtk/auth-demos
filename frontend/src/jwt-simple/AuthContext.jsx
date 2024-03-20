import { createContext, useEffect, useState } from "react"
import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance"

export const AuthContext = createContext({
  initialLoading: true,
  user: null
})

export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    initialLoading: true,
    user: null
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get("/user/status")
        console.log(response.data.user)
        setAuthState({
          initialLoading: false,
          user: response.data.user
        })
      } catch (error) {
        setAuthState({
          ...authState,
          initialLoading: false
        })
      }
    }

    checkStatus()

    const logoutInterceptor =
      axiosInterceptorsInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            window.location.href = "/login"
          }
          return Promise.reject(error)
        }
      )

    return () => {
      axiosInterceptorsInstance.interceptors.response.eject(logoutInterceptor)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}
