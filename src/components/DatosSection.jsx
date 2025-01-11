import React, { useContext} from 'react';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BACKEND_API_URL} from '../utils/config'

export const DatosSection = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post(`${BACKEND_API_URL}/api/logout`)
            .then(() => {
                setUser(null); // Limpiar el estado del usuario
                navigate('/login'); // Redirigir a la página de inicio de sesión
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    };


    return (
        <>
            <div className='min-h-screen bg-darkSlate text-white flex flex-col items-center mt-20 p-8'>
                <div className='w-5/6 sm:w-3/4 lg:w-1/3 bg-darkBlue rounded-xl shadow-lg p-6 mt-8 relative'>
                    <h1 className='text-4xl font-bold text-center text-lightBlue mb-8'>Perfil del Usuario</h1>
                    <div className='flex items-center'>
                        <div
                            className='w-32 h-32 mr-6 relative cursor-pointer'
                            onClick={() => setShowMenu(true)}
                        >
                            <i className='bx bxs-user-circle text-9xl text-lightBlue'></i>
                            <div className='rounded-full absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity'>
                                <i className='bx bxs-pencil text-white text-3xl'></i>
                            </div>
                        </div>
                        <div>
                            <h2 className='text-2xl font-semibold mb-2'>{user.username}</h2>
                            <p className='text-lg text-gray'>{user.email}</p>
                        </div>
                    </div>
                    <div className='flex justify-center my-2'>
                        <button className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                            Editar Información
                        </button>
                        <button className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                            Cambiar Contraseña
                        </button>
                        <button onClick={handleLogout} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>Log Out</button>
                    </div>
                </div>
            </div>
        </>
    )
}
