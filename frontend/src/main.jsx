import React from "react"
import ReactDOM from "react-dom/client"
// import { SessionsApp } from "./sessions/SessionsApp"
// import { JwtSimpleApp } from "./jwt-simple/JwtSimpleApp"
import { JwtRefreshApp } from "./jwt-refresh/JwtRefreshApp"

import "./index.scss"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="container">
      {/* <SessionsApp /> */}
      {/* <JwtSimpleApp /> */}
      <JwtRefreshApp />
    </div>
  </React.StrictMode>
)
