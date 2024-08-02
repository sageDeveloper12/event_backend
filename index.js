const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const port = port = process.env.PORT || 5000
const app = express();

const PASSWORD = 'segun&tomi'; 

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.array('files', 10), (req, res) => {
  res.json({
    message: 'Files uploaded successfully',
    files: req.files
  });
});

// Get list of uploaded files
app.get('/media', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Unable to list files' });
      return;
    }
    res.json({ files });
  });
});

// Delete a file
app.delete('/media/:filename', express.json(), (req, res) => {
  const { password } = req.body;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (password !== PASSWORD) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
