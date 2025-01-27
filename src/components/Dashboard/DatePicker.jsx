import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDate } from '../../utils/DateContext';

export const DatePickeador = () => {
    // Calcular el primer día del mes actual
    const getStartOfMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1); // Año, mes, día 1
    };

    const [startDate, setStartDate] = useState(getStartOfMonth());
    const [endDate, setEndDate] = useState(new Date()); // Día actual
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { setDateRange } = useDate();

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const fetchData = () => {
        setDateRange({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        console.log('Start date:', startDate);
        console.log('End date:', endDate);
        setShowDatePicker(false); // Ocultar el menú flotante después de aplicar
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-lightSlate"
            >
                Select Dates
            </button>

            {showDatePicker && (
                <div className="absolute top-12 left-0 z-10 bg-darkBlue border border-lightSlate rounded-lg shadow-lg p-4">
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className="bg-white rounded-lg"
                    />
                    <div className="mt-4 text-center">
                        <button
                            onClick={fetchData}
                            className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-lightSlate"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};