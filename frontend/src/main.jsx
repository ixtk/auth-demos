import React from "react"
import ReactDOM from "react-dom/client"
import { SessionsApp } from "./sessions/SessionsApp"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionsApp />
  </React.StrictMode>
)
