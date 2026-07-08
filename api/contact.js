import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message, bookingSlot } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const meetLink = "https://meet.google.com/cxt-zhoo-fje";

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background-color: #0C0C0C; padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 40px 30px; color: #333333; }
        .content h2 { margin-top: 0; font-size: 20px; color: #0C0C0C; }
        .meeting-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
        .meeting-box p { margin: 8px 0; font-size: 15px; }
        .meeting-box strong { color: #0C0C0C; display: inline-block; width: 100px; }
        .meet-link { display: inline-block; background-color: #0C0C0C; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 15px; text-align: center; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; }
        .details-table td:first-child { font-weight: bold; color: #64748b; width: 120px; }
        .message-box { background-color: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; margin-top: 10px; border-left: 4px solid #0C0C0C; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Prixuslabs</h1>
        </div>
        <div class="content">
          <h2>New Strategy Session Booked!</h2>
          <p>A new appointment has been scheduled.</p>
          
          <div class="meeting-box">
            <p><strong>Date & Time:</strong> ${bookingSlot || 'Flexible / TBD'}</p>
            <p><strong>Duration:</strong> 30 Minutes</p>
            <p><strong>Location:</strong> Google Meet</p>
            <a href="${meetLink}" class="meet-link">Join Google Meet</a>
          </div>

          <h3>Client Details</h3>
          <table class="details-table">
            <tr>
              <td>Name</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td><a href="mailto:${email}" style="color: #0C0C0C; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>${phone || 'Not provided'}</td>
            </tr>
          </table>
          
          ${message ? `
            <div style="margin-top: 25px;">
              <strong style="color: #64748b; font-size: 15px;">Project Details / Message:</strong>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Prixuslabs. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send to Site Owner
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.SMTP_EMAIL,
      subject: `New Booking: ${name} - ${bookingSlot || 'Strategy Session'}`,
      html: emailHTML
    });

    // Send confirmation to Client
    await transporter.sendMail({
      from: `"Prixuslabs" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Booking Confirmed: Prixuslabs Strategy Session`,
      html: emailHTML.replace('New Strategy Session Booked!', 'Your Booking is Confirmed!').replace('A new appointment has been scheduled.', 'We look forward to speaking with you. Here are your meeting details:')
    });

    return res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
}
