const express = require('express');
const QRCode = require('qrcode');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder for frontend
app.use(express.static('public'));

// Serve index.html on root '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'UrlGenerate.html'));
  });
// QR Code generation endpoint
app.post('/generateurl', async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    // Generate QR code
    const qrCode = await QRCode.toDataURL(data);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`QR Code generator app listening at http://localhost:${port}`);
});
