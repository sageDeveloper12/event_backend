// server.js or app.js (Express server file)
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 5000;



app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({
  dest: 'uploads/', // Directory to save uploaded files
  limits: { fileSize: 50 * 1024 * 1024 } // Optional: set file size limit
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.array('files', 10), (req, res) => {
  // req.files will contain information about the uploaded files
  res.json({
    message: 'Files uploaded successfully',
    files: req.files
  });
});

// server.js or app.js (Express server file)

// Get list of uploaded files
app.get('/media', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadDir = path.join(__dirname, 'uploads');
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Unable to list files' });
      return;
    }
    res.json({ files });
  });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

