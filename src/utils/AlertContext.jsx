import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const AlertContext = createContext({
    alerta: {
        activa: false,
        tipo: false,
        titulo: "",
        descripcion: ""
    },
    mostrarAlerta: () => { },
    ocultarAlerta: () => { }
});

// Proveedor del contexto
export const AlertProvider = ({ children }) => {
    const [alerta, setAlerta] = useState({
        activa: false,
        tipo: false,
        titulo: "",
        parrafo: ""
    });

    // Función para mostrar la alerta
    const mostrarAlerta = ({ tipo, titulo, parrafo }) => {
        setAlerta({
            activa: true,
            tipo,
            titulo,
            parrafo
        });
    };

    // Función para ocultar la alerta y vaciar los datos
    const ocultarAlerta = () => {
        setAlerta({
            activa: false,
            tipo: false,
            titulo: "",
            parrafo: ""
        });
    };

    return (
        <AlertContext.Provider value={{ alerta, mostrarAlerta, ocultarAlerta }}>
            {children}
        </AlertContext.Provider>
    );
};

// Hook para usar el contexto
export const useAlert = () => {
    return useContext(AlertContext);
};