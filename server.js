const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Handle the form submission
app.post('/submit-order', (req, res) => {
    const { name, email, phone, order, total, delivery, location, payment, proofOfPayment } = req.body;

    // Create a new workbook and worksheet, or load the existing file
    const filePath = path.join('C:', 'Users', 'samba', 'OneDrive', 'Desktop', 'bhebhe site', 'orders.xlsx');
    let workbook;
    let worksheet;

    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.aoa_to_sheet([['Name', 'Email', 'Phone', 'Order', 'Total', 'Delivery/Collection', 'Location', 'Payment Method', 'Proof of Payment']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');
    }

    // Append the new data
    const newRow = [[name, email, phone, order, total, delivery, location, payment, proofOfPayment]];
    xlsx.utils.sheet_add_aoa(worksheet, newRow, { origin: -1 });

    // Save the Excel file
    xlsx.writeFile(workbook, filePath);

    res.json({ message: 'Order placed successfully!' });
});

// Serve the frontend form
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
