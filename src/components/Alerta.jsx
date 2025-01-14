import React, { useEffect } from 'react';
import { useAlert } from '../utils/AlertContext';

const Alerta = () => {
    const { alerta, ocultarAlerta } = useAlert();

    useEffect(() => {
        if (alerta.activa && alerta.tipo) {
            const timer = setTimeout(() => {
                ocultarAlerta();
            }, 1000); // Ocultar después de 1 segundo
            return () => clearTimeout(timer); // Limpia el temporizador al desmontar o cambiar la alerta
        }
    }, [alerta, ocultarAlerta]);

    const bgColor = alerta.tipo ? 'bg-darkBlue' : 'bg-red';

    return (
        <>
            {alerta.activa && (
                <div
                    className={`fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-20`}
                >
                    <div
                        className={`max-w-md w-full p-8 rounded-lg shadow-xl flex flex-col items-center space-y-6 ${bgColor} text-white`}
                    >
                        <div className="text-center">
                            {alerta.tipo ? (
                                <i className='bx bx-check-circle text-lightBlue text-5xl' />
                            ) : (
                                <i className='bx bx-x-circle text-red text-5xl' />
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">{alerta.titulo}</h3>
                            <p className="text-lg leading-7">{alerta.parrafo}</p>
                        </div>
                        {!alerta.tipo && (
                            <button
                                className="px-6 py-3 bg-lightBlue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                onClick={ocultarAlerta}
                            >
                                Aceptar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};


export default Alerta;