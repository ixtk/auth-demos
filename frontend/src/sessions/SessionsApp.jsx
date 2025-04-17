import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import { Layout } from "./Layout";
import { HomePage } from "../common/HomePage";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { SecretPage } from "./SecretPage";
import { AuthContext, AuthContextProvider } from "./AuthContext";
import { useContext, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    return null
  }

  if (auth.user !== null) {
    return children
  } else {
    return <Navigate to="/login" />
  }
};

const RedirectIfLoggedIn = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    return null
  }

  if (auth.user !== null) {
    return <Navigate to="/" />
  } else {
    return children
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="login"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="secret"
        element={
          <ProtectedRoute>
            <SecretPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="register"
        element={
          <RedirectIfLoggedIn>
            <RegisterPage />
          </RedirectIfLoggedIn>
        }
      />
    </Route>
  )
);

export const SessionsApp = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};
