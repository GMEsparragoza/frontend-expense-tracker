import React, { useEffect, useContext} from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import { Navbar } from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './utils/AuthContext';
import axios from 'axios'
import Perfil from './pages/PerfilPage';
import { AlertProvider } from './utils/AlertContext';
import Alerta from './components/Alerta';
import ResetPassword from './pages/ResetPassword';
import { DateProvider } from './utils/DateContext';
import { NotFound } from './pages/NotFound';
import { ErrorFetch } from './pages/ErrorFetch'

axios.defaults.withCredentials = true;

function App() {
  const { resError } = useContext(AuthContext); // Accede al estado de resError desde el contexto
  const navigate = useNavigate();

  // Redirige si resError es true
  useEffect(() => {
    if (resError) {
      navigate("/Error-Page-429");
    }
  }, [resError, navigate]); // Se ejecuta cuando resError cambia

  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Navbar />
          <Alerta />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DateProvider>
                    <Dashboard />
                  </DateProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/Error-Page-429" element={<ErrorFetch />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;