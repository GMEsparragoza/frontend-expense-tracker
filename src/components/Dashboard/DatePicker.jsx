import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDate } from '../../utils/DateContext';

export const DatePickeador = () => {
    const { setDateRange } = useDate();
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14))); // Últimas 2 semanas
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Función para convertir la fecha a UTC sin la parte de hora local
    const convertToUTC = (date) => {
        const validDate = new Date(date);
        return new Date(Date.UTC(validDate.getUTCFullYear(), validDate.getUTCMonth(), validDate.getUTCDate()));
    };

    // Lógica para manejar el cambio de fecha
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        if (start) {
            setStartDate(convertToUTC(start));  // Asegura que se guarde la fecha en UTC
        }
        if (end) {
            setEndDate(convertToUTC(end));  // Asegura que se guarde la fecha en UTC
        }
    };

    // Actualizar el contexto con las fechas seleccionadas
    const fetchData = () => {
        setDateRange({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        setShowDatePicker(false); // Ocultar el menú flotante después de aplicar
    };

    useEffect(() => {
        // Convertir startDate y endDate a UTC para asegurarse de que estén correctamente formateadas
        const startUTC = convertToUTC(startDate);
        const endUTC = convertToUTC(endDate);

        setStartDate(startUTC);
        setEndDate(endUTC);
    }, [startDate, endDate]);

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
                        dateFormat="yyyy/MM/dd" // Formato de fecha
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