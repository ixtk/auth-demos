import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom"

import { Layout } from "./Layout"
import { HomePage } from "../common/HomePage"
import { LoginPage } from "./LoginPage"
import { RegisterPage } from "./RegisterPage"
import { SecretPage } from "./SecretPage"
import { AuthContext, AuthContextProvider } from "./AuthContext"
import { useContext } from "react"
import { Toaster } from 'react-hot-toast'

const ProtectedRoute = () => {
  const { auth } = useContext(AuthContext)
  
  if (auth.loading) return null
  if (!auth.user) return <Navigate to="/login" replace />
  return <Outlet />
}

const RedirectIfLoggedIn = () => {
  const { auth } = useContext(AuthContext)
  
  if (auth.loading) return null
  if (auth.user) return <Navigate to="/" replace />
  return <Outlet />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route element={<RedirectIfLoggedIn />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="secret" element={<SecretPage />} />
      </Route>
    </Route>
  )
)

export const JwtRefreshApp = () => {
  return (
    <AuthContextProvider>
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}
