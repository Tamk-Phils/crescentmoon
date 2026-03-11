import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.spacemail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendAdminNotification(subject: string, html: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Skipping email notification.');
        return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'hello@crescentmoonspaniels.com';

    try {
        await transporter.sendMail({
            from: `"Crescent Moon Website" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject,
            html,
        });
        console.log(`Notification email sent: ${subject}`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
}
