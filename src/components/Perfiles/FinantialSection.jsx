import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../../utils/config'
import { useAlert } from '../../utils/AlertContext'

export const FinantialSection = () => {
    const [confirmMenu, setConfirmMenu] = useState(false);
    const [status, setStatus] = useState({
        loading: false,
        error: null
    })
    const { mostrarAlerta } = useAlert();
    const handleExcelData = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });

        try {
            const response = await axios.get(`${REACT_APP_BACKEND_API_URL}/profiles/generate-excel-data`, {
                responseType: 'blob' // Asegurar que la respuesta sea tratada como un archivo
            });

            // Crear un Blob con los datos recibidos
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace invisible y forzar la descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Estado_Financiero.xlsx';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url); // Liberar memoria
            mostrarAlerta({
                tipo: true,
                titulo: `Excel downloaded`,
                parrafo: `Excel downloaded successfully`
            });
            setTimeout(() => {
                setStatus({ error: null, loading: false })
                setConfirmMenu(false);
            }, 1500);
        } catch (error) {
            console.error('Error', error);
            setStatus({ loading: false, error: error.response?.data?.message || "Error downloading Excel" });
        }
    };

    return (
        <>
            <div className='w-9/10 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 relative'>
                <h1 className='text-5xl font-bold text-center text-lightBlue mb-6'>Financial Section</h1>
                <div className='flex justify-center my-4'>
                    <button onClick={() => setConfirmMenu(true)} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate transition-colors mx-2 duration-300'>
                        Download Excel Data
                    </button>
                </div>
            </div>
            <div id='Menu-Download-Excel'>
                {confirmMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleExcelData(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Download Excel Data</h2>
                            <p className="text-white text-center mb-5">
                                Are you sure you want to download the excel with your account data?
                            </p>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setConfirmMenu(false);
                                        setStatus({ ...status, error: null });
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Confirm
                                </button>
                            </div>
                            {status.error && <p className='text-darkRed mt-2 text-center'>{status.error}</p>}
                            {status.loading && <p className='text-white mt-2 text-center'>Downloading Excel...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
