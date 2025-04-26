import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider, AuthContext } from "./AuthContext";
import { Layout } from "./Layout";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { HomePage } from "../common/HomePage";
import { SecretPage } from "./SecretPage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return null;
  if (!auth.user) return <Navigate to="/login" replace />;
  return children;
};

const RedirectIfLoggedIn = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return null;
  if (auth.user) return <Navigate to="/" replace />;
  return children;
};

export const SessionsApp = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="/login"
              element={
                <RedirectIfLoggedIn>
                  <LoginPage />
                </RedirectIfLoggedIn>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfLoggedIn>
                  <RegisterPage />
                </RedirectIfLoggedIn>
              }
            />
            <Route
              path="/secret"
              element={
                <ProtectedRoute>
                  <SecretPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};
