import { Outlet, NavLink } from "react-router-dom"

export const RootLayout = () => {
  const logout = async () => {
    // todo
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
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
