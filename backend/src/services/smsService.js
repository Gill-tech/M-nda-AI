/** SMS service using Twilio. */
const twilio = require('twilio');
const config = require('../config/config');

let twilioClient = null;

/**
 * Initialize Twilio client.
 */
const initTwilio = () => {
  if (twilioClient) {
    return twilioClient;
  }
  
  if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      config.TWILIO_ACCOUNT_SID,
      config.TWILIO_AUTH_TOKEN
    );
  } else {
    console.warn('Twilio credentials not configured. SMS functionality will be disabled.');
  return null;
  }
  
  return twilioClient;
};

/**
 * Send SMS message.
 */
const sendSMS = async (to, message) => {
  try {
    const client = initTwilio();
    
    if (!client) {
      console.log(`[MOCK SMS] To: ${to}, Message: ${message}`);
      return { success: true, mock: true };
    }
    
    if (!config.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio phone number not configured');
      return { success: false, error: 'Twilio phone number not configured' };
    }
    
    const result = await client.messages.create({
      body: message,
      from: config.TWILIO_PHONE_NUMBER,
      to: to,
    });
    
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send water alert SMS.
 */
const sendWaterAlert = async (phoneNumber, litersNeeded, message) => {
  const smsMessage = `⚠️ Múnda AI Alert: ${message}`;
  return await sendSMS(phoneNumber, smsMessage);
};

/**
 * Send summary report SMS.
 */
const sendSummaryReport = async (phoneNumber, summary) => {
  // Truncate if too long (SMS limit is 1600 characters, but we'll use 500 for safety)
  const truncatedSummary = summary.length > 500 
    ? summary.substring(0, 497) + '...'
    : summary;
  
  const smsMessage = `📊 Múnda AI Report:\n\n${truncatedSummary}`;
  return await sendSMS(phoneNumber, smsMessage);
};

module.exports = {
  sendSMS,
  sendWaterAlert,
  sendSummaryReport,
};

