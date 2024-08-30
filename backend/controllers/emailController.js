import sgMail from '../config/sendgrid.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import capturmail from '../models/capturmail.js';

// __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TICKET_STORAGE_DIR = path.join(__dirname, '../tickets'); // Directory where PDFs are stored

// Controller function to handle email storage and sending
export const storeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingEmail = await capturmail.findOne({ email });

    if (!existingEmail) {
      const newEmail = new capturmail({ email });
      await newEmail.save();
    }

    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Welcome to Our Event Platform',
      text: 'Thank you for registering your email. We will keep you updated with the latest events!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #0066cc; text-align: center;">Welcome to Our Event Platform!</h1>
          <p>Thank you for registering your email. We will keep you updated with the latest events!</p>
          <h2 style="color: #0066cc;">Stay Updated:</h2>
          <p>As a valued member, you will receive weekly notifications about upcoming interesting events. We hope you find these updates helpful and exciting.</p>
          <p>If you have any questions or need further assistance, please don't hesitate to contact us at <a href="mailto:support@example.com">support@example.com</a> or <a href="tel:+1234567890">+1 234 567 890</a>.</p>
          <p>We look forward to seeing you at the event and keeping you informed about future events!</p>
          <p>Best regards,</p>
          <p>The Event Platform Team</p>
        </div>
      `,
    };

    console.log('Sending email to:', email);
    await sgMail.send(msg);
    console.log('Email sent successfully');
    
    res.status(200).json({ message: 'Email stored and welcome email sent' });
  } catch (error) {
    console.error('Error storing email or sending message:', error);
    res.status(500).json({ message: 'Failed to store email or send message' });
  }
};

// Function to send tickets via email after they have been generated
export const sendTicketEmail = async (order, event, userDetails) => {
    console.log('Entering sendTicketEmail function');
    console.log('Order:', JSON.stringify(order));
    console.log('Event:', JSON.stringify(event));
    console.log('User Details:', JSON.stringify(userDetails));
  
    let attachments = [];
  
    console.log('Starting to collect generated PDFs for tickets...');
  
    for (const ticket of order.tickets) {
      const pdfFileName = `${ticket._id}_ticket.pdf`;
      const pdfFilePath = path.join(TICKET_STORAGE_DIR, pdfFileName);
  
      console.log(`Checking for PDF file: ${pdfFilePath}`);
      if (fs.existsSync(pdfFilePath)) {
        attachments.push({
          filename: pdfFileName,
          path: pdfFilePath,
          contentType: 'application/pdf',
        });
        console.log(`Attached PDF: ${pdfFilePath}`);
      } else {
        console.error(`PDF not found for ticket ID: ${ticket._id}`);
      }
    }
  
    if (attachments.length === 0) {
      console.error('No PDF files were found to attach. Email will not be sent.');
      return;
    }
  
    console.log('Preparing email with the generated tickets...');
    const msg = {
      to: userDetails.email,
      from: process.env.EMAIL_USER,
      subject: `Your Tickets for ${event.name}`,
      text: 'Please find attached your tickets.',
      attachments: attachments,
    };
  
    console.log('Email message prepared:', JSON.stringify(msg));
  
    try {
      console.log('Attempting to send email...');
      await sgMail.send(msg);
      console.log('Tickets sent successfully to:', userDetails.email);
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('SendGrid API Key:', process.env.SENDGRID_API_KEY);
      throw error;
    }
  };
