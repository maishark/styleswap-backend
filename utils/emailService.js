const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send payment confirmation to user
const sendPaymentConfirmationEmail = async (user, order, paymentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Payment Confirmation - StyleSwap',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5; text-align: center;">Payment Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Your payment has been successfully processed.</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1F2937; margin-top: 0;">Payment Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">Amount: ৳${paymentDetails.amount}</li>
            <li style="margin: 10px 0;">Payment Method: ${paymentDetails.method}</li>
            <li style="margin: 10px 0;">Reference: ${paymentDetails.reference}</li>
            <li style="margin: 10px 0;">Date: ${new Date(paymentDetails.date).toLocaleString()}</li>
          </ul>
        </div>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1F2937; margin-top: 0;">Order Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">Order ID: ${order._id}</li>
            <li style="margin: 10px 0;">Product: ${order.product.name}</li>
            <li style="margin: 10px 0;">Rental Duration: ${order.duration} days</li>
          </ul>
        </div>
        
        <p>The product owner has been notified and will ship your item soon.</p>
        <p>Thank you for choosing StyleSwap!</p>
        
        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send notification to product owner
const sendOwnerNotificationEmail = async (owner, order, user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: owner.email,
    subject: 'New Rental Order - StyleSwap',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5; text-align: center;">New Rental Order</h1>
        <p>Dear ${owner.name},</p>
        <p>You have received a new rental order for your product.</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1F2937; margin-top: 0;">Order Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">Order ID: ${order._id}</li>
            <li style="margin: 10px 0;">Product: ${order.product.name}</li>
            <li style="margin: 10px 0;">Rental Duration: ${order.duration} days</li>
            <li style="margin: 10px 0;">Renter: ${user.name}</li>
          </ul>
        </div>
        
        <p>Please prepare the item for shipping. Once shipped, please update the order status in your dashboard.</p>
        <p>Thank you for being a part of StyleSwap!</p>
        
        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPaymentConfirmationEmail,
  sendOwnerNotificationEmail
};