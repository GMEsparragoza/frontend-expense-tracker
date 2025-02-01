import React, { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, AuthContext } from "./utils/AuthContext";
import axios from "axios";
import Perfil from "./pages/PerfilPage";
import { AlertProvider } from "./utils/AlertContext";
import Alerta from "./components/Alerta";
import ResetPassword from "./pages/ResetPassword";
import { DateProvider } from "./utils/DateContext";
import { NotFound } from "./pages/NotFound";
import { ErrorFetch } from "./pages/ErrorFetch";

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Navbar />
          <Alerta />
          <RedirectOnError /> {/* Mover aquí, fuera de <Routes> */}
          <AppRoutes />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><DateProvider><Dashboard /></DateProvider></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/Error-Page-429" element={<ErrorFetch />} />
    </Routes>
  );
}

// ✅ Mover fuera de <Routes>
function RedirectOnError() {
  const { resError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (resError) {
      navigate("/Error-Page-429");
    }
  }, [resError, navigate]);

  return null; // No renderiza nada, solo maneja la redirección
}

export default App;