import React, {useState, useEffect} from 'react';
import { WelcomeSection } from '../components/Dashboard/WelcomeSection';
import { SumarySection } from '../components/Dashboard/SumarySection';
import { NewTransactionSection } from '../components/Dashboard/NewTransactionSection';
import { SeeIncomesSection } from '../components/Dashboard/SeeIncomesSection';
import { SeeExpensesSection } from '../components/Dashboard/SeeExpensesSection';
import { ChartsSection } from '../components/Dashboard/ChartsSection';
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../utils/config';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const expensesResponse = await axios.get(`${REACT_APP_BACKEND_API_URL}/transaction/getExpenses`);
            const incomesResponse = await axios.get(`${REACT_APP_BACKEND_API_URL}/transaction/getIncomes`);
            setExpenses(expensesResponse.data);
            setIncomes(incomesResponse.data);
        };
        fetchData();
    }, []);

    return (
        <div className='min-h-screen mt-16 sm:mt-20 bg-darkSlate text-white flex flex-col items-center p-8'>
            <WelcomeSection />
            <SumarySection />
            <ChartsSection expenses={expenses} incomes={incomes} />
            <NewTransactionSection />
            <SeeIncomesSection />
            <SeeExpensesSection />
        </div>
    );
};

export default Dashboard;