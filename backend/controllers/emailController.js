import sgMail from '../config/sendgrid.js';
import capturmail from '../models/capturmail.js';

// Controller function to handle email storage and sending
export const storeEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the email already exists in the database
        const existingEmail = await capturmail.findOne({ email });

        if (!existingEmail) {
            // Save email to the database if it does not exist
            const newEmail = new capturmail({ email });
            await newEmail.save();
        }

        // Send a welcome email regardless of whether the email was just added or already existed
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
