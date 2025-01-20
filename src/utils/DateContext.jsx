import React, { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 15)), // Últimas 2 semanas
        endDate: new Date()
    });

    return (
        <DateContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => useContext(DateContext);