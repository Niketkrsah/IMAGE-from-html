function generateReportTemplate({
  App_Name,
  App_Version,
  Environment,
  Execution_Date,
  Detail_Link,
  Rerun_Link
}) {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000;">
      <p><strong>[Note: This is a computer generated email]</strong></p>

      <p>
        <strong>Dear Team,</strong><br><br>
        Please find the <strong>${App_Name}</strong> API Automation results for the
        <strong>${Environment}</strong> environment below:
      </p>

      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 800px;">
        <thead>
          <tr style="background-color: #004C97; color: white;">
            <th colspan="2" style="text-align: center; padding: 10px;">Jio ${App_Name} API Automation Details:</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #d4e3fc;">
            <td style="padding: 8px; border: 1px solid #000;"><strong>App Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #000;">${App_Name}</td>
          </tr>
          <tr style="background-color: #d4e3fc;">
            <td style="padding: 8px; border: 1px solid #000;"><strong>App Version:</strong></td>
            <td style="padding: 8px; border: 1px solid #000;">${App_Version}</td>
          </tr>
          <tr style="background-color: #d4e3fc;">
            <td style="padding: 8px; border: 1px solid #000;"><strong>Environment:</strong></td>
            <td style="padding: 8px; border: 1px solid #000;">${Environment}</td>
          </tr>
          <tr style="background-color: #d4e3fc;">
            <td style="padding: 8px; border: 1px solid #000;"><strong>Execution Time:</strong></td>
            <td style="padding: 8px; border: 1px solid #000;">${Execution_Date}</td>
          </tr>
        </tbody>
      </table>

      <h3>Test Report:</h3>
      <img src="cid:reportImage" style="width: 100%; max-width: 700px; border: 1px solid #ccc;" />

      <p>
        To view the detail result, please <a href="${Detail_Link || '#'}">click here</a>.<br>
        To re-run the complete test suite, please <a href="${Rerun_Link || '#'}">click here</a>.
      </p>

      <p><strong>Best Regards,</strong><br>Jio Automation Team</p>
    </div>
  `;
}

module.exports = { generateReportTemplate };
