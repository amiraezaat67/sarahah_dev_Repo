import {transporter} from "../../Clients/index.js";
import { template } from "../../Utils/template.js";
import { EventEmitter } from "node:events";

// Send email -
export async function sendEmail({
    message,
    to,
    subject
}) {
    const html = template({ otp: message });
    const mailOptions = {
        from: '"Sarahah App" <noreply@sarahahapp.com>',
        to,
        subject,
        html
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.message };
    }
}

// create event using node:events to send email on it
export const emailEvent = new EventEmitter();
emailEvent.on("sendEmail", ({email, message, subject}) => {
    sendEmail({
        message,
        to: email,
        subject
    });
});

