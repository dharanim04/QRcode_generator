const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static('public'));

// Serve index.html on root '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// QR Code generation endpoint
app.post('/generate', async (req, res) => {
  const { firstname, lastname, mobileNumber, address } =req.body;
  if (!firstname || !mobileNumber) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  const vCard =` BEGIN:VCARD
VERSION:3.0
N:${lastname};${firstname}
FN:${firstname} ${lastname}
ADR:${address};;;;;;
TEL;WORK;VOICE:
TEL;CELL:${mobileNumber}
TEL;FAX:
EMAIL;WORK;INTERNET:
URL:
END:VCARD`;

  //working
//   const vCard =` BEGIN:VCARD
// VERSION:3.0
// N:test2;dtest
// FN:dtest test2
// ADR:;;;;;;
// TEL;WORK;VOICE:
// TEL;CELL:4566sdf
// TEL;FAX:
// EMAIL;WORK;INTERNET:
// URL:
// END:VCARD`;

  try {
    // Generate QR code
    const qrCode = await QRCode.toDataURL(vCard.trim());
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`QR Code generator app listening at http://localhost:${port}`);
});
