const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { takeScreenshot } = require('../services/screenshot');
const { sendMail } = require('../services/sendMail');

const router = express.Router();

// Configure multer
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
  const email = req.body.email;

  // ✅ Validation: check file and email
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No HTML file uploaded.'
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Receiver email is required.'
    });
  }

  const htmlPath = path.resolve(file.path);
  const screenshotPath = `screenshots/screenshot-${Date.now()}.png`;

  try {
    console.log(`📄 HTML uploaded: ${htmlPath}`);

    await takeScreenshot(htmlPath, screenshotPath);
    await sendMail(screenshotPath, email);

    console.log(`📤 Email sent to ${email} with screenshot: ${screenshotPath}`);

    res.status(200).json({
      success: true,
      message: `✅ Email sent to ${email} successfully!`
    });

    // ⏳ Auto-delete screenshot after 5 minutes
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
    // 🧹 Always remove the uploaded HTML
    fs.unlink(htmlPath, err => {
      if (err) console.warn('⚠️ Failed to delete uploaded HTML:', err);
    });
  }
});

module.exports = router;
