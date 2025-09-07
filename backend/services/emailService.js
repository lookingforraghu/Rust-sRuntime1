const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Email Verification - Citizen Grievance System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2E7D32; color: white; padding: 20px; text-align: center;">
          <h1>🏛️ Citizen Grievance System</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${data.name}!</h2>
          <p>Thank you for registering with the Citizen Grievance System. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" style="background-color: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">If you didn't create an account with us, please ignore this email.</p>
        </div>
      </div>
    `,
  }),
  
  passwordReset: (data) => ({
    subject: 'Password Reset Request - Citizen Grievance System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2E7D32; color: white; padding: 20px; text-align: center;">
          <h1>🏛️ Citizen Grievance System</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Password Reset Request</h2>
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background-color: #FF5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      </div>
    `,
  }),
  
  grievanceUpdate: (data) => ({
    subject: 'Grievance Update - Citizen Grievance System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2E7D32; color: white; padding: 20px; text-align: center;">
          <h1>🏛️ Citizen Grievance System</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Grievance Update</h2>
          <p>Hello ${data.name},</p>
          <p>Your grievance has been updated:</p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>${data.grievanceTitle}</h3>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Update:</strong> ${data.comment}</p>
          </div>
          <p>You can track your grievance status in the mobile app.</p>
        </div>
      </div>
    `,
  }),
  
  rewardUnlocked: (data) => ({
    subject: 'Reward Unlocked! - Citizen Grievance System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FFD700; color: #333; padding: 20px; text-align: center;">
          <h1>🏆 Reward Unlocked!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Congratulations ${data.name}!</h2>
          <p>You've unlocked a new reward:</p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">
            <h3>${data.rewardName}</h3>
            <p>${data.rewardDescription}</p>
            <p><strong>Points Earned:</strong> ${data.points}</p>
          </div>
          <p>Check your rewards section in the app to claim your reward!</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Citizen Grievance System'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, emailData) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail({
      ...emailData,
      email: recipient.email,
      data: { ...emailData.data, name: recipient.name },
    });
    results.push({ recipient, result });
  }
  
  return results;
};

// Send email verification
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  
  return await sendEmail({
    email: user.email,
    template: 'emailVerification',
    data: {
      name: user.name,
      verificationUrl,
    },
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  return await sendEmail({
    email: user.email,
    template: 'passwordReset',
    data: {
      name: user.name,
      resetUrl,
    },
  });
};

// Send grievance update email
const sendGrievanceUpdateEmail = async (user, grievance, update) => {
  return await sendEmail({
    email: user.email,
    template: 'grievanceUpdate',
    data: {
      name: user.name,
      grievanceTitle: grievance.title,
      status: update.status,
      comment: update.comment,
    },
  });
};

// Send reward notification email
const sendRewardNotificationEmail = async (user, reward) => {
  return await sendEmail({
    email: user.email,
    template: 'rewardUnlocked',
    data: {
      name: user.name,
      rewardName: reward.name,
      rewardDescription: reward.description,
      points: reward.points,
    },
  });
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendGrievanceUpdateEmail,
  sendRewardNotificationEmail,
  templates,
};
