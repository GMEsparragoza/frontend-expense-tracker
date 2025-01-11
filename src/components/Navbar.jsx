import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <div className='flex justify-between items-center p-6 bg-gradient-to-r from-darkSlate to-lightSlate text-xl fixed top-0 left-0 right-0 z-50'>
                <div className='font-bold text-2xl'>
                    <h1 className='text-lightBlue'>Expense Tracker</h1>
                </div>
                <div className='flex space-x-4 text-white'>
                    <Link to='/' className='px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Home</Link>
                    {user ? (
                        <div className='flex space-x-4'>
                            <Link to='/dashboard' className='px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Dashboard</Link>
                            <Link to='/perfil' className='px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Perfil</Link>
                        </div>
                    ) : (
                        <Link to='/login' className='px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Sign In</Link>
                    )}
                </div>
            </div>
        </>
    );
};