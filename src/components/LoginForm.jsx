import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext'
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [formLogin, setFormLogin] = useState({
        email: "",
        password: ""
    })
    const [status, setStatus] = useState({
        loading: false,
        error: null
    })
    const [twoFAData, setTwoFAData] = useState({
        menu: false,
        code: null
    })
    const { mostrarAlerta } = useAlert();
    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });
        if (!formLogin.email || !formLogin.password) {
            setStatus({ loading: false, error: "All fields are required" });
            return;
        }
        axios.post(`${REACT_APP_BACKEND_API_URL}/api/signin`, {
            email: formLogin.email,
            password: formLogin.password
        }, { withCredentials: true })
            .then((response) => {
                // Si el backend responde que se necesita 2FA
                if (response.data.twoFARequired) {
                    mostrarAlerta({
                        tipo: true,
                        titulo: "2FA Requerido",
                        parrafo: "Se envio un código de verificación a su correo electrónico"
                    });
                    setTimeout(() => {
                        setTwoFACodeSent(true);
                        setStatus({ loading: false, error: null });
                    }, 1000);
                } else {
                    mostrarAlerta({
                        tipo: true,
                        titulo: "Sesion Iniciada",
                        parrafo: "Se inicio sesion correctamente"
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error en la respuesta:', error.response.data);
                    setStatus({ loading: false, error: error.response.data.message });
                } else if (error.request) {
                    console.error('Error en la solicitud:', error.request);
                    setStatus({ loading: false, error: error.request });
                } else {
                    console.error('Error general:', error.message);
                    setStatus({ loading: false, error: error.message });
                }
                setStatus({ loading: false, ...status });
            });
    }

    // Cuando el usuario ingresa el código de 2FA
    const handleVerifyTwoFACode = (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });
        axios.post(`${REACT_APP_BACKEND_API_URL}/api/verify-2fa`, {
            code: twoFAData.code,
            email: formLogin.email
        }, { withCredentials: true })
            .then((response) => {
                // Si el código es correcto, el backend creará el token y lo almacenará en la cookie
                mostrarAlerta({
                    tipo: true,
                    titulo: "Sesion Iniciada",
                    parrafo: "La verificación en dos pasos fue correcta"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                console.error('Error al verificar 2FA:', error);
                setStatus({ loading: false, error: error.response.data.message });
            });
    };

    return (
        <>
            <form className="w-full max-w-[500px] mx-auto" onSubmit={(e) => handleSubmitForm(e)}>
                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Sign In</h2>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">E-mail</label>
                    <input type="email"
                        value={formLogin.email}
                        onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your email" />
                </div>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Password</label>
                    <input type="password"
                        value={formLogin.password}
                        onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your password" />
                </div>
                <button type='button' onClick={() => navigate('/reset-password')} className='w-full text-lightBlue py-2 font-medium rounded mt-6 transition-colors'>Forgot your password?</button>
                <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Sign In</button>
                {!twoFAData.menu && (<div>
                    {status.error && <p className='text-red mt-2 text-center'>{status.error}</p>}
                    {status.loading && <p className='text-white mt-2 text-center'>Loggin in...</p>}
                </div>)}
            </form>
            <div id='Menu-Change-Password'>
                {twoFAData.menu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleVerifyTwoFACode(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Verify 2FA</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setTwoFAData({ ...twoFAData, code: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setTwoFAData({ menu: false, code: null })
                                        setStatus({ ...status, error: null })
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Confirm
                                </button>
                            </div>
                            {status.error && <p className='text-red mt-2 text-center'>{status.error}</p>}
                            {status.loading && <p className='text-white mt-2 text-center'>Loggin in...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
