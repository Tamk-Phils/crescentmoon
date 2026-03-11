import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        let subject = '';
        let html = '';

        switch (type) {
            case 'contact':
                subject = `New Contact Message from ${data.name}`;
                html = `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        `;
                break;

            case 'adoption':
                subject = `NEW ADOPTION REQUEST: ${data.puppyName}`;
                html = `
          <h2>New Adoption Application</h2>
          <p><strong>Puppy:</strong> ${data.puppyName}</p>
          <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p>Please log in to the admin portal to review the full application.</p>
        `;
                break;

            case 'chat':
                subject = `New Chat Message from User`;
                html = `
          <h2>New Message Notification</h2>
          <p>A user has sent a new message in the chat.</p>
          <p><strong>Message Content:</strong></p>
          <p style="font-style: italic;">"${data.content}"</p>
          <p>Please log in to the admin portal to respond.</p>
        `;
                break;

            default:
                return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
        }

        await sendAdminNotification(subject, html);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in notify-admin API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
