import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import capturmail from '../models/capturmail.js';
import Order from '../models/Order.js';
import fs from 'fs/promises';

// __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TICKET_STORAGE_DIR = path.join(__dirname, '../tickets'); // Directory where PDFs are stored

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'lalberick@quantlake.com', // Your Gmail address
    pass: 'dckxxnactnmvaqct', // Your Gmail app password
  },
});

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
      from: 'lalberick@quantlake.com',
      to: email,
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
    await transporter.sendMail(msg);
    console.log('Email sent successfully');

    res.status(200).json({ message: 'Email stored and welcome email sent' });
  } catch (error) {
    console.error('Error storing email or sending message:', error);
    res.status(500).json({ message: 'Failed to store email or send message' });
  }
};

// Function to send tickets via email after they have been generated
export const sendTicketEmail = async (orderId) => {
  try {
    // Fetch the order and populate necessary fields
    const order = await Order.findById(orderId).populate('event').populate('user');
    if (!order) {
      throw new Error('Order not found');
    }

    const { event, generatedTickets } = order;

    // Check if generatedTickets exist and is an array
    if (!Array.isArray(generatedTickets) || generatedTickets.length === 0) {
      console.error('No generated tickets available');
      throw new Error('No generated tickets available');
    }

    console.log('Entering sendTicketEmail function');
    console.log('Order:', JSON.stringify(order));
    console.log('Event:', JSON.stringify(event));
    console.log('Generated Tickets in Email Function:', JSON.stringify(generatedTickets, null, 2));

    let attachments = [];

    console.log('Starting to collect generated PDFs for tickets...');

    for (const generatedTicket of generatedTickets) {
      const pdfFilePath = generatedTicket.pdfPath;

      console.log(`Checking for PDF file: ${pdfFilePath}`);
      try {
        // Check if the file exists
        await fs.access(pdfFilePath);

        // Read the file
        const fileContent = await fs.readFile(pdfFilePath);

        attachments.push({
          filename: path.basename(pdfFilePath),
          content: fileContent.toString('base64'), // Convert to base64
          encoding: 'base64', // Specify the encoding
          contentType: 'application/pdf',
          disposition: 'attachment',
        });
        console.log(`Attached PDF: ${pdfFilePath}`);
      } catch (err) {
        console.error(`PDF not found for ticket ID: ${generatedTicket.ticketId}`, err);
      }
    }

    if (attachments.length === 0) {
      console.error('No PDF files were found to attach. Email will not be sent.');
      throw new Error('No ticket PDFs found');
    }

    console.log('Preparing email with the generated tickets...');

    // Ensure we have a valid email address to send to
    const recipientEmail = order.user ? order.user.email : order.email;
    if (!recipientEmail) {
      throw new Error('No valid email address found for the order');
    }

    const msg = {
      from: 'lalberick@quantlake.com',
      to: recipientEmail,
      subject: `Your Tickets for ${event.name}`,
      text: 'Please find attached your tickets.',
      attachments: attachments,
    };

    console.log('Email message prepared:', JSON.stringify(msg));

    console.log('Attempting to send email...');
    await transporter.sendMail(msg);
    console.log('Tickets sent successfully to:', recipientEmail);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending ticket email:', error);
    throw error;
  }
};
