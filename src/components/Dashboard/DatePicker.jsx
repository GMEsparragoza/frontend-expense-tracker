import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const fetchData = () => {
        // Lógica para hacer fetch de datos con el rango de fechas seleccionado
        console.log('Fetching data from', startDate, 'to', endDate);
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
            />
            <button onClick={fetchData}>Fetch Data</button>
        </div>
    );
};

export default DatePicker;