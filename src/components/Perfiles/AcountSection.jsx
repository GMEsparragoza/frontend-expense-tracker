import React, { useState, useContext } from 'react'
import { sendEnable2FAMail, sendDisable2FAMail, sendValidationEmail } from '../../utils/sendEmail'
import { AuthContext } from '../../utils/AuthContext';
import { useAlert } from '../../utils/AlertContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../../utils/config'

export const AcountSection = () => {
    const [menus, setMenus] = useState({
        verifyMenu: false,
        deleteMenu: false,
        twoFACodeSent: false
    })
    const [status, setStatus] = useState({
        loading: false,
        error: ""
    })
    const [twoFACodes, setTwoFACodes] = useState({
        verificationCode: "",
        user2FACode: ""
    })
    const { user, setUser } = useContext(AuthContext);
    const { mostrarAlerta } = useAlert();
    const navigate = useNavigate();

    const handleSend2FACode = async () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        setTwoFACodes({ ...twoFACodes, verificationCode: code });
        if (!user.two_fa) {
            sendEnable2FAMail(user.email, code);
        }
        else {
            sendDisable2FAMail(user.email, code);
        }
        mostrarAlerta({
            tipo: true,
            titulo: "2FA Code sent",
            parrafo: "An email was sent with the verification code"
        })
        setTimeout(() => {
            setMenus({ ...menus, verifyMenu: true });
        }, 1000);

    }

    const handleDeleteCode = async () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        setTwoFACodes({ ...twoFACodes, verificationCode: code });
        sendValidationEmail(user.email, code);
        mostrarAlerta({
            tipo: true,
            titulo: "2FA Code sent",
            parrafo: "An email was sent with the verification code"
        })
        setTimeout(() => {
            setMenus({ ...menus, twoFACodeSent: true });
        }, 1000);
    }

    const handleActivate2FA = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!twoFACodes.user2FACode || twoFACodes.user2FACode != twoFACodes.verificationCode) {
            setStatus({ error: "Incorrect or missing code", loading: false });
        }
        else {
            try {
                await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/activate-2fa`)
                mostrarAlerta({
                    tipo: true,
                    titulo: "2FA Actived",
                    parrafo: "Two-step verification was activated"
                })
                setStatus({ loading: false });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('Error Activating Account:', err);
            }
        }
    }

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!twoFACodes.user2FACode || twoFACodes.user2FACode != twoFACodes.verificationCode) {
            setStatus({ error: "Incorrect or missing code", loading: false });
        }
        else {
            try {
                await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/disable-2fa`)
                mostrarAlerta({
                    tipo: true,
                    titulo: "2FA Disabled",
                    parrafo: "Two-step verification was Disabled"
                })
                setStatus({ loading: false });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('Error Activating Account:', error);
            }
        }
    }

    const handleLogout = () => {
        axios.post(`${REACT_APP_BACKEND_API_URL}/api/logout`)
            .then(() => {
                setUser(null); // Limpiar el estado del usuario
                mostrarAlerta({
                    tipo: true,
                    titulo: "Session closed",
                    parrafo: "The session was closed successfully"
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    };

    const handleDeleteAcount = (e) => {
        e.preventDefault();
        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/delete-account`)
            .then(async (response) => {
                if (response.data.twoFARequired) {
                    await handleDeleteCode();
                }
                else {
                    setUser(null); // Limpiar el estado del usuario
                    mostrarAlerta({
                        tipo: true,
                        titulo: "Account Deleted",
                        parrafo: "The account was deleted successfully"
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    };

    const handleConfirmDeleteAcount = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!twoFACodes.user2FACode || twoFACodes.user2FACode != twoFACodes.verificationCode) {
            setStatus({ error: "Incorrect or missing code", loading: false });
        }
        try {
            await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/confirm-delete-account`)
            setUser(null); // Limpiar el estado del usuario
            mostrarAlerta({
                tipo: true,
                titulo: "Account Deleted",
                parrafo: "The account was deleted successfully"
            });
            setStatus({ loading: false });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            console.error('Error Activating Account:', error);
        }
    }

    return (
        <>
            <div className='w-9/10 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative'>
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
                <div className='flex justify-center my-4'>
                    <button onClick={() => setMenus({ ...menus, deleteMenu: true})} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                        Delete account
                    </button>
                    <button onClick={handleLogout} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate hover:text-darkBlue transition-colors mx-2'>
                        Log Out
                    </button>
                </div>
            </div>
            <div id='Menu-Change-Password'>
                {menus.verifyMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={!user.two_fa ? ((e) => handleActivate2FA(e)) : ((e) => handleDisable2FA(e))}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>{!user.two_fa ? 'Do you want to enable 2FA?' : 'Do you want to disable 2FA?'}</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setTwoFACodes({ ...twoFACodes, user2FACode: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, verifyMenu: false });
                                        setTwoFACodes({ ...twoFACodes, user2FACode: "" });
                                        setStatus({ error: "" });
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
                            {status.loading && <p className='text-white mt-2 text-center'>{user.two_fa ? 'Disabling 2FA...' : 'Enabling 2FA...'}</p>}
                        </form>
                    </div>
                )}
            </div>
            <div id='Menu-Change-Password'>
                {menus.deleteMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleDeleteAcount(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Delete account permanently</h2>
                            <p className="text-white text-center mb-5">
                                Warning: Deleting your account is a permanent action and cannot be undone. All your data will be permanently removed and you will no longer be able to access your account. Please ensure you want to proceed before confirming.
                            </p>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, deleteMenu: false });
                                        setStatus({ error: "" });
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
                            {status.loading && <p className='text-white mt-2 text-center'>Deleting Account...</p>}
                        </form>
                    </div>
                )}
            </div>
            <div id='Menu-Change-Password'>
                {menus.twoFACodeSent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleConfirmDeleteAcount(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Verify 2FA</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Verification Code</label>
                                <input
                                    type="number"
                                    onChange={(e) => setTwoFACodes({ ...twoFACodes, user2FACode: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter the Verification Code"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, twoFACodeSent: false });
                                        setTwoFACodes({ ...twoFACodes, user2FACode: "" });
                                        setStatus({ error: "" });
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
                            {status.loading && <p className='text-white mt-2 text-center'>Deleting Account...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
