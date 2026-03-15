import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;
        console.log(`Received notification request: type=${type}`, data);

        let subject = '';
        let html = '';
        let replyTo = '';

        switch (type) {
            case 'contact':
                subject = `New Contact Message from ${data.name}`;
                replyTo = data.email;
                html = `
          <p>You have received a new message through the website contact form:</p>
          <table class="data-table">
            <tr><td class="label">Name</td><td class="value">${data.name}</td></tr>
            <tr><td class="label">Email</td><td class="value">${data.email}</td></tr>
          </table>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #4c1d95;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        `;
                break;

            case 'adoption':
                subject = `NEW ADOPTION REQUEST: ${data.puppyName}`;
                replyTo = data.email;

                // Build a full table of application details if they exist
                const details = data.fullDetails || {};
                const applicant = details.applicantInfo || {};
                const household = details.household || {};
                const employment = details.employment || {};

                html = `
          <p>A new adoption application has been submitted for <strong>${data.puppyName}</strong>.</p>
          
          <h3>Applicant Information</h3>
          <table class="data-table">
            <tr><td class="label">Full Name</td><td class="value">${applicant.firstName || data.firstName} ${applicant.lastName || data.lastName}</td></tr>
            <tr><td class="label">Email</td><td class="value">${applicant.email || data.email}</td></tr>
            <tr><td class="label">Phone</td><td class="value">${applicant.phone || data.phone}</td></tr>
            <tr><td class="label">Address</td><td class="value">${applicant.address || 'N/A'}</td></tr>
          </table>

          <h3>Household & Lifestyle</h3>
          <table class="data-table">
            <tr><td class="label">Residence</td><td class="value">${household.residenceType} (${household.rentOrOwn})</td></tr>
            <tr><td class="label">Household</td><td class="value">${household.householdMembers}</td></tr>
            <tr><td class="label">Other Pets</td><td class="value">${household.otherPets || 'None'}</td></tr>
            <tr><td class="label">Yard</td><td class="value">${household.yardDescription}</td></tr>
          </table>

          <h3>Employment</h3>
          <table class="data-table">
            <tr><td class="label">Occupation</td><td class="value">${employment.occupation}</td></tr>
            <tr><td class="label">Schedule</td><td class="value">${employment.workHours}</td></tr>
            <tr><td class="label">Puppy Care</td><td class="value">${employment.daytimeCare}</td></tr>
          </table>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://crescentmooncocker.com'}/admin" class="btn">Login to Admin Portal to Review Full Application</a>
          </p>
        `;
                break;

            case 'chat':
                subject = `New Chat Message from ${data.senderName || 'User'}`;
                replyTo = data.senderEmail || '';
                html = `
          <p>A user has sent a new message in the chat:</p>
          <table class="data-table">
            <tr><td class="label">Sender</td><td class="value">${data.senderName || 'User'} (${data.senderEmail || 'N/A'})</td></tr>
          </table>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #4c1d95; font-style: italic;">
            "${data.content}"
          </div>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://crescentmooncocker.com'}/admin" class="btn">Reply in Chat Portal</a>
          </p>
        `;
                break;
            
            case 'system':
                subject = `⚠️ SYSTEM ALERT: ${data.subject}`;
                html = `
          <p>A system alert has been triggered:</p>
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #ea580c; color: #9a3412;">
            <p><strong>${data.message}</strong></p>
            <p style="margin-top: 10px; font-size: 0.9em;">Details: ${data.details || 'No additional details.'}</p>
          </div>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://crescentmooncocker.com'}/admin" class="btn">Login to Admin Portal</a>
          </p>
        `;
                break;

            default:
                return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
        }

        await sendAdminNotification(subject, html, replyTo);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in notify-admin API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
