import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { REACT_APP_BACKEND_API_URL } from '../../utils/config';
import { useDate } from '../../utils/DateContext'

export const SeeExpensesSection = () => {
    const [expenses, setExpenses] = useState([])

    const [error, setError] = useState(null)
    const { dateRange } = useDate();

    useEffect(() => {
        const getExpenses = async () => {
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

                console.log('Fetching data from', startDate, 'to', endDate);

                // Realizamos la solicitud al backend con las fechas ya ajustadas
                const response = await axios.get(
                    `${REACT_APP_BACKEND_API_URL}/expense/getExpenses?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
                );

                setExpenses(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        getExpenses();
    }, [dateRange]); // Se vuelve a ejecutar cuando el rango de fechas cambia

    // Verificación de error
    if (error) {
        return (
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-semibold">Error al cargar los gastos</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-5/6 sm:w-4/5 xl:w-2/4 lg:w-3/4 bg-darkBlue border-t-4 border-darkSlate rounded-b-xl shadow-lg p-6 relative">
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">Expenses</h2>
                {expenses.length === 0 ? (
                    <p className="text-white text-2xl font-semibold text-center">No hay gastos en este rango de fechas.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-darkSlate text-white">
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Amount</th>
                                    <th className="px-4 py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className='bg-lightDarkBlue'>
                                        <td className="px-4 py-2 text-center text-white">{expense.id}</td>
                                        <td className="px-4 py-2 text-white">{expense.description}</td>
                                        <td className="px-4 py-2 text-center text-white">{expense.amount}</td>
                                        <td className="px-4 py-2 text-center text-white">
                                            {/* Convertir la fecha a UTC para evitar problemas de zona horaria */}
                                            {new Date(expense.date).toLocaleDateString('en-GB', {
                                                timeZone: 'UTC',  // Forzamos el uso de la zona horaria UTC
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}
