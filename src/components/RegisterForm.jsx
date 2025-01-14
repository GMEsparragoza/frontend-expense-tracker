import React, { useState } from 'react'
import axios from 'axios'
import {REACT_APP_BACKEND_API_URL} from '../utils/config'
import {useAlert} from '../utils/AlertContext'

export const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {mostrarAlerta} = useAlert();

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!username || !email || !password || !confirmPassword) {
            setError("Data must be entered");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("The password must contain at least 6 characters");
            setLoading(false);
            return;
        }

        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/signup`, {
            username,
            email,
            password,
        })
            .then(response => {
                console.log('Registro exitoso:', response.data.message);
                setLoading(false);
                mostrarAlerta({
                    tipo: true,
                    titulo: "Registro Exitoso",
                    parrafo: "Usuario registrado correctamente"
                })
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error en la respuesta:', error.response.data);
                } else if (error.request) {
                    console.error('Error en la solicitud:', error.request);
                } else {
                    console.error('Error general:', error.message);
                }
                setLoading(false);
                mostrarAlerta({
                    tipo: false,
                    titulo: "No se pudo completar el Registro",
                    parrafo: "Hubo un problema al completar el registro"
                })
            });
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmitForm(e)} className="w-full max-w-[500px] mx-auto">
                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Sign Up</h2>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Username</label>
                    <input type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your username" />
                </div>
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
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Confirm Password</label>
                    <input type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Confirm your password" />
                </div>
                <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Sign Up</button>
                {error && <p className='text-red mt-2 text-center'>{error}</p>}
                {loading && <p className='text-white mt-2 text-center'>Signing Up...</p>}
            </form>
        </>
    )
}
