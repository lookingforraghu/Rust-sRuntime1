// Initialize Twilio client only if credentials are available
let client = null;
let twilio = null;

const initializeTwilio = () => {
  if (!twilio && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilio = require('twilio');
      client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    } catch (error) {
      console.log('Twilio not available:', error.message);
    }
  }
};

// Send SMS function
const sendSMS = async ({ to, message, from = process.env.TWILIO_PHONE_NUMBER }) => {
  try {
    initializeTwilio();
    
    if (!client) {
      console.log('SMS service not configured - skipping SMS send');
      return { success: false, error: 'SMS service not configured' };
    }
    
    const result = await client.messages.create({
      body: message,
      from: from,
      to: to,
    });
    
    console.log('SMS sent successfully:', result.sid);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send verification SMS
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
  const message = `Your Citizen Grievance System verification code is: ${verificationCode}. This code will expire in 10 minutes.`;
  
  return await sendSMS({
    to: phoneNumber,
    message,
  });
};

// Send grievance update SMS
const sendGrievanceUpdateSMS = async (phoneNumber, grievanceTitle, status) => {
  const message = `Grievance Update: "${grievanceTitle}" status changed to ${status}. Check the app for details.`;
  
  return await sendSMS({
    to: phoneNumber,
    message,
  });
};

// Send reward notification SMS
const sendRewardNotificationSMS = async (phoneNumber, rewardName) => {
  const message = `Congratulations! You've unlocked a new reward: ${rewardName}. Check the app to claim it!`;
  
  return await sendSMS({
    to: phoneNumber,
    message,
  });
};

// Send bulk SMS
const sendBulkSMS = async (recipients, message) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendSMS({
      to: recipient.phone,
      message,
    });
    results.push({ recipient, result });
  }
  
  return results;
};

module.exports = {
  sendSMS,
  sendVerificationSMS,
  sendGrievanceUpdateSMS,
  sendRewardNotificationSMS,
  sendBulkSMS,
};
