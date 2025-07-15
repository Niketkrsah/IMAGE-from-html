const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { take_screenshot } = require('../services/screenshot');
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

// POST /email — handles the email send logic
router.post('/', upload.single('html'), async (req, res) => {
  const file = req.file;

  // Validate uploaded file
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No HTML file uploaded.'
    });
  }

  const {
    email,
    appName,
    appVersion,
    environment,
    executionDate,
    detailLink,
    rerunLink
  } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Receiver email is required.'
    });
  }

  const htmlPath = path.resolve(file.path);
  const screenshotPath = `screenshots/screenshot-${Date.now()}.png`;
  console.log(screenshotPath);

  try {
    console.log(`📄 HTML uploaded: ${htmlPath}`);

    // Take screenshot
    await take_screenshot(htmlPath, screenshotPath);

    // Send mail with metadata
    await sendMail(screenshotPath, email, {
      App_Name: appName,
      App_Version: appVersion,
      Environment: environment,
      Execution_Date: executionDate,
      Detail_Link: detailLink,
      Rerun_Link: rerunLink,
    });

    console.log(`📤 Email sent with screenshot: ${screenshotPath}`);

    res.status(200).json({
      success: true,
      message: '✅ Email sent successfully!'
    });

    // Auto-delete screenshot after 5 minutes
    setTimeout(() => {
      fs.unlink(screenshotPath, err => {
        if (err) console.error('❌ Failed to delete screenshot:', err);
        else console.log('🧹 Screenshot deleted after 5 minutes:', screenshotPath);
      });
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('💥 Error:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Failed to process or send email.'
    });
  } finally {
    // Always remove uploaded HTML
    fs.unlink(htmlPath, err => {
      if (err) console.warn('⚠️ Failed to delete uploaded HTML:', err);
    });
  }
});

module.exports = router;
