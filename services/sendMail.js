const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendMail(screenshotPath, receiverEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'niketkrsah@gmail.com',
      pass: 'chxymumrpfdxiyfs'
    }
  });

  const mailOptions = {
    from: 'niketkrsah@gmail.com',
    to: receiverEmail,
    subject: '📊 HTML Report Screenshot',
    html: `
      <h2>📋 Test Report</h2>
      <img src="cid:reportImage" style="width:100%; max-width:900px; border:1px solid #ccc;" />
    `,
    attachments: [
      {
        filename: 'report.png',
        path: screenshotPath,
        cid: 'reportImage'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
