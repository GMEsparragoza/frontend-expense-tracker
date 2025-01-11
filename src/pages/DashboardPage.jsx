import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';

const Dashboard = () => {
    const { user} = useContext(AuthContext);
    

    return (
        <div className='min-h-screen bg-darkSlate text-white flex flex-col items-center justify-center'>
            <div>
                <h1>Dashboard</h1>
                <h2>Bienvenido, {user.username}</h2>
            </div>
        </div>
    );
};

export default Dashboard;