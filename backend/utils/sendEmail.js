import nodemailer from 'nodemailer';
import axios from 'axios';

export const sendEmail = async ({ to, subject, text, html }) => {
  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
    RESEND_API_KEY,
    RESEND_FROM,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
  } = process.env;

  try {
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      console.log(`[EMAILJS] Attempting dispatch to ${to}...`);

      const emailjsPayload = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: to,
          subject: subject,
          message: text,
          html_message: html,
          to_name: to.split('@')[0]
        }
      };

      console.log(`[EMAILJS_DEBUG] Payload:`, JSON.stringify(emailjsPayload, null, 2));

      try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsPayload, {
          headers: { 'Content-Type': 'application/json' }
        });

        console.log(`\n------------------ [EMAIL DISPATCHED (REAL EMAILJS)] ------------------`);
        console.log(`To: ${to} | Status: ${response.status} ${response.statusText}`);
        console.log(`Response Data: ${JSON.stringify(response.data)}`);
        console.log(`-----------------------------------------------------------------------\n`);
        return { success: true, provider: 'EmailJS', data: response.data };
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;
        console.error(`[EMAILJS FAIL] Status: ${status} | Detail: ${typeof data === 'object' ? JSON.stringify(data) : data}`);
        // If 403, it means authentication failed. We will fall through to other providers.
        if (status !== 403) throw err;
      }
    }

    // --- OPTION 2: RESEND (HTTPS API) ---
    if (RESEND_API_KEY) {
      console.log(`[RESEND] Attempting dispatch to ${to}...`);
      const response = await axios.post('https://api.resend.com/emails', {
        from: RESEND_FROM || 'Medi Consult <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: text,
        html: html
      }, {
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`\n------------------ [EMAIL DISPATCHED (REAL RESEND)] ------------------`);
      console.log(`To: ${to} | ID: ${response.data?.id}`);
      console.log(`----------------------------------------------------------------------\n`);
      return { success: true, provider: 'Resend', data: response.data };
    }

    // --- OPTION 3: NODEMAILER (GMAIL/SMTP) ---
    if (SMTP_USER && SMTP_PASS) {
      console.log(`[SMTP] Attempting dispatch via Nodemailer...`);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });

      const info = await transporter.sendMail({
        from: SMTP_FROM || `"Medi Consult" <${SMTP_USER}>`,
        to,
        subject,
        text,
        html
      });

      console.log(`\n------------------ [EMAIL DISPATCHED (SMTP)] ------------------`);
      console.log(`To: ${to} | MsgID: ${info.messageId}`);
      console.log(`---------------------------------------------------------------\n`);
      return { success: true, provider: 'SMTP', info };
    }

    throw new Error('No valid email provider configured in environment variables.');

  } catch (error) {
    console.log(`\n------------------ [EMAIL DISPATCHED (SIMULATED FALLBACK)] ------------------`);
    console.log(`To Email: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`OTP Code: ${text.match(/\d{6}/)?.[0] || 'N/A'}`);
    console.log(`Error: ${error.message}`);
    console.log(`Status: SIMULATED SUCCESS (Retrieve code from logs above)`);
    console.log(`-----------------------------------------------------------------------------\n`);

    return {
      success: false, 
      simulated: true, 
      message: 'Physical dispatch failed. Using Terminal Sync.',
      error: error.message 
    };
  }
};
