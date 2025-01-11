import React, { useState, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm'
import { AuthContext } from '../utils/AuthContext';

const LoginPage = () => {
    const [toggleForm, setToggleForm] = useState(false);
    const { user } = useContext(AuthContext);

    // Si el usuario está autenticado, redirigir a /dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <div className="min-h-screen bg-darkSlate text-white flex flex-col items-center justify-center">
                <div className='h-[700px] w-full max-w-[600px] bg-darkBlue px-8 pt-10 pb-20 rounded-lg shadow-lg flex flex-col items-center'>
                    <div className="w-full h-full bg-darkSlate rounded-lg shadow-lg p-4">
                        <div className="flex justify-center mb-8">
                            <Link to=""
                                className={`py-2 px-4 text-sm font-medium border border-lightSlate rounded-l cursor-pointer ${toggleForm ? "bg-lightSlate text-darkBlue" : "bg-darkBlue text-white"}`}
                                onClick={() => setToggleForm(false)}>
                                Login
                            </Link>
                            <Link to=""
                                className={`py-2 px-4 text-sm font-medium border border-lightSlate rounded-r cursor-pointer ${!toggleForm ? "bg-lightSlate text-darkBlue" : "bg-darkBlue text-white"}`}
                                onClick={() => setToggleForm(true)}>
                                Register
                            </Link>
                        </div>

                        {!toggleForm && <LoginForm />}
                        {toggleForm && <RegisterForm />}
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginPage