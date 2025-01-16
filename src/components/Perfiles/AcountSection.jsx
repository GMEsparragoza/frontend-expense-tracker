import React, { useState, useContext } from 'react'
import { sendEnable2FAMail } from '../../utils/sendEmail'
import { AuthContext } from '../../utils/AuthContext';
import { useAlert } from '../../utils/AlertContext'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../../utils/config'

export const AcountSection = () => {
    const [verifyMenu, setVerifyMenu] = useState(false);
    const [verificationCode, setVerificationCode] = useState(null);
    const [userCode, setUserCode] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { mostrarAlerta } = useAlert();

    const handleSend2FACode = async () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        setVerificationCode(code);
        await sendEnable2FAMail(user.email, code);
        mostrarAlerta({
            tipo: true,
            titulo: "Codigo enviado",
            parrafo: "Se envio un mail con el codigo de verificacion"
        })
        setTimeout(() => {
            setVerifyMenu(true)
        }, 1000);
    }

    const handleActivate2FA = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!userCode || userCode != verificationCode) {
            setError("Incorrect or missing code");
            setLoading(false);
        }
        else {
            try {
                await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/activate-2fa`)
                mostrarAlerta({
                    tipo: true,
                    titulo: "2FA Actived",
                    parrafo: "Two-step verification was activated"
                })
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('Error Activating Account:', error);
            }
        }
    }

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!userCode || userCode != verificationCode) {
            setError("Incorrect or missing code");
            setLoading(false);
        }
        else {
            try {
                await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/disable-2fa`)
                mostrarAlerta({
                    tipo: true,
                    titulo: "2FA Disabled",
                    parrafo: "Two-step verification was Disabled"
                })
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('Error Activating Account:', error);
            }
        }
    }

    return (
        <>
            <div className='w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative'>
                <h1 className='text-5xl font-bold text-center text-lightBlue mb-6'>Account Options</h1>
                <div className='flex justify-center my-4'>
                    {!user.two_fa && (
                        <button onClick={() => handleSend2FACode()} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                            Activate 2FA
                        </button>
                    )}
                    {user.two_fa && (
                        <button onClick={() => handleSend2FACode()} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                            Disable 2FA
                        </button>
                    )}
                </div>
            </div>
            <div id='Menu-Change-Password'>
                {verifyMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={!user.two_fa ? ((e) => handleActivate2FA(e)) : ((e) => handleDisable2FA(e))}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>{!user.two_fa ? 'Do you want to enable 2FA?' : 'Do you want to disable 2FA?'}</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setVerifyMenu(false)
                                        setUserCode(null)
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
                            {loading && <p className='text-white mt-2 text-center'>{user.two_fa ? 'Disabling 2FA...' : 'Enabling 2FA...'}</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
