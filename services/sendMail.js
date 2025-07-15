const nodemailer = require('nodemailer');
const { generateReportTemplate } = require('./generateReportTemplate');

async function sendMail(screenshotPath, receiverEmail, meta) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'niketkrsah@gmail.com',
      pass: 'chxymumrpfdxiyfs'
    }
  });

  // Attach receiver email to meta (for template)
  const finalMeta = {
    ...meta,
    EmailRecipients: receiverEmail
  };

  const htmlBody = generateReportTemplate(finalMeta);

  const mailOptions = {
    from: 'niketkrsah@gmail.com',
    to: receiverEmail,
    subject: `${finalMeta.App_Name} API Automation Result - ${finalMeta.Environment} Environment`,
    html: htmlBody,
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
