import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useDate } from '../../utils/DateContext';

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const ChartsSection = ({ expenses, incomes }) => {
    const { dateRange } = useDate(); // Obtener el rango de fechas del contexto

    // Cálculo del balance por mes
    const calculateMonthlyBalance = () => {
        const grouped = {};

        // Procesar ingresos
        incomes.forEach(({ amount, date }) => {
            const month = new Date(date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
            });
            grouped[month] = grouped[month] || { incomes: 0, expenses: 0 };
            grouped[month].incomes += amount;
        });

        // Procesar gastos
        expenses.forEach(({ amount, date }) => {
            const month = new Date(date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
            });
            grouped[month] = grouped[month] || { incomes: 0, expenses: 0 };
            grouped[month].expenses += amount;
        });

        // Convertir el objeto agrupado en un arreglo y ordenarlo por fecha
        return Object.entries(grouped)
            .map(([month, { incomes, expenses }]) => ({
                month,
                balance: incomes - expenses,
                incomes,
                expenses,
                timestamp: new Date(`01 ${month}`).getTime(), // Agregamos un timestamp para ordenar
            }))
            .sort((a, b) => a.timestamp - b.timestamp); // Ordenar por fecha
    };

    // Filtrar ingresos y gastos por el rango de fechas del contexto
    const filterByDateRange = (data) => {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return data.filter(({ date }) => {
            const currentDate = new Date(date);
            return currentDate >= startDate && currentDate <= endDate;
        });
    };

    const filteredExpenses = filterByDateRange(expenses);
    const filteredIncomes = filterByDateRange(incomes);

    // Cálculo del balance mensual
    const monthlyBalance = calculateMonthlyBalance();

    // Datos para el gráfico de balance mensual
    const balanceData = {
        labels: monthlyBalance.map((item) => item.month),
        datasets: [
            {
                label: 'Ingresos',
                data: monthlyBalance.map((item) => item.incomes),
                backgroundColor: '#3B82F6',
            },
            {
                label: 'Gastos',
                data: monthlyBalance.map((item) => item.expenses),
                backgroundColor: '#EF4444',
            },
        ],
    };

    // Datos para el gráfico de distribución de gastos
    const categoryExpenses = filteredExpenses.reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    const expenseDistributionData = {
        labels: Object.keys(categoryExpenses),
        datasets: [
            {
                data: Object.values(categoryExpenses),
                backgroundColor: ['#EF4444', '#3B82F6', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    // Datos para el gráfico de distribución de ingresos
    const sourceIncomes = filteredIncomes.reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    const incomeDistributionData = {
        labels: Object.keys(sourceIncomes),
        datasets: [
            {
                data: Object.values(sourceIncomes),
                backgroundColor: ['#009900', '#3B82F6', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div className="w-full sm:w-5/6 lg:w-3/4 xl:w-2/4 bg-darkBlue border-t-4 border-darkSlate shadow-lg p-6 mx-auto">
            {/* Gráfico de Balance Mensual */}
            <div className="mb-6">
                <h3 className="text-center text-2xl font-semibold mb-4 text-white">Monthly Balance</h3>
                <Bar data={balanceData} />
            </div>

            {/* Gráficos de Distribución */}
            <div className="flex flex-wrap justify-center">
                {/* Mostrar el gráfico de Distribución de Gastos solo si hay datos */}
                {Object.keys(categoryExpenses).length > 0 && (
                    <div className="w-full sm:w-1/2">
                        <h3 className="text-center text-2xl font-semibold my-4 text-white">
                            Expenses distribution by category
                        </h3>
                        <Doughnut data={expenseDistributionData} />
                    </div>
                )}
                {Object.keys(categoryExpenses).length == 0 && (
                    <h3 className="text-center text-2xl font-semibold m-4 text-white">
                        There are no expenses to display
                    </h3>
                )}

                {/* Mostrar el gráfico de Distribución de Ingresos solo si hay datos */}
                {Object.keys(sourceIncomes).length > 0 && (
                    <div className="w-full sm:w-1/2">
                        <h3 className="text-center text-2xl font-semibold my-4 text-white">
                            Incomes Distribution by source
                        </h3>
                        <Doughnut data={incomeDistributionData} />
                    </div>
                )}

                {Object.keys(sourceIncomes).length == 0 && (
                    <h3 className="text-center text-2xl font-semibold m-4 text-white">
                        There are no incomes to display
                    </h3>
                )}
            </div>
        </div>
    );
};