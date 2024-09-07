const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/your/credentials.json', // You need to create this file
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1kLHFUj_AuazaQWIPeZMD5jSYHnQJxJOEL100CMCsSiE';

// Handle the form submission
app.post('/submit-order', async (req, res) => {
    const { name, email, phone, order, total, delivery, location, payment, proofOfPayment } = req.body;

    try {
        // Append the new data to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1', // Adjust if your sheet has a different name
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[name, email, phone, order, total, delivery, location, payment, proofOfPayment]],
            },
        });

        res.json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
        res.status(500).json({ message: 'Error placing order. Please try again.' });
    }
});

// Serve the frontend form
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});