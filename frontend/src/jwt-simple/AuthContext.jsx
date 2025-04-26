import { createContext, useEffect, useState } from "react"
import { axiosInstance } from "./axiosInstance"

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
        setAuth({
          ...auth,
          loading: false
        })
      }
    }

    checkStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
