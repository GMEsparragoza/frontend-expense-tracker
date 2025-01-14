import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext'

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { mostrarAlerta } = useAlert();

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!email || !password) {
            setError("Data must be entered");
            setLoading(false);
            return;
        }
        axios.post(`${REACT_APP_BACKEND_API_URL}/api/signin`, {
            email,
            password
        }, { withCredentials: true })
            .then(() => {
                console.log('Inicio de Sesion Exitoso:');
                mostrarAlerta({
                    tipo: true,
                    titulo: "Sesion Iniciada",
                    parrafo: "Se inicio sesion correctamente"
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
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
                mostrarAlerta({
                    tipo: false,
                    titulo: "Error al Iniciar Sesion",
                    parrafo: "No se pudo iniciar sesion"
                })
            });
    }


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
                <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Sign In</button>
                {error && <p className='text-red mt-2 text-center'>{error}</p>}
                {loading && <p className='text-white mt-2 text-center'>Loggin in...</p>}
            </form>
        </>
    )
}
