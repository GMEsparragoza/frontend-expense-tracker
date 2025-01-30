import React, { useState } from 'react'
import { sendValidationEmail } from '../utils/sendEmail'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config'
import { useAlert } from '../utils/AlertContext';

const ResetPassword = () => {
    const [resetEmail, setResetEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState(null);
    const [toggleVerify, setToggleVerify] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [userCode, setUserCode] = useState(null);
    const [passwords, setPasswords] = useState({ newPassword: null, confirmPassword: null })
    const [status, setStatus] = useState({ loading: false, error: null })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { mostrarAlerta } = useAlert();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null })
        if (!resetEmail) {
            setStatus({ loading: false, error: 'You must enter an email to reset the password' })
            return;
        }
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(resetEmail)) {
                setStatus({ loading: false, error: 'The email format is incorrect' })
                return;
            }
            const code = Math.floor(100000 + Math.random() * 900000);
            setVerificationCode(code);
            await sendValidationEmail(resetEmail, code);
            setToggleVerify(true);
            setStatus({ loading: false, error: null })
        } catch (error) {
            console.error(error)
            setStatus({ loading: false, error: error })
        }
    }

    const handleVerifyCode = () => {
        setStatus({ loading: false, error: null })
        if (!userCode) {
            setStatus({ loading: false, error: 'Enter the verification code' })
            return;
        }
        if (userCode != verificationCode) {
            setStatus({ loading: false, error: 'Invalid code, please try again' })
            return;
        }
        setEmailVerified(true);
        setStatus({ loading: false, error: null })
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null })
        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ loading: false, error: 'Passwords not match' })
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus({ loading: false, error: 'The password must contain at least 6 characters' })
            return;
        }
        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/reset-password`, {
            email: resetEmail,
            newPassword: passwords.newPassword
        })
            .then(response => {
                mostrarAlerta({
                    tipo: true,
                    titulo: `${response.data.message}`,
                    parrafo: "Please try to log in again"
                })
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            })
            .catch(err => {
                setStatus({ loading: false, error: err.response.data.message })
            })
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
                            {status.loading && <p className='text-white mt-2 text-center'>Sending Email...</p>}
                        </div>}
                        {toggleVerify && <div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className="appearance-none -webkit-appearance-none focus:outline-none w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
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
                                {status.loading && <p className='text-white mt-2 text-center'>verifying code...</p>}
                            </div>
                        </div>}
                        {status.error && <p className='text-darkRed mt-2 text-center'>{status.error}</p>}
                    </form>
                </div>}
                {emailVerified && <div id='Menu-Reset-Password' className='h-[700px] w-full max-w-[600px] bg-darkBlue px-8 pt-10 pb-20 rounded-lg shadow-lg flex flex-col items-center'>
                    <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-10" onSubmit={(e) => handleResetPassword(e)}>
                        <h2 className='text-2xl font-medium text-white mb-5 text-center'>Reset Password</h2>
                        <div className='my-4 relative'>
                            <label className="block text-gray text-sm font-medium mb-1">New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Enter your new password"
                                value={passwords.newPassword}
                            />
                            <i className={`${showPassword ? 'bx bx-show' : 'bx bx-hide'} absolute right-3 top-10 cursor-pointer text-white`}
                                onClick={() => setShowPassword(!showPassword)}></i>
                        </div>
                        <div className='my-4 relative'>
                            <label className="block text-gray text-sm font-medium mb-1">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Confirm your password"
                                value={passwords.confirmPassword}
                            />
                            <i className={`${showConfirmPassword ? 'bx bx-show' : 'bx bx-hide'} absolute right-3 top-10 cursor-pointer text-white`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                        </div>
                        <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                            <button
                                type='button'
                                onClick={() => {
                                    setPasswords({ newPassword: null, confirmPassword: null })
                                    setStatus({ loading: false, error: null })
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
                        {status.loading && <p className='text-white mt-2 text-center'>Resetting password...</p>}
                        {status.error && <p className='text-darkRed mt-2 text-center'>{status.error}</p>}
                    </form>
                </div>}
            </div>
        </>
    )
}

export default ResetPassword