import { NavLink } from "react-router-dom"
import "./Header.scss"

export const Header = ({ auth, logout, name }) => {
  return (
    <header>
      <h1>{name}</h1>
      <nav>
        {auth.loading ? (
          <ul className="loading-container">
            <div className="skeleton-loading"></div>
            <div className="skeleton-loading"></div>
            <div className="skeleton-loading"></div>
            <div className="skeleton-loading"></div>
          </ul>
        ) : (
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {auth.user ? (
              <>
                <li>
                  <NavLink to="/secret">Secret</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
                <li className="profile">
                  <img
                    src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                    alt="Profile picture"
                  />
                  <span>{auth.user.username}</span>
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
        )}
      </nav>
    </header>
  )
}
