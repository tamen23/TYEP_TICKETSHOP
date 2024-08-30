import PDFDocument from 'pdfkit';
import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateTicketPDF = async (order, ticket, event, userDetails, pdfFilePath) => {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({
        size: [450, 450], // Adjusted the size to fit the content properly
      });

      const stream = fs.createWriteStream(pdfFilePath);

      doc.pipe(stream);

      // Place the event name alone at the top
      doc
        .fontSize(25)
        .text(event.name, { align: 'center' }) // Align event name at the center
        .moveDown(1); // Add some space after the event name

      // Ticket details
      doc
        .fontSize(12)
        .text(`Name: ${userDetails.firstName} ${userDetails.lastName}`, 50, 100)
        .moveDown(0.5);

      // Safely access category, ensuring ticket.ticket exists
      const category = ticket?.category || 'N/A';
      doc
        .fontSize(12)
        .text(`Category: ${category}`, 50, 115)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Email: ${userDetails.email}`, 50, 130)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Date: ${new Date(event.date).toLocaleDateString()}`, 50, 145)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Location: ${event.city}, ${event.country}`, 50, 160)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Venue: ${event.venue}`, 50, 175)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Ticket ID: ${ticket._id}`, 50, 190)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Order ID: ${order._id}`, 50, 205)
        .moveDown(0.5);

      // Generate QR code
      try {
        const qrCodeImage = await QRCode.toBuffer(`https://example.com/ticket/${ticket._id}`, { type: 'png' });
        doc.image(qrCodeImage, 330, 115, { width: 70, height: 70 }); // Adjust position if necessary
      } catch (err) {
        return reject(err);
      }

      doc.end();

      stream.on('finish', () => {
        console.log(`Ticket created and stored in: ${pdfFilePath}`);
        resolve(pdfFilePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
};
