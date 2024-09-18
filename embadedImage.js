const express = require("express");
// const QRCode = require('qrcode');
const app = express();
const { QRCodeCanvas } = require("@loskir/styled-qr-code-node");
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder for frontend
app.use(express.static("public"));

// Serve index.html on root '/'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "UrlGenerate.html"));
});
// QR Code generation endpoint
app.post("/generateurl", async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }

  try {
    const qrCode = new QRCodeCanvas({
      data: data,
      image: path.join(__dirname, "public", "IDY Logo.png"), // Path to the logo
    });
    // await qrCode.toFile("./public/output.png", "png");
    // Define the output file path
    const outputFilePath = path.join(__dirname, "public", "qr_with_logo.png");
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
