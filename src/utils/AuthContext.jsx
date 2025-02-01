import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from './config';
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshUser, setRefreshUser] = useState(false); // Nueva variable para forzar actualización

    useEffect(() => {
        // La condición ahora se ejecuta solo si user es null o refreshUser es true
        if (!user || refreshUser) {
            axios.post(`${REACT_APP_BACKEND_API_URL}/api/auth`, {}, { withCredentials: true })
                .then(response => {
                    setUser(response.data.user);
                    setLoading(false);
                })
                .catch(error => {
                    setUser(null);
                    setLoading(false);
                })
                .finally(() => {
                    setRefreshUser(false); // Resetear refreshUser después de la petición
                });
        }
    }, [user, refreshUser]); // Dependencias: cambiará cuando user o refreshUser cambien

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setRefreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};