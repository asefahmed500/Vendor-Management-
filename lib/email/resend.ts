import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev';

export default resend;
