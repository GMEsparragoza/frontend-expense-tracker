import React, { useState } from 'react'
import { sendValidationEmail } from '../utils/sendEmail'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {REACT_APP_BACKEND_API_URL} from '../utils/config'
import { useAlert } from '../utils/AlertContext';

const ResetPassword = () => {
    const [resetEmail, setResetEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState(null);
    const [toggleVerify, setToggleVerify] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [userCode, setUserCode] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {mostrarAlerta} = useAlert();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!resetEmail) {
            setError("You must enter an email to reset the password");
            setLoading(false);
            return;
        }
        try {
            const code = Math.floor(100000 + Math.random() * 900000);
            setVerificationCode(code);
            await sendValidationEmail(resetEmail, code);
            setToggleVerify(true);
        } catch (error) {
            console.error(error)
        }
        setLoading(false);
    }

    const handleVerifyCode = () => {
        setError("");
        setLoading(true);
        if (!userCode) {
            setError("Enter the verification code");
            setLoading(false);
            return;
        }
        if (userCode != verificationCode) {
            setError("Invalid code, please try again");
            console.log(userCode);
            console.log(verificationCode)
            setLoading(false);
            return;
        }
        setEmailVerified(true);
        setLoading(false)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (newPassword !== confirmPassword) {
            setError("Passwords not match");
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setError("The password must contain at least 6 characters");
            setLoading(false);
            return;
        }
        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/reset-password`, {
            email: resetEmail,
            newPassword
        })
            .then(() => {
                setNewPassword("");
                mostrarAlerta({
                    tipo: true,
                    titulo: "password reset",
                    parrafo: "Please try to log in again"
                })
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            })
            .catch(err => {
                console.error("Error al resetear contraseña: ", err);
                setError("Error resseting password");
            })
        setLoading(false);
    }

    return (
        <>
            <div className="min-h-screen bg-darkSlate text-white flex flex-col items-center justify-center">
                {!emailVerified && <div id='Menu-Reset-Password' className='h-[700px] w-full max-w-[600px] bg-darkBlue px-8 pt-10 pb-20 rounded-lg shadow-lg flex flex-col items-center'>
                    <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-10" onSubmit={(e) => handleVerifyEmail(e)}>
                        <h2 className='text-2xl font-medium text-white mb-5 text-center'>Reset Password</h2>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">E-mail</label>
                            <input
                                type="email"
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                        {!toggleVerify && <div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => navigate('/login')}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Send Email
                                </button>
                            </div>
                            {loading && <p className='text-white mt-2 text-center'>Sending Email...</p>}
                        </div>}
                        {toggleVerify && <div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the verification code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setResetEmail("");
                                        setError("");
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleVerifyCode()}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Verify Code
                                </button>
                                {loading && <p className='text-white mt-2 text-center'>verifying code...</p>}
                            </div>
                        </div>}
                        {error && <p className='text-red mt-2 text-center'>{error}</p>}
                    </form>
                </div>}
                {emailVerified && <div id='Menu-Reset-Password' className='h-[700px] w-full max-w-[600px] bg-darkBlue px-8 pt-10 pb-20 rounded-lg shadow-lg flex flex-col items-center'>
                    <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-10" onSubmit={(e) => handleResetPassword(e)}>
                        <h2 className='text-2xl font-medium text-white mb-5 text-center'>Reset Password</h2>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Enter your new password"
                            />
                        </div>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">Confirm Password</label>
                            <input
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                            <button
                                type='button'
                                onClick={() => {
                                    setNewPassword(null);
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
                                Reset Password
                            </button>
                        </div>
                        {loading && <p className='text-white mt-2 text-center'>Resetting password...</p>}
                        {error && <p className='text-red mt-2 text-center'>{error}</p>}
                    </form>
                </div>}
            </div>
        </>
    )
}

export default ResetPassword