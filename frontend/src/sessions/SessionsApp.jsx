import {
  createBrowserRouter,
  createRoutesFromElements,
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
  const navigate = useNavigate();

  useEffect(() => {
    console.log(auth);
    if (auth.loading === false && auth.user === null) {
      navigate("/login");
    }
  }, [auth.user, auth.loading, navigate]);

  if (auth.loading) {
    return null
  }

  return auth.user ? children : null;
};

const RedirectIfLoggedIn = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading === false && auth.user !== null) {
      navigate("/");
    }
  }, [auth.user, auth.loading, navigate]);

  if (auth.loading) {
    return null
  }

  return auth.user === null ? children : null;
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
