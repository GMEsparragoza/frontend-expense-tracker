import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from './config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the user data from the backend
        axios.get(`${REACT_APP_BACKEND_API_URL}/api/auth`, { withCredentials: true }) 
            .then(response => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch(error => {
                setUser(null);
                setLoading(false);
            });

        // Axios interceptor for handling token expiration
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Request a new Access Token using the Refresh Token
                        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/refresh-token`, {}, { withCredentials: true });

                        // Retry the original request after token refresh
                        return axios(originalRequest);
                    } catch (refreshError) {
                        console.error('Unable to refresh token', refreshError);
                        setUser(null); // Optionally log the user out
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};