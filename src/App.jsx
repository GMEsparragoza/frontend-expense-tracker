import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

axios.defaults.withCredentials = true;

function App() {
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
                  <Dashboard />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;