import React, {useContext} from 'react'
import { AuthContext } from '../../utils/AuthContext';
import { DatePickeador } from './DatePicker';

export const WelcomeSection = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue rounded-t-xl border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
                <h1 className='text-5xl font-bold text-center text-lightBlue mb-6'>Dashboard</h1>
                <h2 className='text-4xl font-semibold text-center mb-6'>Welcome, {user.username}</h2>
                <div className='flex items-center justify-center w-full'>
                    <DatePickeador />
                </div>
            </div>
        </>
    )
}
