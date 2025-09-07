const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@citizengrievance.gov',
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(phone, message) {
    // Mock SMS service for now
    console.log(`SMS to ${phone}: ${message}`);
    return { success: true, message: 'SMS sent successfully' };
  }

  async sendPushNotification(userId, title, body) {
    // Mock push notification service for now
    console.log(`Push notification to ${userId}: ${title} - ${body}`);
    return { success: true, message: 'Push notification sent successfully' };
  }
}

module.exports = new NotificationService();
