import React, { useState } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext'
import {sendValidationEmail} from '../utils/sendEmail'

export const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user2FACode, setUser2FACode] = useState(null);
    const [twoFACode, setTwoFACode] = useState(null);
    const [twoFACodeSent, setTwoFACodeSent] = useState(false);
    const { mostrarAlerta } = useAlert();

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

        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/verify-new-user`, { username, email })
            .then(async response => {
                const code = Math.floor(100000 + Math.random() * 900000);
                setTwoFACode(code);
                await sendValidationEmail(email, code);
                setTwoFACodeSent(true);
                mostrarAlerta({
                    tipo: true,
                    titulo: "Verify account",
                    parrafo: "A verification email was sent to your email"
                })
            })
            .catch(error => {
                setError(error.response.data.message);
            });
        setLoading(false);
    }

    const handleVerifyTwoFACode = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!twoFACode) {
            setError("The verification code must be entered");
            setLoading(false);
            return;
        }
        if (user2FACode != twoFACode) {
            setError("The verification code is incorrect");
            setLoading(false);
            return;
        }
        await axios.post(`${REACT_APP_BACKEND_API_URL}/api/signup`, { username, email, password })
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
                setError(error.response.data.message);
            });
        setLoading(false);
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
                {error && !twoFACodeSent && <p className='text-red mt-2 text-center'>{error}</p>}
                {loading && !twoFACodeSent && <p className='text-white mt-2 text-center'>Verifying Data...</p>}
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
                                    onChange={(e) => setUser2FACode(e.target.value)}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setTwoFACodeSent(false)
                                        setUser2FACode(null)
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
                            {loading && <p className='text-white mt-2 text-center'>Signin Up...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
