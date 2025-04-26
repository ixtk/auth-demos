import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContextProvider, AuthContext } from "./AuthContext";
import { Layout } from "./Layout";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { HomePage } from "../common/HomePage";
import { SecretPage } from "./SecretPage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";

const ProtectedRoute = () => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return null;
  if (!auth.user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const RedirectIfLoggedIn = () => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return null;
  if (auth.user) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const SessionsApp = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route element={<RedirectIfLoggedIn />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/secret" element={<SecretPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};
