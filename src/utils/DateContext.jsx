import React, { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(), // Últimas 2 semanas en UTC
        endDate: new Date().toISOString() // Fecha actual en UTC
    });

    return (
        <DateContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => useContext(DateContext);