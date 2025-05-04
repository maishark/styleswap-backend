const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-password',
      },
    });

    // For development, log instead of actually sending
    if (process.env.NODE_ENV === 'development') {
      console.log('======= EMAIL WOULD BE SENT =======');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Body:', options.html || options.text);
      console.log('==================================');
      return;
    }

    // Define email options
    const mailOptions = {
      from: `StyleSwap <${process.env.EMAIL_FROM || 'noreply@styleswap.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = sendEmail;