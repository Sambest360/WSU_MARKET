const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const twilio = require('twilio');
const app = express();

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle order submission
app.post('/submit-order', upload.single('proof'), async (req, res) => {
    try {
        console.log('Received order submission');
        const { name, phone, delivery, location, payment, order } = req.body;
        const proof = req.file;

        console.log('Order details:', { name, phone, delivery, location, payment, order });

        // Handle WhatsApp notification using Twilio
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        console.log('Sending WhatsApp notification');
        await client.messages.create({
            body: `New Order from ${name} - ${order}\nDelivery: ${delivery}\nLocation: ${location}`,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: 'whatsapp:+27678224015'  // Your WhatsApp number
        });

        // Handle email notification using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log('Sending email notification');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sambampo200@gmail.com',  // Your email address
            subject: 'New Order Received',
            text: `Order Details: \nName: ${name}\nPhone: ${phone}\nDelivery: ${delivery}\nLocation: ${location}\nPayment: ${payment}\nOrder: ${order}`,
            attachments: proof ? [{ path: proof.path }] : []
        };

        await transporter.sendMail(mailOptions);

        console.log('Order processed successfully');
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ message: 'An error occurred while processing your order', error: error.message });
    }
});

// Route to handle clearing the order
app.post('/clear-order', (req, res) => {
    console.log('Received clear order request');
    res.status(200).json({ message: 'Order cleared successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});
