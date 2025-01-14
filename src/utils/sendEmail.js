import {REACT_APP_BACKEND_API_URL} from './config'
import axios from 'axios'

export const sendValidationEmail = async (email, verificationCode) => {
    try {
        const html = `
            <p>Para confirmar tu correo electrónico, ingresa el siguiente código:</p>
            <h2><b>${verificationCode}</b></h2>
        `;

        const result = await axios.post(`${REACT_APP_BACKEND_API_URL}/api/mailer`, {
            to: email,
            subject: 'Verificación de correo',
            html,
        });

        console.log('Email sent successfully:', result.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};