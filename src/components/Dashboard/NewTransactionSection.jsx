import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from '../../utils/config';
import { useAlert } from '../../utils/AlertContext';

export const NewTransactionSection = () => {
    const [formNewTransactionData, setFormNewTransactionData] = useState({
        type: 'expense', // Por defecto "gasto"
        date: '',
        category: '',
        description: '',
        amount: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        error: null
    });
    const { mostrarAlerta } = useAlert();

    const AddNewTransaction = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });
        try {
            // Convertir la variable date a un objeto Date
            const dateObject = new Date(formNewTransactionData.date);

            // Enviar el objeto Date al backend
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/transaction/addNewTransaction`, {
                type: formNewTransactionData.type, // 'income' o 'expense'
                date: dateObject,
                category: formNewTransactionData.category,
                description: formNewTransactionData.description,
                amount: formNewTransactionData.amount
            });

            console.log(response.data);
            mostrarAlerta({
                tipo: true,
                titulo: `${response.data.message}`,
                parrafo: `The ${formNewTransactionData.type} has been added successfully`
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setStatus({ loading: false, error: error.response?.data?.message || 'Error adding transaction' });
        }
        setStatus({ loading: false, ...status });
    };

    return (
        <>
            <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
                <div className='flex items-center justify-start w-full'>
                    <form className="w-full max-w-[500px] mx-auto" onSubmit={(e) => AddNewTransaction(e)}>
                        <h2 className='text-2xl font-medium text-white mb-5 text-center'>
                            New {formNewTransactionData.type === 'income' ? 'Income' : 'Expense'}
                        </h2>

                        {/* Toggle entre Ingreso y Gasto */}
                        <div className="flex justify-center items-center my-4">
                            <label className="text-white mr-4">Transaction Type:</label>
                            <select
                                value={formNewTransactionData.type}
                                onChange={(e) =>
                                    setFormNewTransactionData({ ...formNewTransactionData, type: e.target.value })
                                }
                                className="bg-darkSlate text-white py-2 px-4 rounded"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">Date</label>
                            <input
                                type="text"
                                value={formNewTransactionData.date}
                                onChange={(e) =>
                                    setFormNewTransactionData({ ...formNewTransactionData, date: e.target.value })
                                }
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Date (YYYY-MM-DD)"
                            />
                        </div>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">{formNewTransactionData.type == 'income' ? 'Source' : 'Category'}</label>
                            <input
                                type="text"
                                value={formNewTransactionData.category}
                                onChange={(e) =>
                                    setFormNewTransactionData({ ...formNewTransactionData, category: e.target.value })
                                }
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder={formNewTransactionData.type == 'income' ? 'Source' : 'Category'}
                            />
                        </div>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">Description</label>
                            <input
                                type="text"
                                value={formNewTransactionData.description}
                                onChange={(e) =>
                                    setFormNewTransactionData({ ...formNewTransactionData, description: e.target.value })
                                }
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Description"
                            />
                        </div>
                        <div className='my-4'>
                            <label className="block text-gray text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                value={formNewTransactionData.amount}
                                onChange={(e) =>
                                    setFormNewTransactionData({ ...formNewTransactionData, amount: e.target.value })
                                }
                                className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                placeholder="Amount"
                            />
                        </div>
                        <button
                            type="submit"
                            className='w-full bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                        >
                            Add {formNewTransactionData.type === 'income' ? 'Income' : 'Expense'}
                        </button>
                        <div>
                            {status.error && <p className='text-red mt-2 text-center'>{status.error}</p>}
                            {status.loading && <p className='text-white mt-2 text-center'>Adding Transaction...</p>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};