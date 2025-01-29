import React from 'react';
import { DatosSection } from '../components/Perfiles/DatosSection';
import { AcountSection } from '../components/Perfiles/AcountSection';
import { FinantialSection } from '../components/Perfiles/FinantialSection';

const Perfil = () => {
    

    return (
        <>
            <div className='bg-darkSlate text-white flex flex-col items-center mt-16 sm:my-20 p-8'>
                <DatosSection />
                <FinantialSection />
                <AcountSection />
            </div>            
        </>
    );
};

export default Perfil;