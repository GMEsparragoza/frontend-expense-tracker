import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { WelcomeSection } from '../components/Dashboard/WelcomeSection';
import { SumarySection } from '../components/Dashboard/SumarySection';
import { NewTransactionSection } from '../components/Dashboard/NewTransactionSection';
import { SeeIncomesSection } from '../components/Dashboard/SeeIncomesSection';
import { SeeExpensesSection } from '../components/Dashboard/SeeExpensesSection';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    

    return (
        <div className='min-h-screen mt-16 sm:mt-20 bg-darkSlate text-white flex flex-col items-center p-8'>
            <WelcomeSection />
            <SumarySection />
            <NewTransactionSection />
            <SeeIncomesSection />
            <SeeExpensesSection />
        </div>
    );
};

export default Dashboard;