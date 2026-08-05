import twilio from 'twilio';

export const sendSms = async ({ to, message }) => {
  try {
    const { 
      TWILIO_ACCOUNT_SID, 
      TWILIO_AUTH_TOKEN, 
      TWILIO_PHONE_NUMBER,
      TWILIO_API_KEY_SID,
      TWILIO_API_KEY_SECRET
    } = process.env;

    let formattedTo = to.trim().replace(/[\s\-\(\)]/g, '');
    if (formattedTo.startsWith('0') && formattedTo.length === 11) {
      formattedTo = formattedTo.substring(1);
    }
    if (!formattedTo.startsWith('+')) {
      if (formattedTo.length === 10) {
        formattedTo = `+91${formattedTo}`;
      } else {
        formattedTo = `+${formattedTo}`;
      }
    }

    const hasAuthToken = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN;
    const hasApiKey = TWILIO_API_KEY_SID && TWILIO_API_KEY_SECRET && TWILIO_ACCOUNT_SID;

    // If Twilio credentials are provided, send a real SMS message
    if ((hasAuthToken || hasApiKey) && TWILIO_PHONE_NUMBER) {
      // Prioritize primary Auth Token for better permission reliability
      const client = hasAuthToken
        ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        : twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
      
      const response = await client.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: formattedTo
      });

      console.log(`\n------------------ [SMS DISPATCHED (REAL TWILIO)] ------------------`);
      console.log(`To Mobile: ${to}`);
      console.log(`Message SID: ${response.sid}`);
      console.log(`Status: Sent successfully via Twilio Gateway`);
      console.log(`--------------------------------------------------------------------\n`);

      return { success: true, sid: response.sid, provider: 'Twilio Gateway' };
    } else {
      // Fallback mode if no Twilio credentials are configured in .env
      console.log(`\n------------------ [SMS DISPATCHED (SIMULATED FALLBACK)] ------------------`);
      console.log(`To Mobile: ${to}`);
      console.log(`Message: ${message}`);
      console.log(`Warning: Twilio credentials missing in .env.`);
      console.log(`Status: SIMULATED SUCCESS (Fallback Mode)`);
      console.log(`----------------------------------------------------------------------------\n`);
      return { success: true, simulated: true, provider: 'Simulated Gateway' };
    }
  } catch (error) {
    // Catch Twilio API connection errors, log warnings and proceed gracefully
    console.log(`\n================== [SMS WARNING - GATEWAY FAILURE] ==================`);
    console.log(`To Mobile: ${to}`);
    console.log(`Error Reason: ${error.message}`);
    console.log(`Status: Twilio SMS dispatch failed (check configuration or credentials).`);
    console.log(`Fallback: Proceeding successfully. Retrieve OTP from terminal logs above.`);
    console.log(`=====================================================================\n`);
    return { success: false, simulated: true, error: error.message };
  }
};
