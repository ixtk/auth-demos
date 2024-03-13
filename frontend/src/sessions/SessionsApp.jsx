import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate
} from "react-router-dom"

import {
  RootLayout,
  HomePage,
  LoginPage,
  RegisterPage,
  SecretPage
} from "./pages"
import { AuthContext, AuthContextProvider } from "./AuthContext"
import { useContext, useEffect } from "react"

const ProtectedRoute = ({ children }) => {
  const { authState } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // სტატუსის ინფორმაცია დაბრუნდა და მომხმარებელი არაავტორიზებულია
    if (authState.initialLoading === false && authState.user === null) {
      navigate("/login")
    }
  }, [authState.user, authState.initialLoading, navigate])

  return authState.user ? children : null
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="secret"
        element={
          <ProtectedRoute>
            <SecretPage />
          </ProtectedRoute>
        }
      />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
)

export const SessionsApp = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}
