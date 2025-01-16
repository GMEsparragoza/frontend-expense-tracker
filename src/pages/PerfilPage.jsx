import React from 'react';
import { DatosSection } from '../components/Perfiles/DatosSection';
import { AcountSection } from '../components/Perfiles/AcountSection';

const Perfil = () => {
    

    return (
        <>
            <div className='min-h-screen bg-darkSlate text-white flex flex-col items-center mt-20 p-8'>
                <DatosSection />
                <AcountSection />
            </div>            
        </>
    );
};

export default Perfil;