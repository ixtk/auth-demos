import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom"

import {
  RootLayout,
  HomePage,
  LoginPage,
  RegisterPage,
  SecretPage
} from "./pages"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="secret" element={<SecretPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
)

export const SessionsApp = () => {
  return <RouterProvider router={router} />
}
