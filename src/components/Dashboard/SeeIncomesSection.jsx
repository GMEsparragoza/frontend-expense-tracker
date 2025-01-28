import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../../utils/config';
import { useDate } from '../../utils/DateContext'
import { useAlert } from '../../utils/AlertContext';

export const SeeIncomesSection = () => {
    const [incomes, setIncomes] = useState([])
    const [status, setStatus] = useState({ loading: true, error: '' })
    const [updatingStatus, setUpdatingStatus] = useState({ loading: false, error: null })
    const [menus, setMenus] = useState({ updateIncome: false, deleteIncome: false })
    const [updateIncomeData, setUpdateIncomeData] = useState({
        id: null,
        date: '',
        category: '',
        description: '',
        amount: ''
    })
    const [deleteIncomeData, setDeleteIncomeData] = useState({
        id: null,
        date: '',
        category: '',
        description: '',
        amount: ''
    })
    const { dateRange } = useDate();
    const { mostrarAlerta } = useAlert();

    useEffect(() => {
        const getIncomes = async () => {
            setStatus({ ...status, error: '' })
            try {
                // Función para quitar la hora y ponerla en 00:00:00 UTC
                const setDateWithoutTime = (date) => {
                    const newDate = new Date(date);
                    newDate.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00 UTC
                    return newDate;
                };

                // Convertir las fechas de ISOString a Date y quitar la hora
                const startDate = setDateWithoutTime(new Date(dateRange.startDate));
                const endDate = setDateWithoutTime(new Date(dateRange.endDate));

                // Realizamos la solicitud al backend con las fechas ya ajustadas
                const response = await axios.get(
                    `${REACT_APP_BACKEND_API_URL}/transaction/getIncomes?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
                );

                setIncomes(response.data);
            } catch (err) {
                setStatus({ ...status, error: err })
            }
            setStatus({ ...status, loading: false })
        };
        getIncomes();
    }, [dateRange]); // Se vuelve a ejecutar cuando el rango de fechas cambia

    const handleEdit = async (e) => {
        e.preventDefault();
        setUpdatingStatus({ loading: true, error: '' })
        try {
            if (!updateIncomeData.id) {
                setUpdatingStatus({ loading: false, error: 'There was an error updating an Income. Please try again.' })
                setTimeout(() => {
                    setMenus({ ...menus, updateIncome: false })
                }, 2000);
                return;
            }
            if (!updateIncomeData.date || !updateIncomeData.amount || !updateIncomeData.category || !updateIncomeData.description) {
                setUpdatingStatus({ loading: false, error: 'Data to be entered is missing' })
                return;
            }
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/transaction/updateIncome`, {
                updateIncomeData
            })
            mostrarAlerta({
                tipo: true,
                titulo: `${response.data.message}`,
                parrafo: `The income has been updated`
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setUpdatingStatus({ loading: false, error: err })
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setUpdatingStatus({ loading: true, error: '' })
        try {
            const response = await axios.post(`${REACT_APP_BACKEND_API_URL}/transaction/deleteIncome`, {
                id: deleteIncomeData.id
            })
            mostrarAlerta({
                tipo: true,
                titulo: `${response.data.message}`,
                parrafo: `The income has been deleted`
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setUpdatingStatus({ loading: false, error: err })
        }
    };

    // Verificación de error
    if (status.error) {
        return (
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 relative">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-semibold">Error loading income</h2>
                    <p>{status.error}</p>
                </div>
            </div>
        );
    }
    if (status.loading) {
        return (
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 relative">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-semibold">Loading Incomes...</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
                <h2 className="text-3xl font-semibold text-white mb-4 text-center">Incomes</h2>
                {incomes.length === 0 ? (
                    <p className="text-white text-2xl text-center">There are no income in this date range.</p>
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
                                {incomes.map((income) => (
                                    <tr key={income.id} className="bg-lightDarkBlue">
                                        <td className="px-4 py-2 text-white">{income.description}</td>
                                        <td className="px-4 py-2 text-center text-white">{income.amount}</td>
                                        <td className="px-4 py-2 text-center text-white">
                                            {new Date(income.date).toLocaleDateString('en-GB', {
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
                                                        setMenus({ ...menus, updateIncome: true });
                                                        setUpdateIncomeData({ ...updateIncomeData, id: income.id });
                                                    }}
                                                    className="font-semibold bg-lightBlue text-white py-1 px-3 rounded hover:bg-softBlue transition-colors duration-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMenus({ ...menus, deleteIncome: true });
                                                        setDeleteIncomeData({
                                                            id: income.id,
                                                            description: income.description,
                                                            amount: income.amount,
                                                            date: new Date(income.date).toLocaleDateString('en-GB', {
                                                                timeZone: 'UTC',
                                                                year: 'numeric',
                                                                month: 'numeric',
                                                                day: 'numeric',
                                                            }),
                                                            category: income.category,
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
                <div id='Menu-Update-Income'>
                    {menus.updateIncome && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                            <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleEdit(e)}>
                                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Update Income</h2>
                                <div className='my-4'>
                                    <label className="block text-gray text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setUpdateIncomeData({ ...updateIncomeData, date: e.target.value })}
                                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                        placeholder="Enter Date (YYYY-MM-DD)"
                                    />
                                </div>
                                <div className='my-4'>
                                    <label className="block text-gray text-sm font-medium mb-1">Category</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setUpdateIncomeData({ ...updateIncomeData, category: e.target.value })}
                                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                        placeholder="Enter Category"
                                    />
                                </div>
                                <div className='my-4'>
                                    <label className="block text-gray text-sm font-medium mb-1">Description</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setUpdateIncomeData({ ...updateIncomeData, description: e.target.value })}
                                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                        placeholder="Enter Description"
                                    />
                                </div>
                                <div className='my-4'>
                                    <label className="block text-gray text-sm font-medium mb-1">Amount</label>
                                    <input
                                        type="number"
                                        onChange={(e) => setUpdateIncomeData({ ...updateIncomeData, amount: e.target.value })}
                                        className="w-full border-b-2 border-lightSlate bg-darkSlate outline-none px-3 py-2 text-white placeholder-lightSlate focus:border-transparent"
                                        placeholder="Enter Amount"
                                    />
                                </div>
                                <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setMenus({ ...menus, updateIncome: false })
                                            setUpdatingStatus({ ...updatingStatus, error: null })
                                            setUpdateIncomeData({ updateIncomeData: null })
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
                                {updatingStatus.error && <p className='text-red mt-2 text-center'>{updatingStatus.error}</p>}
                                {updatingStatus.loading && <p className='text-white mt-2 text-center'>Updating Income...</p>}
                            </form>
                        </div>
                    )}
                </div>
                <div id='Menu-Delete-Income'>
                    {menus.deleteIncome && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                            <form className="w-full max-w-[500px] mx-auto bg-darkSlate p-6 rounded-lg relative z-40" onSubmit={(e) => handleDelete(e)}>
                                <h2 className='text-2xl font-medium text-white mb-5 text-center'>Delete Income</h2>
                                <p className="text-white text-center mb-5">
                                    Are you sure you want to delete the Income?
                                </p>
                                <label className="block text-gray text-sm font-medium mb-1">Date: {deleteIncomeData.date}</label>
                                <label className="block text-gray text-sm font-medium mb-1">Description: {deleteIncomeData.description}</label>
                                <label className="block text-gray text-sm font-medium mb-1">Category: {deleteIncomeData.category}</label>
                                <label className="block text-gray text-sm font-medium mb-1">Amount: {deleteIncomeData.amount}</label>
                                <div className="flex justify-between items-center w-11/12 mx-auto space-x-4">
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setMenus({ ...menus, deleteIncome: false });
                                            setUpdatingStatus({ ...updatingStatus, error: null });
                                            setDeleteIncomeData({ deleteIncomeData: null })
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
                                {updatingStatus.error && <p className='text-red mt-2 text-center'>{updatingStatus.error}</p>}
                                {updatingStatus.loading && <p className='text-white mt-2 text-center'>Deleting Income...</p>}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}