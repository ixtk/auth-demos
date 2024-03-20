import { createContext, useEffect, useState } from "react"
import { axiosInstance } from "./axiosInstance"

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
  }, [])

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}
