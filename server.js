const express = require('express');
const path = require('path');
const emailRoute = require('./routes/email');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/send-email', emailRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
