import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


 // Email to YOU (admin)
export const sendAdminNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  await resend.emails.send({
    from: `Portfolio <${process.env.SENDER_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: subject || `New message from ${name}`,
    html: `
      <h2>📩 New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

  // Auto-reply email to USER
export const sendAutoReply = async ({ name, email }) => {
  await resend.emails.send({
    from: `Ayush Pal <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `
      <p>Hi ${name},</p>

      <p>Thank you for getting in touch through my portfolio.</p>

      <p>I’ve received your message and will get back to you as soon as possible.</p>

      <p>Best regards,<br/>
      <strong>Ayush Pal</strong><br/>
      Full Stack Developer</p>

      <hr/>
      <p style="font-size:12px;color:#888;">
        This is an automated response. Please don’t reply to this email.
      </p>
    `,
  });
};
