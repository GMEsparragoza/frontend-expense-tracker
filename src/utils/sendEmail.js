import { REACT_APP_BACKEND_API_URL } from './config'
import axios from 'axios'

export const sendValidationEmail = async (email, verificationCode) => {
    try {
        const html = `
            <h3 style="color: #333;">To confirm your email, enter the following code:</h3>
            <h2 style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-radius: 8px; color: #721c24; font-size: 24px; font-weight: bold;"><b>${verificationCode}</b></h2>
        `;

        const result = await axios.post(`${REACT_APP_BACKEND_API_URL}/api/mailer`, {
            to: email,
            subject: 'Email verification',
            html,
        });

        console.log('Email sent successfully:', result.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendEnable2FAMail = async (email, verificationCode) => {
    try {
        const html = `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
                    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333;">Verificación de dos pasos</h1>
                        <p style="font-size: 16px; color: #555;">Hola,</p>
                        <p style="font-size: 16px; color: #555;">Estás a un paso de asegurar tu cuenta con la verificación en dos pasos (2FA). Usa el siguiente código para completar la configuración:</p>
                        <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-radius: 8px; color: #721c24; font-size: 24px; font-weight: bold;">
                            ${verificationCode}
                        </div>
                        <p style="font-size: 14px; color: #555;">Este código es válido por los próximos 15 minutos. Si no solicitaste esta acción, por favor ignora este correo.</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Gracias por confiar en nosotros, <br>El equipo de Expense Tracker</p>
                    </div>
                </div>
            `;

        const result = await axios.post(`${REACT_APP_BACKEND_API_URL}/api/mailer`, {
            to: email,
            subject: 'Enable two-step verification',
            html,
        });

        console.log('Email sent successfully:', result.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendDisable2FAMail = async (email, verificationCode) => {
    try {
        const html = `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
                    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333;">Verificación de dos pasos</h1>
                        <p style="font-size: 16px; color: #555;">Hola,</p>
                        <p style="font-size: 16px; color: #555;">Para Desactivar la verificacion en dos pasos (2FA) usa el siguiente código para completar la configuración:</p>
                        <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-radius: 8px; color: #721c24; font-size: 24px; font-weight: bold;">
                            ${verificationCode}
                        </div>
                        <p style="font-size: 14px; color: #555;">Este código es válido por los próximos 15 minutos. Si no solicitaste esta acción, por favor ignora este correo.</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Gracias por confiar en nosotros, <br>El equipo de Expense Tracker</p>
                    </div>
                </div>
            `;

        const result = await axios.post(`${REACT_APP_BACKEND_API_URL}/api/mailer`, {
            to: email,
            subject: 'Disable two-step verification',
            html,
        });

        console.log('Email sent successfully:', result.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};