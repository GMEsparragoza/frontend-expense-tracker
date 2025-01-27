import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BACKEND_API_URL } from '../../utils/config';
import { useDate } from '../../utils/DateContext';

export const SumarySection = () => {
    const [data, setData] = useState({
        balance: 0,
        totalExpenses: 0,
        totalIncome: 0,
    });
    const [status, setStatus] = useState({
        loading: false,
        error: null,
    });
    const { dateRange } = useDate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setStatus({ loading: true, error: null });
            try {
                const setDateWithoutTime = (date) => {
                    const newDate = new Date(date);
                    newDate.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00 UTC
                    return newDate;
                };
                // Convertir las fechas de ISOString a Date y quitar la hora
                const startDate = setDateWithoutTime(new Date(dateRange.startDate));
                const endDate = setDateWithoutTime(new Date(dateRange.endDate));

                const response = await axios.get(
                    `${REACT_APP_BACKEND_API_URL}/transaction/sumary-data`,
                    {
                        params: { start: startDate.toISOString(), end: endDate.toISOString() }, // Enviar rango de fechas como query params
                    }
                );
                const { balance, totalExpenses, totalIncome } = response.data;
                setData({
                    balance: balance ?? 0,
                    totalExpenses: totalExpenses ?? 0,
                    totalIncome: totalIncome ?? 0,
                });
            } catch (err) {
                console.error('Error al cargar los datos del dashboard:', err);
                setStatus({ loading: false, error: 'Ocurrió un error al cargar los datos del dashboard' });
            } finally {
                setStatus({ loading: false, ...status });
            }
        };

        fetchDashboardData();
    }, [dateRange]);

    if (status.loading) {
        return (
            <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
                <p className="text-3xl text-center text-red-500">Loading data...</p>
            </div>
        )
    }

    if (status.error) {
        return (
            <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
                <p className="text-3xl text-center text-red-500">{status.error}</p>
            </div>
        )
    }

    return (
        <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">dashboard summary</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Balance */}
                <div className="bg-lightSlate text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Balance</h3>
                    <p className="text-4xl font-bold">
                        {data.balance >= 0
                            ? `$${data.balance.toFixed(2)}`
                            : `-$${Math.abs(data.balance).toFixed(2)}`}
                    </p>
                </div>

                {/* Ingresos Totales */}
                <div className="bg-green text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Total Incomes</h3>
                    <p className="text-4xl font-bold">
                        ${data.totalIncome ? data.totalIncome.toFixed(2) : '0.00'}
                    </p>
                </div>

                {/* Gastos Totales */}
                <div className="bg-darkRed text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Total expenses</h3>
                    <p className="text-4xl font-bold">
                        ${data.totalExpenses ? data.totalExpenses.toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>
        </div>
    );
};