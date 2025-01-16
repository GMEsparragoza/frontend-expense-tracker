import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext'
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [twoFACodeSent, setTwoFACodeSent] = useState(false);
    const [twoFACode, setTwoFACode] = useState(null);
    const { mostrarAlerta } = useAlert();
    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Data must be entered");
            setLoading(false);
            return;
        }
        axios.post(`${REACT_APP_BACKEND_API_URL}/api/signin`, {
            email,
            password
        }, { withCredentials: true })
            .then((response) => {
                // Si el backend responde que se necesita 2FA
                if (response.data.twoFARequired) {
                    setTwoFACodeSent(true);
                    setLoading(false);
                } else {
                    console.log('Inicio de Sesion Exitoso:');
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
                    setError(error.response.data.message);
                } else if (error.request) {
                    console.error('Error en la solicitud:', error.request);
                    setError(error.request?.data?.message);
                } else {
                    console.error('Error general:', error.message);
                    setError(error.message);
                }
                setLoading(false);
            });
    }

    // Cuando el usuario ingresa el código de 2FA
    const handleVerifyTwoFACode = (e) => {
        e.preventDefault();

        axios.post(`${REACT_APP_BACKEND_API_URL}/api/verify-2fa`, {
            code: twoFACode,
            email
        }, { withCredentials: true })
            .then((response) => {
                // Si el código es correcto, el backend creará el token y lo almacenará en la cookie
                console.log('Verificación 2FA exitosa');
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
                setError("Código incorrecto o expirado.");
                setLoading(false);
            });
    };

    return (
        <>
            <form className="w-full max-w-[500px] mx-auto" onSubmit={(e) => handleSubmitForm(e)}>
                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Sign In</h2>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">E-mail</label>
                    <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your email" />
                </div>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Password</label>
                    <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your password" />
                </div>
                <button type='button' onClick={() => navigate('/reset-password')} className='w-full text-lightBlue py-2 font-medium rounded mt-6 transition-colors'>Forgot your password?</button>
                <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Sign In</button>
                {!twoFACodeSent && (<div>
                    {error && <p className='text-red mt-2 text-center'>{error}</p>}
                    {loading && <p className='text-white mt-2 text-center'>Loggin in...</p>}
                </div>)}
            </form>
            <div id='Menu-Change-Password'>
                {twoFACodeSent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleVerifyTwoFACode(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Verify 2FA</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setTwoFACode(e.target.value)}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setTwoFACodeSent(false)
                                        setTwoFACode(null)
                                        setError("");
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
                            {error && <p className='text-red mt-2 text-center'>{error}</p>}
                            {loading && <p className='text-white mt-2 text-center'>Loggin in...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
