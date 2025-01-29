import React, { useState, useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from '../../utils/config'
import { useAlert } from '../../utils/AlertContext';

export const DatosSection = () => {
    const [menus, setMenus] = useState({
        passwordMenu: false,
        informationMenu: false,
        imageMenu: false,
        twoFACodeSent: false
    })
    const [passwordData, setPasswordData] = useState({
        password: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [infoFormData, setInfoFormData] = useState({
        username: "",
        name: "",
        lastName: ""
    })
    const [status, setStatus] = useState({
        loading: false,
        error: ""
    })
    const [selectedImage, setSelectedImage] = useState(null);
    const [user2FACode, setUser2FACode] = useState(null);
    const { user } = useContext(AuthContext);
    const { mostrarAlerta } = useAlert();

    const handleChangePassword = (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!passwordData.password || !passwordData.newPassword || !passwordData.confirmPassword) {
            setStatus({ error: "All fields must be filled in", loading: false });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatus({ error: "Passwords do not match", loading: false });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setStatus({ error: "The password must be at least 6 characters", loading: false });
            return;
        }

        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/changepassword`, {
            password: passwordData.password,
            newPassword: passwordData.newPassword
        })
            .then((response) => {
                if (response.data.twoFARequired) {
                    mostrarAlerta({
                        tipo: true,
                        titulo: "2FA Requerido",
                        parrafo: "Se envio un código de verificación a su correo electrónico"
                    });
                    setTimeout(() => {
                        setStatus({ loading: false, ...status })
                        setMenus({ ...menus, passwordMenu: false, twoFACodeSent: true });
                    }, 1000);
                } else {
                    setPasswordData({ password: "", newPassword: "", confirmPassword: "" });
                    setMenus({ ...menus, passwordMenu: false });
                    mostrarAlerta({
                        tipo: true,
                        titulo: "Password updated",
                        parrafo: "Password updated successfully"
                    })
                }
            })
            .catch(err => {
                console.error("Error al cambiar contraseña: ", err);
                setStatus({ error: err.response.data.error, loading: false });
            })
        setStatus({ ...status, loading: false });
    }

    const handleConfirmNewPassword = (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/confirm-change-password`, {
            code: user2FACode,
            newPassword: passwordData.newPassword
        }, { withCredentials: true })
            .then((response) => {
                // Si el código es correcto, el backend creará el token y lo almacenará en la cookie
                mostrarAlerta({
                    tipo: true,
                    titulo: "Password updated",
                    parrafo: "Two-step verification was successful"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                if (error.status == 401) {
                    mostrarAlerta({
                        tipo: false,
                        titulo: "Incorrect code",
                        parrafo: "Please try again"
                    });
                }
                else {
                    console.error('Error al verificar 2FA:', error);
                    setStatus({ error: error.response.data.error, loading: false });
                }
            });
        setStatus({ ...status, loading: false });
    };

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: "" });
        if (!infoFormData.username && !infoFormData.name && !infoFormData.lastName) {
            setStatus({ error: "All fields must be filled in", loading: false });
            return;
        }

        axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/updateinfo`, {
            username: infoFormData.username,
            name: infoFormData.name,
            lastName: infoFormData.lastName
        })
            .then(() => {
                setInfoFormData({ username: "", name: "", lastName: "" });
                setMenus({ ...menus, informationMenu: false });
                setStatus({ loading: false, error: "" });
                window.location.reload();
            })
            .catch(err => {
                console.error("Error al actualizar la informacion: ", err);
                setStatus({ error: err.response.data.error, loading: false });
            })
    }

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/profiles/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Image uploaded successfully:', response.data);
            setMenus({ ...menus, imageMenu: false });
            window.location.reload();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <>
            <div className='w-9/10 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue rounded-t-xl shadow-lg p-6 mt-8 relative'>
                <h1 className='text-5xl font-bold text-center text-lightBlue mb-6'>User profile</h1>
                <div className='flex flex-col sm:flex-row items-center sm:items-start w-full'>
                    {/* Contenedor de la imagen (fuera del flujo con absolute) */}
                    <div className='relative sm:absolute flex flex-col items-center justify-center w-32 h-32 sm:w-32 sm:h-32 mb-6 sm:mb-0 mr-6 cursor-pointer'>
                        <div
                            className='w-full h-full relative cursor-pointer'
                            onClick={() => setMenus({ ...menus, imageMenu: true })} // Activar el menú de edición
                        >
                            {user.imageLink ? (
                                <img
                                    src={user.imageLink}
                                    alt="User Profile"
                                    className='w-full h-full object-cover rounded-full'
                                />
                            ) : (
                                <i className='bx bxs-user-circle text-9xl text-lightBlue'></i>
                            )}
                            {/* Superposición de editar imagen */}
                            <div className='rounded-full absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity'>
                                <i className='bx bxs-pencil text-white text-3xl'></i>
                            </div>
                        </div>
                    </div>
                    {/* Contenedor de los datos del usuario */}
                    <div className='flex flex-col items-center text-center sm:text-left flex-grow justify-center'>
                        <h2 className='text-3xl font-semibold mb-2'>{user.username}</h2>
                        <p className='text-xl text-gray'>{user.email}</p>
                        <div className='flex space-x-2'>
                            <p className='text-lg text-gray'>{user?.name || 'No name entered'}</p>
                            <p className='text-lg text-gray'>{user?.lastName || 'No last name entered'}</p>
                        </div>
                    </div>
                </div>
                {/* Botones */}
                <div className='flex justify-center my-4'>
                    <button onClick={() => setMenus({ ...menus, informationMenu: true })} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate transition-colors mx-2 duration-300'>
                        Edit Information
                    </button>
                    <button onClick={() => setMenus({ ...menus, passwordMenu: true })} className='bg-lightBlue text-darkBlue px-6 py-2 font-medium rounded-lg hover:bg-lightSlate transition-colors mx-2 duration-300'>
                        Change Password
                    </button>
                </div>
            </div>
            <div id='Menu-Change-Password'>
                {menus.passwordMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleChangePassword(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Change Password</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Current password</label>
                                <input
                                    type="password"
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Current password"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="New Password"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Confirm New Password"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, passwordMenu: false });
                                        setPasswordData({ password: "", newPassword: "", confirmPassword: "" });
                                        setStatus({ ...status, error: "" });
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Confirm
                                </button>
                            </div>
                            {status.error && <p className='text-red mt-2 text-center'>{status.error}</p>}
                            {status.loading && <p className='text-white mt-2 text-center'>Changing password...</p>}
                        </form>
                    </div>
                )}
            </div>
            <div id='Menu-Update-Information'>
                {menus.informationMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleUpdateInfo(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Update Information</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    onChange={(e) => setInfoFormData({ ...infoFormData, username: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    onChange={(e) => setInfoFormData({ ...infoFormData, name: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    onChange={(e) => setInfoFormData({ ...infoFormData, lastName: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter your last name"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, informationMenu: false });
                                        setInfoFormData({ username: "", name: "", lastName: "" });
                                        setStatus({ ...status, error: "" });
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Confirm
                                </button>
                            </div>
                            {status.error && <p className='text-red mt-2 text-center'>{status.error}</p>}
                            {status.loading && <p className='text-white mt-2 text-center'>Updating Info...</p>}
                        </form>
                    </div>
                )}
            </div>
            <div id='Image-Menu'>
                {menus.imageMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <div className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40">
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Upload Image</h2>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                className="w-full bg-darkSlate text-white mb-4 hidden"
                                id='Image-Input'
                            />
                            <label htmlFor='Image-Input' className='flex justify-center m-auto w-1/2 cursor-pointer bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Select File</label>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => setMenus({ ...menus, imageMenu: false })}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    onClick={handleImageUpload}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate transition-colors duration-300'
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div id='Menu-Change-Password'>
                {menus.twoFACodeSent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleConfirmNewPassword(e)}>
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
                                        setMenus({ ...menus, twoFACodeSent: false });
                                        setUser2FACode(null)
                                        setStatus({ ...status, error: "" });
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
                            {status.loading && <p className='text-white mt-2 text-center'>Changing Password...</p>}
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
