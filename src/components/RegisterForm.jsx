import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext'
import {sendValidationEmail} from '../utils/sendEmail'

export const RegisterForm = () => {
    const [formRegister, setFormRegister] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [status, setStatus] = useState({
        loading: false,
        error: ""
    })
    const [twoFACode, setTwoFACode] = useState(null);
    const [usertwoFACode, setUserTwoFACode] = useState(null);
    const [twoFAMenu, setTwoFAMenu] = useState(false);
    const { mostrarAlerta } = useAlert();

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setStatus({ ...status, error: "" });
        setStatus({ ...status, loading: true });
        if (!formRegister.username || !formRegister.email || !formRegister.password || !formRegister.confirmPassword) {
            setStatus({ error: "Data must be entered", loading: false });
            return;
        }
        if (formRegister.password !== formRegister.confirmPassword) {
            setStatus({ error: "Passwords do not match", loading: false });
            return;
        }
        if (formRegister.password.length < 6) {
            setStatus({ error: "The password must be at least 6 characters", loading: false });
            return;
        }

        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/verify-new-user`, { username: formRegister.username, email: formRegister.email })
            .then(async response => {
                const code = Math.floor(100000 + Math.random() * 900000);
                setTwoFACode(code);
                await sendValidationEmail(formRegister.email, code);
                setTwoFAMenu(true);
                mostrarAlerta({
                    tipo: true,
                    titulo: "Verify account",
                    parrafo: "A verification email was sent to your email"
                })
            })
            .catch(error => {
                setStatus({ error: error.response.data.message, loading: false });
            });
        setStatus({ ...status, loading: false });
    }

    const handleVerifyTwoFACode = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!usertwoFACode) {
            setStatus({ error: "The verification code must be entered", loading: false });
            return;
        }
        if (usertwoFACode != twoFACode) {
            setStatus({ error: "The verification code is incorrect", loading: false });
            return;
        }
        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/signup`, { username: formRegister.username, email: formRegister.email, password: formRegister.password })
            .then(response => {
                mostrarAlerta({
                    tipo: true,
                    titulo: "Verified Account",
                    parrafo: "Registration completed successfully"
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                setStatus({ error: error.response.data.message, loading: false });
            });
        setStatus({ ...status, loading: false });
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmitForm(e)} className="w-full max-w-[500px] mx-auto">
                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Sign Up</h2>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Username</label>
                    <input type="text"
                        value={formRegister.username}
                        onChange={(e) => setFormRegister({ ...formRegister, username: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your username" />
                </div>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">E-mail</label>
                    <input type="email"
                        value={formRegister.email}
                        onChange={(e) => setFormRegister({ ...formRegister, email: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your email" />
                </div>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Password</label>
                    <input type="password"
                        value={formRegister.password}
                        onChange={(e) => setFormRegister({ ...formRegister, password: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Enter your password" />
                </div>
                <div className='my-4'>
                    <label className="block text-gray text-sm font-medium mb-1">Confirm Password</label>
                    <input type="password"
                        value={formRegister.confirmPassword}
                        onChange={(e) => setFormRegister({ ...formRegister, confirmPassword: e.target.value })}
                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                        placeholder="Confirm your password" />
                </div>
                <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Sign Up</button>
                {status.error && !twoFAMenu && <p className='text-red mt-2 text-center'>{status.error}</p>}
                {status.loading && !twoFAMenu && <p className='text-white mt-2 text-center'>Verifying Data...</p>}
            </form>
            <div id='Menu-Change-Password'>
                {twoFAMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleVerifyTwoFACode(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Verify 2FA</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setUserTwoFACode(e.target.value)}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setUserTwoFACode(null);
                                        setTwoFAMenu(false);
                                        setStatus({ error: "", ...status });
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
                            {status.loading && <p className='text-white mt-2 text-center'>Signin Up...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
