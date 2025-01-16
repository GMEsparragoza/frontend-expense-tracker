import {REACT_APP_BACKEND_API_URL} from './config'
import axios from 'axios'

export const sendValidationEmail = async (email, verificationCode) => {
    try {
        const html = `
            <h1>To confirm your email, enter the following code:</h1>
            <h3><b>${verificationCode}</b></h3>
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
            <h1>verification code for your account:</h1>
            <h3 style="color:rgb(181, 18, 18);"><b>${verificationCode}</b></h3>
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