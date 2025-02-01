import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from './config';
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshUser, setRefreshUser] = useState(true); // Nueva variable para forzar actualización

    useEffect(() => {
        // Ejecutar la petición solo si refreshUser es true o si user es null
        if (refreshUser || !user) {
            axios.post(`${REACT_APP_BACKEND_API_URL}/api/auth`, {}, { withCredentials: true })
                .then(response => {
                    setUser(response.data.user);
                    setLoading(false);
                })
                .catch(error => {
                    setUser(null);
                    setLoading(false);
                })
                .finally(setRefreshUser(false));
        }
    }, [refreshUser]); // La petición solo se ejecutará si refreshUser cambia

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setRefreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};