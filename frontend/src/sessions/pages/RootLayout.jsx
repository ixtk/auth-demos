import { Outlet, NavLink } from "react-router-dom"
import { axiosInstance } from "../axiosInstance"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export const RootLayout = () => {
  const { authState, setAuthState } = useContext(AuthContext)

  const logout = async () => {
    const response = await axiosInstance.delete("/user/logout")

    if (response.statusText === "OK") {
      setAuthState({
        ...authState,
        user: null
      })
    }

    console.log(response.data)
  }

  return (
    <div className="header-container">
      <header>
        <h1>Sessions</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {authState.user !== null ? (
              <>
                <li>
                  <NavLink to="/secret">Secret</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
                <li>
                  <img
                    src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                    alt="Profile picture"
                  />
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
