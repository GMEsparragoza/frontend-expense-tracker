import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDate } from '../../utils/DateContext';

export const DatePickeador = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14))); // Últimas 2 semanas
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { setDateRange } = useDate();

    // Convierte una fecha a UTC eliminando la zona horaria local
    const convertToUTC = (date) => {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(convertToUTC(start)); // Convierte a UTC
        setEndDate(convertToUTC(end)); // Convierte a UTC
    };

    const fetchData = () => {
        setDateRange({
            startDate: startDate.toISOString(), // Usamos toISOString() para asegurarnos de que esté en UTC
            endDate: endDate.toISOString(), // Lo mismo para la fecha de fin
        });
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