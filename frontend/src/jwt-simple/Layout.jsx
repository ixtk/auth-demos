import { useContext } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { axiosInstance } from "./axiosInstance"
import { Header } from "../common/Header"

export const Layout = () => {
  const { auth, setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await axiosInstance.delete("/user/logout")
      navigate('/')
      setAuth({ ...auth, user: null })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <Header name="JWT Simple" logout={logout} auth={auth} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
