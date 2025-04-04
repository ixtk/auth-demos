import { createContext, useEffect, useState } from "react"
import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance"

export const AuthContext = createContext({
  loading: true,
  user: null
})

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    user: null
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get("/user/status")
        setAuth({
          loading: false,
          user: response.data.user
        })
      } catch (error) {
        console.log('here')
        setAuth({
          ...auth,
          loading: false
        })
      }
    }

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

    checkStatus()

    return () => {
      axiosInterceptorsInstance.interceptors.response.eject(logoutInterceptor)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
