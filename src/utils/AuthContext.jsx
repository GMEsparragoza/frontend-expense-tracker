import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {REACT_APP_BACKEND_API_URL} from './config'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${REACT_APP_BACKEND_API_URL}/api/auth`)
            .then(response => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch(error => {
                setUser(null);
                setLoading(false);
                console.error(error)
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};