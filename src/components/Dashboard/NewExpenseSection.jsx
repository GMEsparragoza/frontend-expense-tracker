import React, { useState } from 'react'
import axios from 'axios';
import {REACT_APP_BACKEND_API_URL} from '../../utils/config';
import { useAlert } from '../../utils/AlertContext';

export const NewExpenseSection = () => {
    const [formNewExpenseData, setFormNewExpenseData] = useState({
        date: '',
        category: '',
        description: '',
        amount: ''
    })

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {mostrarAlerta} = useAlert();

    const AddNewExpense = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convertir la variable date a un objeto Date
            const dateObject = new Date(formNewExpenseData.date);
            // Enviar el objeto Date al backend
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/expense/addNewExpense`, {
                date: dateObject,
                category: formNewExpenseData.category,
                description: formNewExpenseData.description,
                amount: formNewExpenseData.amount
            })
            console.log(response.data);
            mostrarAlerta({
                tipo: true,
                titulo: 'Expense added',
                parrafo: 'The expense has been added successfully'
            })
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        catch (error) {
            setError('Failed to add expense');
            setLoading(false);
        }
        setLoading(false);
    }

    return (
            <>
                <div className='w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 relative'>
                    <div className='flex items-center justify-start w-full'>
                        <form className="w-full max-w-[500px] mx-auto" onSubmit={(e) => AddNewExpense(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>New Expense</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Date</label>
                                <input type="text"
                                    value={formNewExpenseData.date}
                                    onChange={(e) => setFormNewExpenseData({ ...formNewExpenseData, date: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Date (YYYY-MM-DD)" />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Category</label>
                                <input type="text"
                                    value={formNewExpenseData.category}
                                    onChange={(e) => setFormNewExpenseData({ ...formNewExpenseData, category: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Category" />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Description</label>
                                <input type="text"
                                    value={formNewExpenseData.description}
                                    onChange={(e) => setFormNewExpenseData({ ...formNewExpenseData, description: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Description" />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Amount</label>
                                <input type="number"
                                    value={formNewExpenseData.amount}
                                    onChange={(e) => setFormNewExpenseData({ ...formNewExpenseData, amount: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Amount" />
                            </div>
                            <button type='submit' className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'>Add Expense</button>
                            <div>
                                {error && <p className='text-red mt-2 text-center'>{error}</p>}
                                {loading && <p className='text-white mt-2 text-center'>Adding Expense...</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
