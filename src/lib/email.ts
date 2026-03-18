import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.spacemail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE !== 'false', // Default to true unless explicitly 'false'
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Let nodemailer/dotenv handle the escaping
    },
});

console.log('Nodemailer transporter initialized for:', process.env.SMTP_USER);

function getEmailTemplate(title: string, content: string) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1b; margin: 0; padding: 0; background-color: #fdfbf7; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eeeeee; }
          .header { background-color: #4c1d95; color: #ffffff; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 500; color: #ffffff; letter-spacing: 1px; }
          .content { padding: 40px; color: #1a1a1b; background-color: #ffffff; }
          .content h2 { color: #4c1d95; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; }
          .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #ffffff; }
          .data-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; color: #1a1a1b; }
          .data-table td.label { font-weight: bold; color: #4b5563; width: 35%; font-size: 13px; text-transform: uppercase; }
          .data-table td.value { color: #111827; font-weight: 500; }
          .footer { background-color: #f9fafb; color: #6b7280; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eeeeee; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #4c1d95; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Crescent Moon Sanctuary</h1>
          </div>
          <div class="content">
            <h2>${title}</h2>
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Crescent Moon Cocker Spaniels. All rights reserved.</p>
            <p>Admin Notification System</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendAdminNotification(subject: string, htmlContent: string, replyTo?: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Skipping email notification.');
        return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'support@crescentmooncocker.com';
    const styledHtml = getEmailTemplate(subject, htmlContent);

    try {
        await transporter.sendMail({
            from: `"Crescent Moon Website" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            replyTo,
            subject,
            html: styledHtml,
        });
        console.log(`Notification email sent: ${subject} (Reply-To: ${replyTo || 'N/A'})`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
}
