import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, Object, message } = req.body;
    
    // Save the contact in the database
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      Object,
      message,
    });

    await newContact.save();

    // SMTP transporter configuration
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'lalberick@quantlake.com', // Your Gmail address
        pass: 'dckxxnactnmvaqct', // Your Gmail app password
      },
    });

    // Define the email content
    let mailOptions = {
      from: '"QuantLake Contact" <lalberick@quantlake.com>', // Sender address
      to: email, // Receiver address
      subject: `Confirmation de réception: ${Object}`, // Subject line
      text: `Bonjour ${firstName},\n\nMerci de nous avoir contactés. Nous avons bien reçu votre message: "${message}".\n\nCordialement,\nL'équipe QuantLake`, // Plain text body
      html: `<p>Bonjour ${firstName},</p><p>Merci de nous avoir contactés. Nous avons bien reçu votre message:</p><blockquote>${message}</blockquote><p>Cordialement,</p><p>L'équipe QuantLake</p>`, // HTML body
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    res.status(201).json({ message: 'Contact saved and email sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error saving contact and sending email', error });
  }
};

export default createContact;
