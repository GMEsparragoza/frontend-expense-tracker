import React, {useContext} from 'react'
import { AuthContext } from '../../utils/AuthContext';
import { DatePickeador } from './DatePicker';

export const WelcomeSection = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <div className='w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue rounded-t-xl shadow-lg p-6 mt-8 relative'>
                <h1 className='text-5xl font-bold text-center text-lightBlue mb-6'>Dashboard</h1>
                <h2 className='text-4xl font-semibold text-center mb-6'>Welcome, {user.username}</h2>
                <div className='flex items-center justify-center w-full'>
                    <DatePickeador />
                </div>
            </div>
        </>
    )
}
