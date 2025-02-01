import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from '../../utils/config';
import { useDate } from '../../utils/DateContext';
import { useAlert } from '../../utils/AlertContext';

export const SeeExpensesSection = () => {
    const [expenses, setExpenses] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: '' })
    const [updatingStatus, setUpdatingStatus] = useState({ loading: false, error: null })
    const [menus, setMenus] = useState({ updateExpense: false, deleteExpense: false })
    const [updateExpenseData, setUpdateExpenseData] = useState({
        id: null,
        date: '',
        category: '',
        description: '',
        amount: ''
    })
    const [deleteExpenseData, setDeleteExpenseData] = useState({
        id: null,
        date: '',
        category: '',
        description: '',
        amount: ''
    })
    const { dateRange } = useDate();
    const { mostrarAlerta } = useAlert();

    useEffect(() => {
        const getExpenses = async () => {
            try {
                const setDateWithoutTime = (date) => {
                    const newDate = new Date(date);
                    newDate.setHours(0, 0, 0, 0);
                    return newDate;
                };

                const startDate = setDateWithoutTime(new Date(dateRange.startDate));
                const endDate = setDateWithoutTime(new Date(dateRange.endDate));

                const response = await axios.get(
                    `${REACT_APP_BACKEND_API_URL}/transaction/getExpenses?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
                );

                setExpenses(response.data);
            } catch (err) {
                setStatus({ ...status, error: err })
            }
            setStatus({ ...status, loading: false })
        };
        getExpenses();
    }, [dateRange]);

    const handleEdit = async (e) => {
        e.preventDefault();
        setUpdatingStatus({ loading: true, error: '' })
        try {
            if (!updateExpenseData.id) {
                setUpdatingStatus({ loading: false, error: 'There was an error updating an Expense. Please try again.' })
                setTimeout(() => {
                    setMenus({ ...menus, updateExpense: false })
                }, 2000);
                return;
            }
            if (!updateExpenseData.date || !updateExpenseData.amount || !updateExpenseData.category || !updateExpenseData.description) {
                setUpdatingStatus({ loading: false, error: 'Data to be entered is missing' })
                return;
            }
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/transaction/updateExpense`, {
                updateExpenseData
            })
            mostrarAlerta({
                tipo: true,
                titulo: `${response.data.message}`,
                parrafo: `The expense has been updated`
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setUpdatingStatus({ loading: false, error: error.response.data.message })
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setUpdatingStatus({ loading: true, error: '' })
        try {
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/transaction/deleteExpense`, {
                id: deleteExpenseData.id
            })
            mostrarAlerta({
                tipo: true,
                titulo: `${response.data.message}`,
                parrafo: `The expense has been deleted`
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setUpdatingStatus({ loading: false, error: error.response.data.message })
        }
    };

    if (status.error) {
        return (
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative">
                <div className="text-center text-darkRed">
                    <h2 className="text-2xl font-semibold">Error loading expenses</h2>
                    <p>{status.error}</p>
                </div>
            </div>
        );
    }

    if (status.loading) {
        return (
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-semibold">Loading Expenses...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 mx-auto">
            <h2 className="text-3xl font-semibold text-white mb-4 text-center">Expenses</h2>
            {expenses.length === 0 ? (
                <p className="text-white text-2xl text-center">There are no charges for this date range.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-darkSlate text-white">
                            <tr>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="bg-lightDarkBlue">
                                    <td className="px-4 py-2 text-white">{expense.description}</td>
                                    <td className="px-4 py-2 text-center text-white">{expense.amount}</td>
                                    <td className="px-4 py-2 text-center text-white">
                                        {new Date(expense.date).toLocaleDateString('en-GB', {
                                            timeZone: 'UTC',
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <button
                                                onClick={() => {
                                                    setMenus({ ...menus, updateExpense: true });
                                                    setUpdateExpenseData({ ...updateExpenseData, id: expense.id });
                                                }}
                                                className="font-semibold bg-lightBlue text-white py-1 px-3 rounded hover:bg-softBlue transition-colors duration-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMenus({ ...menus, deleteExpense: true });
                                                    setDeleteExpenseData({
                                                        id: expense.id,
                                                        description: expense.description,
                                                        amount: expense.amount,
                                                        date: new Date(expense.date).toLocaleDateString('en-GB', {
                                                            timeZone: 'UTC',
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                        }),
                                                        category: expense.category,
                                                    });
                                                }}
                                                className="font-semibold text-white py-1 px-3 rounded hover:bg-darkRed transition-colors duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div id='Menu-Update-Expense'>
                {menus.updateExpense && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleEdit(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Update Expense</h2>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Date</label>
                                <input
                                    type="text"
                                    value={updateExpenseData.date}
                                    onChange={(e) => setUpdateExpenseData({ ...updateExpenseData, date: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter Date"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Category</label>
                                <input
                                    type="text"
                                    value={updateExpenseData.category}
                                    onChange={(e) => setUpdateExpenseData({ ...updateExpenseData, category: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter Category"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={updateExpenseData.description}
                                    onChange={(e) => setUpdateExpenseData({ ...updateExpenseData, description: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter Description"
                                />
                            </div>
                            <div className='my-4'>
                                <label className="block text-gray text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={updateExpenseData.amount}
                                    onChange={(e) => setUpdateExpenseData({ ...updateExpenseData, amount: e.target.value })}
                                    className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                    placeholder="Enter Amount"
                                />
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, updateExpense: false })
                                        setUpdatingStatus({ ...updatingStatus, error: null })
                                        setUpdateExpenseData({ updateExpenseData: null })
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Confirm
                                </button>
                            </div>
                            {updatingStatus.error && <p className='text-darkRed mt-2 text-center'>{updatingStatus.error}</p>}
                            {updatingStatus.loading && <p className='text-white mt-2 text-center'>Updating Expense...</p>}
                        </form>
                    </div>
                )}
            </div>
            <div id='Menu-Delete-Expense'>
                {menus.deleteExpense && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                        <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleDelete(e)}>
                            <h2 className='text-2xl font-medium text-white mb-5 text-center'>Delete Expense</h2>
                            <p className="text-white text-center mb-5 text-xl">
                                Are you sure you want to delete the Expense?
                            </p>
                            <div className='text-gray font-medium'>
                                <label className='block mb-1'>Date: {deleteExpenseData.date}</label>
                                <label className="block mb-1">Description: {deleteExpenseData.description}</label>
                                <label className="block mb-1">Category: {deleteExpenseData.category}</label>
                                <label className="block mb-1">Amount: {deleteExpenseData.amount}</label>
                            </div>
                            <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                <button
                                    type='button'
                                    onClick={() => {
                                        setMenus({ ...menus, deleteExpense: false });
                                        setUpdatingStatus({ ...updatingStatus, error: null });
                                        setDeleteExpenseData({ deleteExpenseData: null })
                                    }}
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='w-1/2 bg-lightBlue text-darkBlue py-2 font-medium rounded mt-6 hover:bg-lightSlate hover:text-darkBlue transition-colors'
                                >
                                    Confirm
                                </button>
                            </div>
                            {updatingStatus.error && <p className='text-darkRed mt-2 text-center'>{updatingStatus.error}</p>}
                            {updatingStatus.loading && <p className='text-white mt-2 text-center'>Deleting Expense...</p>}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};