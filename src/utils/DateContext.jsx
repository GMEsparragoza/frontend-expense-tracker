import React, { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
    // Calcular el primer día del mes actual
    const getStartOfMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1); // Año, mes, día 1
    };

    const [dateRange, setDateRange] = useState({
        startDate: getStartOfMonth().toISOString(), // Últimas 2 semanas en UTC
        endDate: new Date().toISOString() // Fecha actual en UTC
    });

    return (
        <DateContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => useContext(DateContext);