const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { takeScreenshot } = require('../services/screenshot');
const { sendMail } = require('../services/sendMail');

const router = express.Router();

// Configure multer (no size limit)
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/html') {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed.'));
    }
  }
});

router.post('/', upload.single('html'), async (req, res) => {
  const file = req.file;

  // Validation: check if file exists
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No HTML file uploaded.'
    });
  }

  const htmlPath = path.resolve(file.path);
  const screenshotPath = `screenshots/screenshot-${Date.now()}.png`;

  try {
    console.log(`📄 HTML uploaded: ${htmlPath}`);

    await takeScreenshot(htmlPath, screenshotPath);
    await sendMail(screenshotPath);

    console.log(`📤 Email sent with screenshot: ${screenshotPath}`);

    res.status(200).json({
      success: true,
      message: '✅ Email sent successfully!'
    });

    // Schedule screenshot deletion after 5 minutes
    setTimeout(() => {
      fs.unlink(screenshotPath, err => {
        if (err) {
          console.error('❌ Failed to delete screenshot:', err);
        } else {
          console.log('🧹 Screenshot deleted after 5 minutes:', screenshotPath);
        }
      });
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('💥 Error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Failed to process or send email.'
    });
  } finally {
    // Always remove uploaded HTML file
    fs.unlink(htmlPath, err => {
      if (err) console.warn('⚠️ Failed to delete uploaded HTML:', err);
    });
  }
});

module.exports = router;
