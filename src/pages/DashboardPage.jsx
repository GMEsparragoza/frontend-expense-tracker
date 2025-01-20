import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { WelcomeSection } from '../components/Dashboard/WelcomeSection';
import { NewExpenseSection } from '../components/Dashboard/NewExpenseSection';
import { SeeExpensesSection } from '../components/Dashboard/SeeExpensesSection';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    

    return (
        <div className='min-h-screen bg-darkSlate text-white flex flex-col items-center mt-20 p-8'>
            <WelcomeSection />
            <NewExpenseSection />
            <SeeExpensesSection />
        </div>
    );
};

export default Dashboard;