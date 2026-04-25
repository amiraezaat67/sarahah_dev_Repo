import nodemailer from 'nodemailer';
import { emailConfig } from '../../config/index.js';

// Email transporter
export const transporter = nodemailer.createTransport(emailConfig);


