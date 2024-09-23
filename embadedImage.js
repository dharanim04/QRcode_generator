const express = require("express");
const app = express();
const { QRCodeCanvas } = require("@loskir/styled-qr-code-node");
const path = require("path");
const multer = require('multer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder for frontend
app.use(express.static("public"));
const upload = multer({ dest: 'uploads/' });

// Serve index.html on root '/'
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "UrlGenerate.html"));
// });
// QR Code generation endpoint
app.post("/generateurl", upload.single('logo') ,async (req, res) => {
  const { data } = req.body;
  const logoFilePath = req.file.path;

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }
  try {
    const qrCode = new QRCodeCanvas({
      data: data,
      image: logoFilePath, // Path to the logo
    });
    // Define the output file path
    const outputFilePath = path.join(__dirname, "public","qrcodes", "qr_with_logo.png");
    await qrCode.toFile(outputFilePath);

    res.sendFile(outputFilePath);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Start the server
const port = 3002;
app.listen(port, () => {
  console.log(`QR Code generator app listening at http://localhost:${port}`);
});
