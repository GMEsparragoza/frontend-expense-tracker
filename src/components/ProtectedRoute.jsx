import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading, resError } = useContext(AuthContext);

    if (loading) {
        return <p>Loading...</p>;
    }

    if(resError) {
        return <Navigate to="/Error-Page-429" replace />
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;