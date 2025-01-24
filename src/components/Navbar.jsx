import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className='flex justify-between items-center p-6 bg-gradient-to-r from-darkSlate to-lightSlate text-xl fixed top-0 left-0 right-0 z-50'>
                <div className='font-bold text-2xl'>
                    {/* Título solo visible en pantallas grandes */}
                    <h1 className='text-lightBlue hidden lg:block'>Expense Tracker</h1>
                </div>
                <div className='flex items-center text-white'>
                    {/* Botón de menú en pantallas pequeñas */}
                    <button className='lg:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                        </svg>
                    </button>

                    {/* Menú para pantallas grandes */}
                    <div className='hidden lg:flex space-x-4'>
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

                    {/* Menú desplegable en pantallas pequeñas */}
                    <div className={`lg:hidden ${menuOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-gradient-to-r from-darkSlate to-lightSlate text-white space-y-4 py-4 px-6 rounded-lg shadow-lg`}>
                        <Link to='/' className='block px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Home</Link>
                        {user ? (
                            <>
                                <Link to='/dashboard' className='block px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Dashboard</Link>
                                <Link to='/perfil' className='block px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Perfil</Link>
                            </>
                        ) : (
                            <Link to='/login' className='block px-4 py-2 bg-darkBlue rounded-full hover:bg-lightBlue transition-colors duration-300'>Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};